#!/usr/bin/env node
/**
 * Migrate any legacy students / exam passes from the old MySQL databases into
 * content/data/certificates.json so they are verifiable at the public endpoint.
 *
 * Idempotent — skips entries already present by certificateNumber or holder+dob.
 *
 *   cd eiosh-next && node scripts/migrate-legacy-certs.mjs
 */
import mysql from "mysql2/promise";
import { promises as fs } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "content", "data", "certificates.json");

async function loadCerts() {
    try {
        const raw = await fs.readFile(OUT, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

async function saveCerts(certs) {
    await fs.writeFile(OUT, JSON.stringify(certs, null, 2), "utf-8");
}

async function main() {
    const certs = await loadCerts();
    const byCertNumber = new Set(certs.map((c) => String(c.certificateNumber || "").toLowerCase()));
    const byHolder = new Set(certs.map((c) => String(c.holder || "").toLowerCase().trim()));

    const conn = await mysql.createConnection({
        host: "127.0.0.1", user: "root", password: "", database: "eiosh_new",
    });

    const [rows] = await conn.execute(
        `SELECT id, name, email, phone, percentage, obtained_marks, total_marks, result_status, created_at
         FROM students
         WHERE result_status = 'pass' AND name IS NOT NULL`
    );

    let added = 0;
    let nextId = Math.max(0, ...certs.map((c) => Number((c.id || "").replace(/^cert-/, "")) || 0)) + 1;

    for (const r of rows) {
        const holder = String(r.name).trim();
        if (byHolder.has(holder.toLowerCase())) continue;

        // Build a synthetic certificate number "LEGACY-<student id>"
        const certNumber = `LEGACY-${String(r.id).padStart(5, "0")}`;
        if (byCertNumber.has(certNumber.toLowerCase())) continue;

        const issued = r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : null;
        const expiry = issued
            ? new Date(new Date(r.created_at).getTime() + 3 * 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
            : null;

        certs.push({
            id: `cert-${nextId++}`,
            holder,
            certificateNumber: certNumber,
            registrationNumber: null,
            course: "EIOSH legacy examination",
            issueDate: issued,
            expiryDate: expiry,
            company: null,
        });
        byCertNumber.add(certNumber.toLowerCase());
        byHolder.add(holder.toLowerCase());
        added++;
        console.log(`  + ${holder} → ${certNumber}`);
    }

    await conn.end();
    await saveCerts(certs);

    console.log(`\nDone. Added ${added} legacy record(s). Total certificates: ${certs.length}.`);
}

main().catch((e) => {
    console.error("Migration failed:", e.message);
    process.exit(1);
});
