import { promises as fs } from "node:fs";
import { join } from "node:path";
import crypto from "node:crypto";

export interface ProposalTemplate {
  id: string;
  title: string;
  description: string;
  intro: string;
  approach: string;
  serviceIds: string[];
  terms: string;
  validityDays: number;
}

export interface ProposalLineItem {
  /** Locally generated id so the UI can update specific rows. */
  id: string;
  serviceId?: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  unit?: string;
}

export interface SavedProposal {
  id: string;
  /** Public-facing reference (e.g. "PROP-2026-0042"). */
  reference: string;
  templateId?: string;
  title: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
  client: {
    company: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    addressLines: string[];
    country?: string;
  };
  intro: string;
  approach: string;
  lineItems: ProposalLineItem[];
  terms: string;
  notes?: string;
  /** Currency of the totals — taken from the first line item, falls back to USD. */
  currency: string;
  totals: {
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    taxPercent: number;
    taxAmount: number;
    total: number;
  };
}

const TEMPLATES_FILE = join(process.cwd(), "content", "data", "proposal-templates.json");
const PROPOSALS_FILE = join(process.cwd(), "content", "data", "proposals-sent.json");

export async function listTemplates(): Promise<ProposalTemplate[]> {
  try {
    const txt = await fs.readFile(TEMPLATES_FILE, "utf-8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? (arr as ProposalTemplate[]) : [];
  } catch {
    return [];
  }
}

export async function findTemplate(id: string): Promise<ProposalTemplate | null> {
  const all = await listTemplates();
  return all.find((t) => t.id === id) ?? null;
}

export async function listProposals(): Promise<SavedProposal[]> {
  try {
    const txt = await fs.readFile(PROPOSALS_FILE, "utf-8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? (arr as SavedProposal[]) : [];
  } catch {
    return [];
  }
}

export async function findProposal(id: string): Promise<SavedProposal | null> {
  const all = await listProposals();
  return all.find((p) => p.id === id || p.reference === id) ?? null;
}

export async function saveProposal(p: SavedProposal): Promise<void> {
  const all = await listProposals();
  const i = all.findIndex((x) => x.id === p.id);
  if (i >= 0) all[i] = p;
  else all.push(p);
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(PROPOSALS_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export function nextReference(existing: SavedProposal[]): string {
  const year = new Date().getFullYear();
  const seq =
    existing
      .map((p) => p.reference)
      .map((r) => {
        const m = r?.match(/^PROP-(\d{4})-(\d{4,})$/);
        return m && Number(m[1]) === year ? Number(m[2]) : 0;
      })
      .reduce((max, n) => (n > max ? n : max), 0) + 1;
  return `PROP-${year}-${String(seq).padStart(4, "0")}`;
}

export function newProposalId(): string {
  return "p-" + crypto.randomBytes(6).toString("hex");
}

export function lineItemId(): string {
  return "li-" + crypto.randomBytes(4).toString("hex");
}

export function recomputeTotals(p: SavedProposal): SavedProposal["totals"] {
  const subtotal = p.lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const discountAmount = (subtotal * (p.totals.discountPercent ?? 0)) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * (p.totals.taxPercent ?? 0)) / 100;
  const total = taxable + taxAmount;
  return {
    subtotal: round2(subtotal),
    discountPercent: p.totals.discountPercent ?? 0,
    discountAmount: round2(discountAmount),
    taxPercent: p.totals.taxPercent ?? 0,
    taxAmount: round2(taxAmount),
    total: round2(total),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
