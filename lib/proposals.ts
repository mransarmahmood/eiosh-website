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

/**
 * How prices appear on the public proposal:
 *  - "all"          — line-item unit prices, line totals, and grand total (default)
 *  - "lumpsum-only" — services list shows scope only, single lump-sum total at the end
 *  - "no-price"     — services list shows scope only, no prices anywhere (used for scope-only proposals)
 */
export type PriceDisplayMode = "all" | "lumpsum-only" | "no-price";

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
  /** Controls how prices render on the public proposal page. Defaults to "all". */
  priceDisplayMode?: PriceDisplayMode;
  /** Optional label shown next to the lump-sum figure (e.g. "Project fee" / "Annual retainer"). */
  lumpSumLabel?: string;
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

export interface ApproachStage {
  index: number;
  title: string;
  body: string;
}

/**
 * Splits free-form approach text into ordered stage cards.
 * Recognises three markers (in priority order):
 *   1. "Stage 1 — Discovery" / "Stage 1: Discovery" / "Phase 2 — Build"
 *   2. Numbered headings on their own line: "1. Discovery" / "1) Discovery"
 *   3. Single blank-line separated paragraphs (fallback)
 *
 * If no markers are detected and the text is one paragraph, returns a single stage.
 */
export function parseApproachStages(text: string): ApproachStage[] {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return [];

  // Pattern 1 — explicit "Stage N" / "Phase N" markers
  const stageRe = /^\s*(?:Stage|Phase|Step)\s+(\d+)\s*[—:.\-–]\s*(.+)$/im;
  if (stageRe.test(trimmed)) {
    return splitByLeadRegex(
      trimmed,
      /^\s*(?:Stage|Phase|Step)\s+(\d+)\s*[—:.\-–]\s*(.+)$/gim
    );
  }

  // Pattern 2 — numbered headings ("1. Discovery", "1) Discovery") on a line of their own
  const numberedRe = /^\s*(\d+)[.)]\s+(.+)$/m;
  if (numberedRe.test(trimmed)) {
    return splitByLeadRegex(trimmed, /^\s*(\d+)[.)]\s+(.+)$/gm);
  }

  // Pattern 3 — paragraph split (each blank-line block becomes a stage)
  const paras = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paras.length > 1) {
    return paras.map((body, i) => ({ index: i + 1, title: `Stage ${i + 1}`, body }));
  }

  return [{ index: 1, title: "Our approach", body: trimmed }];
}

function splitByLeadRegex(text: string, re: RegExp): ApproachStage[] {
  const matches: { match: RegExpExecArray; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ match: m, index: m.index });
  }
  return matches.map((entry, i) => {
    const next = matches[i + 1];
    const headLineEnd = entry.index + entry.match[0].length;
    const body = text.slice(headLineEnd, next ? next.index : text.length).trim();
    return {
      index: Number(entry.match[1]),
      title: entry.match[2].trim(),
      body,
    };
  });
}
