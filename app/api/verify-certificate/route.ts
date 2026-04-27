import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";

interface Cert {
  id: string;
  holder: string;
  certificateNumber: string;
  registrationNumber: string | null;
  course: string;
  issueDate: string | null;
  expiryDate: string | null;
  company: string | null;
}

function normalize(s: string | null | undefined): string {
  return String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const reference = String(body.reference ?? "").trim();
  const holder = String(body.holder ?? "").trim();

  if (!reference) {
    return NextResponse.json({ ok: false, kind: "invalid", message: "Certificate reference is required." }, { status: 400 });
  }

  const path = join(process.cwd(), "content", "data", "certificates.json");
  let certs: Cert[] = [];
  try {
    certs = JSON.parse(await fs.readFile(path, "utf-8")) as Cert[];
  } catch {
    return NextResponse.json({ ok: false, kind: "invalid", message: "Certificate index is unavailable." }, { status: 500 });
  }

  // Accept either full "EIOSH-2026-XXXX-YYYY" style or the raw certificate number.
  const refNorm = normalize(reference.replace(/^eiosh-?/i, ""));
  const match = certs.find((c) => {
    if (!c.certificateNumber) return false;
    const certNorm = normalize(c.certificateNumber);
    const regNorm = normalize(c.registrationNumber);
    const idNorm = normalize(c.id.replace(/^cert-/, ""));
    return certNorm === refNorm || regNorm === refNorm || idNorm === refNorm || refNorm.endsWith(certNorm);
  });

  if (!match) {
    return NextResponse.json({ ok: true, kind: "not-found" });
  }

  // If a holder name was provided, do a fuzzy check — last name tokens must match.
  if (holder) {
    const holderNorm = normalize(holder);
    const recordNorm = normalize(match.holder);
    const tokens = holder.trim().split(/\s+/).map(normalize).filter(Boolean);
    const anyTokenMatch = tokens.some((t) => recordNorm.includes(t));
    if (!anyTokenMatch && !recordNorm.includes(holderNorm)) {
      return NextResponse.json({ ok: true, kind: "name-mismatch" });
    }
  }

  return NextResponse.json({
    ok: true,
    kind: "valid",
    record: {
      holder: match.holder,
      certificateNumber: match.certificateNumber,
      registrationNumber: match.registrationNumber,
      course: match.course,
      issueDate: match.issueDate,
      expiryDate: match.expiryDate,
      company: match.company,
    },
  });
}
