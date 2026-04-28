import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/cms/auth";
import {
  listProposals,
  saveProposal,
  nextReference,
  newProposalId,
  recomputeTotals,
  type SavedProposal,
} from "@/lib/proposals";

function deny() {
  return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
}

export async function GET() {
  if (!isAuthed()) return deny();
  const proposals = await listProposals();
  return NextResponse.json({
    ok: true,
    proposals: proposals
      .slice()
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
  });
}

export async function POST(req: Request) {
  if (!isAuthed()) return deny();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const input = body as Partial<SavedProposal> & { id?: string };
  const all = await listProposals();
  const existing = input.id ? all.find((p) => p.id === input.id) : null;
  const now = new Date().toISOString();

  const lineItems = (input.lineItems ?? []).map((li) => ({
    id: li.id ?? "li-" + Math.random().toString(36).slice(2, 8),
    serviceId: li.serviceId,
    title: li.title ?? "",
    description: li.description,
    quantity: Number(li.quantity ?? 1),
    unitPrice: Number(li.unitPrice ?? 0),
    currency: String(li.currency ?? "USD"),
    unit: li.unit,
  }));

  const draft: SavedProposal = {
    id: existing?.id ?? input.id ?? newProposalId(),
    reference: existing?.reference ?? nextReference(all),
    templateId: input.templateId,
    title: input.title ?? existing?.title ?? "Untitled proposal",
    status: input.status ?? existing?.status ?? "draft",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    validUntil: input.validUntil ?? existing?.validUntil,
    client: {
      company: input.client?.company ?? "",
      contactName: input.client?.contactName ?? "",
      contactEmail: input.client?.contactEmail ?? "",
      contactPhone: input.client?.contactPhone,
      addressLines: input.client?.addressLines ?? [],
      country: input.client?.country,
    },
    intro: input.intro ?? "",
    approach: input.approach ?? "",
    lineItems,
    terms: input.terms ?? "",
    notes: input.notes,
    currency: lineItems[0]?.currency ?? input.currency ?? "USD",
    totals: {
      subtotal: 0,
      discountPercent: Number(input.totals?.discountPercent ?? 0),
      discountAmount: 0,
      taxPercent: Number(input.totals?.taxPercent ?? 0),
      taxAmount: 0,
      total: 0,
    },
  };
  draft.totals = recomputeTotals(draft);

  await saveProposal(draft);
  return NextResponse.json({ ok: true, proposal: draft });
}
