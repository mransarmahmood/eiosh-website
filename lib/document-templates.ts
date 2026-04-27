import type { DocumentKind, DocumentLineItem } from "./types";

// Ready-to-submit document wording. Each kind ships with professional copy
// that admins can use as-is, or tweak in the CMS editor before sending.
// Update here and every proposal/quotation stays consistent.

export interface ProposalTemplate {
  kind: DocumentKind;
  label: string;
  summary: string;
  overview: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
  investmentSummary: string;
  terms: string;
  validityDays: number;
}

export interface QuotationTemplate {
  kind: DocumentKind;
  label: string;
  serviceLabel: string;
  overview: string;
  lineItems: DocumentLineItem[];
  terms: string;
  validityDays: number;
}

export interface InvoiceTemplate {
  kind: DocumentKind;
  label: string;
  subject: string;
  lineItems: DocumentLineItem[];
  terms: string;
  paymentDueDays: number;
  vatPercent: number;
  currency: string;
}

const SIGN_OFF_TERMS =
  "Payment terms: 50% advance against signed acceptance of this document, 50% on completion. Prices quoted are exclusive of applicable taxes, travel and venue costs unless stated otherwise. EIOSH International reserves the right to revise pricing if scope, headcount, delivery location or timeline changes materially from what is set out here. This document is confidential and intended solely for the named recipient.";

export const PROPOSAL_TEMPLATES: Record<DocumentKind, ProposalTemplate> = {
  training: {
    kind: "training",
    label: "Training proposal",
    summary: "Structured training programme delivered under our approved-centre status.",
    overview:
      "EIOSH International is pleased to submit this training proposal. Our delivery team will design, deliver and certify a programme tailored to your workforce capability goals, drawing on our approved-centre status with IOSH, OSHAcademy, OSHAwards, HABC, OTHM and NASP, and the track record of more than 1,500 professionals trained to date. This document sets out the scope, deliverables, timeline and investment required to run the programme end-to-end.",
    scope: [
      "Pre-programme training needs analysis and learner register setup.",
      "Tailored programme design aligned to the target awarding-body syllabus.",
      "In-person, blended, or online delivery by an EIOSH-certified lead trainer.",
      "Awarding-body-standard assessment and internal verification of all candidate work.",
      "Post-programme reporting, certification dispatch and 30-day coaching support.",
    ],
    deliverables: [
      "Branded learner materials (handbook + digital pack)",
      "EIOSH-certified trainer on-site or virtual, for the full programme duration",
      "Learner assessment, grading and moderation to the awarding body's standard",
      "Awarding-body certificates issued within 10 working days of result submission",
      "Final attendance, assessment and recommendations report for your L&D / HSE team",
    ],
    timeline:
      "Kick-off call within 3 business days of acceptance. Delivery typically starts 2–4 weeks from kick-off, subject to cohort size and venue readiness. Full programme duration varies by qualification — confirmed in the agreed cohort calendar.",
    investmentSummary:
      "Programme investment is based on cohort size, delivery mode and certification level. A line-item pricing schedule will accompany this proposal as a separate quotation document, valid for 30 days from issue.",
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  certification: {
    kind: "certification",
    label: "Certification preparation proposal",
    summary: "End-to-end certification preparation with mock assessments and internal verification.",
    overview:
      "EIOSH International is pleased to propose an end-to-end certification preparation programme to equip your nominated candidates for a successful first-attempt pass. Our certification pathway combines tutor-led delivery, structured self-study, timed mock assessments, and internal verification to awarding-body standards. This proposal covers scope, deliverables, timeline and investment to take candidates from enrolment through certification.",
    scope: [
      "Eligibility review of each candidate against awarding-body prerequisites.",
      "Blended programme delivery with live tutor-led workshops and self-paced modules.",
      "A minimum of two timed mock assessments per candidate, marked to awarding-body standards.",
      "Portfolio / workplace-project review and internal verification before submission.",
      "Examination booking, awarding-body liaison and certification dispatch.",
    ],
    deliverables: [
      "Branded candidate study packs aligned to the current published syllabus",
      "Live tutor office hours through the programme window",
      "Two full-length mock assessments with individualised feedback",
      "Internal verification of workplace projects and portfolio work",
      "Official awarding-body certificate and verifiable digital credential",
    ],
    timeline:
      "Candidate onboarding within one week of signed acceptance. Programme duration is set by the chosen qualification — for example, NEBOSH IGC runs over 12 weeks; IOSH Managing Safely over 3 days. A confirmed delivery calendar will be attached to the signed version of this proposal.",
    investmentSummary:
      "Certification fees vary by awarding body and cohort size. Investment is detailed in the accompanying quotation document and includes tuition, assessment, awarding-body registration and certification dispatch.",
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  service: {
    kind: "service",
    label: "Professional services proposal",
    summary: "Advisory and management-system services delivered by EIOSH's practitioner team.",
    overview:
      "EIOSH International is pleased to submit this professional services proposal. Our advisory team combines auditor-grade expertise with operational HSE experience across energy, construction, hospitality, logistics and financial services. This document sets out the engagement scope, deliverables, timeline and investment required to complete the service to an auditable standard.",
    scope: [
      "Opening alignment workshop to confirm scope, stakeholders and success criteria.",
      "Structured gap assessment against the reference standard (e.g. ISO 45001, ISO 14001, ISO 9001).",
      "Delivery of the agreed workstreams — documentation, implementation support, internal audit, coaching.",
      "Progress reporting at pre-agreed milestones with a named EIOSH engagement lead.",
      "Final handover pack and executive summary for the sponsoring stakeholder.",
    ],
    deliverables: [
      "Signed engagement letter and scoping statement",
      "Gap-assessment report with prioritised corrective-action register",
      "Implementation support documentation and templates",
      "Internal audit reports and management-review packs",
      "Executive briefing deck for sponsoring stakeholders",
    ],
    timeline:
      "Services are typically scoped into 30-day, 60-day or 90-day engagements. The confirmed timeline, milestone dates and review checkpoints will be attached as an appendix to the signed version of this proposal.",
    investmentSummary:
      "Fees are daily-rate or fixed-fee by engagement. The accompanying quotation sets out the exact investment, expected effort and any on-site or travel costs for the agreed scope.",
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  "equipment-inspection": {
    kind: "equipment-inspection",
    label: "Equipment inspection proposal",
    summary: "Third-party lifting, pressure and general equipment inspection programme.",
    overview:
      "EIOSH International is pleased to submit this equipment inspection proposal. Our inspectors hold recognised certifications (LEEA, API, ASNT) and inspect to international standards including BS EN, ASME and OEM specification. This document covers inspection scope, deliverables, reporting and investment for a structured inspection programme at your site.",
    scope: [
      "Pre-inspection planning: asset register review, competency matching, risk-assessed method statements.",
      "On-site inspection to the agreed standard with certified inspectors.",
      "Defect categorisation (stop-work, repair-required, monitor) and immediate isolation of unsafe equipment.",
      "Digital tagging + register update with next-inspection dates.",
      "Final report package ready for regulator / client submission.",
    ],
    deliverables: [
      "Pre-inspection plan and scope of work",
      "Signed inspector credentials for each assigned inspector",
      "Individual inspection reports per asset with photographs and condition ratings",
      "Consolidated inspection register with due-date tracker",
      "Certificates of Thorough Examination where scope includes lifting equipment",
    ],
    timeline:
      "Inspection mobilisation within 7 business days of acceptance, subject to site access and asset availability. Delivery windows depend on asset count — a detailed inspection calendar will be attached to the signed version of this proposal.",
    investmentSummary:
      "Inspection fees are quoted per asset type (lifting, pressure, electrical, general machinery) plus a fixed mobilisation and reporting fee. The accompanying quotation document provides the itemised investment.",
    terms: SIGN_OFF_TERMS,
    validityDays: 45,
  },
  consulting: {
    kind: "consulting",
    label: "HSE consulting proposal",
    summary: "Strategic HSE consulting for operational, compliance and culture outcomes.",
    overview:
      "EIOSH International is pleased to submit this HSE consulting proposal. Our consultants combine chartered HSE expertise with operational delivery experience. This engagement is scoped to address a clearly-defined capability or compliance gap, with measurable success criteria agreed up-front and reviewed at each milestone.",
    scope: [
      "Mobilisation and stakeholder mapping.",
      "Diagnostic assessment against the agreed reference model (e.g. ISO 45001, API RP 754, company HSEMS).",
      "Delivery of the prioritised intervention plan with a named EIOSH lead consultant.",
      "Capability build: manager briefings, peer-coaching and tool adoption.",
      "Impact review and handover to the client's sustaining team.",
    ],
    deliverables: [
      "Engagement charter and success criteria document",
      "Diagnostic report with risk-ranked gap register",
      "Prioritised intervention plan with responsibilities and dates",
      "Manager and supervisor capability briefings (slide deck + recording)",
      "Final impact review and continuous-improvement roadmap",
    ],
    timeline:
      "Engagements typically run 60–120 days. The confirmed timeline, decision gates and review cadence will be attached as an appendix to the signed version of this proposal.",
    investmentSummary:
      "Consulting fees are quoted on a fixed-fee or daily-rate basis. The accompanying quotation details the expected effort per phase and any expense assumptions.",
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  custom: {
    kind: "custom",
    label: "Custom proposal",
    summary: "Bespoke scope outside our standard programmes.",
    overview:
      "EIOSH International is pleased to submit this proposal. The scope below has been tailored to the specific requirements you shared. Please review the scope, deliverables, timeline and investment — we are happy to iterate until the engagement is exactly right for your organisation.",
    scope: [
      "Discovery and alignment on success criteria.",
      "Tailored delivery of the agreed workstream.",
      "Milestone reviews and progress reporting.",
      "Handover and capability embedment.",
    ],
    deliverables: [
      "Engagement charter",
      "Delivery artefacts as agreed in the charter",
      "Handover pack",
    ],
    timeline: "Timeline to be confirmed with the signed engagement charter.",
    investmentSummary:
      "Investment will be quoted against the final scope in the accompanying quotation document.",
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
};

export const QUOTATION_TEMPLATES: Record<DocumentKind, QuotationTemplate> = {
  training: {
    kind: "training",
    label: "Training quotation",
    serviceLabel: "Accredited training programme",
    overview:
      "Quotation for delivery of an accredited training programme under EIOSH International's approved-centre status. Pricing below reflects the scope agreed in our proposal / kick-off call.",
    lineItems: [
      { description: "Accredited training delivery (per-learner fee)", qty: 20, unitPrice: 385 },
      { description: "Learner packs + awarding-body registration", qty: 20, unitPrice: 45 },
      { description: "On-site delivery — trainer mobilisation & accommodation", qty: 1, unitPrice: 850 },
    ],
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  certification: {
    kind: "certification",
    label: "Certification preparation quotation",
    serviceLabel: "Certification preparation programme",
    overview:
      "Quotation for end-to-end certification preparation including tutor-led sessions, mock assessments, internal verification and awarding-body registration.",
    lineItems: [
      { description: "Certification tuition (per candidate)", qty: 10, unitPrice: 695 },
      { description: "Mock assessments x2 per candidate (marking + feedback)", qty: 10, unitPrice: 85 },
      { description: "Awarding-body registration + examination fees", qty: 10, unitPrice: 220 },
    ],
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  service: {
    kind: "service",
    label: "Professional services quotation",
    serviceLabel: "Advisory / management-system service",
    overview:
      "Quotation for professional services delivered by EIOSH International's advisory team. Daily rates below reflect the scope and success criteria agreed in our proposal.",
    lineItems: [
      { description: "Senior consultant (daily rate)", qty: 12, unitPrice: 650 },
      { description: "Analyst support (daily rate)", qty: 8, unitPrice: 350 },
      { description: "Engagement management fee", qty: 1, unitPrice: 1200 },
    ],
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  "equipment-inspection": {
    kind: "equipment-inspection",
    label: "Equipment inspection quotation",
    serviceLabel: "Third-party equipment inspection",
    overview:
      "Quotation for third-party equipment inspection delivered to the agreed international standard. Pricing is per asset class plus a fixed mobilisation and reporting fee.",
    lineItems: [
      { description: "Lifting equipment inspection (per asset)", qty: 25, unitPrice: 85 },
      { description: "Pressure equipment inspection (per asset)", qty: 8, unitPrice: 145 },
      { description: "Electrical portable appliance test (per asset)", qty: 60, unitPrice: 15 },
      { description: "Inspector mobilisation + reporting fee", qty: 1, unitPrice: 950 },
    ],
    terms: SIGN_OFF_TERMS,
    validityDays: 45,
  },
  consulting: {
    kind: "consulting",
    label: "HSE consulting quotation",
    serviceLabel: "HSE consulting engagement",
    overview:
      "Quotation for an HSE consulting engagement. Fees below reflect the phases and effort agreed in our proposal.",
    lineItems: [
      { description: "Diagnostic phase (fixed fee)", qty: 1, unitPrice: 4500 },
      { description: "Implementation support (daily rate)", qty: 10, unitPrice: 750 },
      { description: "Impact review + handover (fixed fee)", qty: 1, unitPrice: 2200 },
    ],
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
  custom: {
    kind: "custom",
    label: "Custom quotation",
    serviceLabel: "Bespoke service",
    overview: "Quotation for the bespoke scope agreed in our proposal / kick-off call.",
    lineItems: [
      { description: "Bespoke service line 1", qty: 1, unitPrice: 0 },
    ],
    terms: SIGN_OFF_TERMS,
    validityDays: 30,
  },
};

const INVOICE_TERMS =
  "Payment terms: net 30 days from invoice date unless otherwise stated. Invoice is considered accepted if no dispute is raised within 7 business days. Late payments beyond the due date may incur a 2% monthly administration fee. Bank transfer details are provided on the signed engagement letter. EIOSH International Trade Licence, tax registration certificate and W-9 / VAT documentation are available on request.";

export const INVOICE_TEMPLATES: Record<DocumentKind, InvoiceTemplate> = {
  training: {
    kind: "training",
    label: "Training invoice",
    subject: "Training programme — final invoice",
    lineItems: [
      { description: "Accredited training delivery (per-learner fee)", qty: 20, unitPrice: 385 },
      { description: "Learner packs + awarding-body registration", qty: 20, unitPrice: 45 },
      { description: "On-site delivery (trainer mobilisation & accommodation)", qty: 1, unitPrice: 850 },
    ],
    terms: INVOICE_TERMS,
    paymentDueDays: 30,
    vatPercent: 5,
    currency: "USD",
  },
  certification: {
    kind: "certification",
    label: "Certification preparation invoice",
    subject: "Certification preparation — invoice",
    lineItems: [
      { description: "Certification tuition (per candidate)", qty: 12, unitPrice: 695 },
      { description: "Awarding-body examination + registration fees", qty: 12, unitPrice: 220 },
      { description: "Internal verification & workplace project mentoring", qty: 1, unitPrice: 1500 },
    ],
    terms: INVOICE_TERMS,
    paymentDueDays: 30,
    vatPercent: 5,
    currency: "USD",
  },
  service: {
    kind: "service",
    label: "Professional services invoice",
    subject: "Professional services — invoice",
    lineItems: [
      { description: "Senior consultant (daily rate)", qty: 8, unitPrice: 650 },
      { description: "Analyst support (daily rate)", qty: 4, unitPrice: 350 },
      { description: "Engagement management fee", qty: 1, unitPrice: 1200 },
    ],
    terms: INVOICE_TERMS,
    paymentDueDays: 30,
    vatPercent: 5,
    currency: "USD",
  },
  "equipment-inspection": {
    kind: "equipment-inspection",
    label: "Equipment inspection invoice",
    subject: "Equipment inspection programme — invoice",
    lineItems: [
      { description: "Lifting equipment inspection (per asset)", qty: 40, unitPrice: 85 },
      { description: "Pressure equipment inspection (per asset)", qty: 12, unitPrice: 145 },
      { description: "Inspector mobilisation + reporting fee", qty: 1, unitPrice: 950 },
    ],
    terms: INVOICE_TERMS,
    paymentDueDays: 30,
    vatPercent: 5,
    currency: "USD",
  },
  consulting: {
    kind: "consulting",
    label: "HSE consulting invoice",
    subject: "HSE consulting — invoice",
    lineItems: [
      { description: "Diagnostic phase (fixed fee)", qty: 1, unitPrice: 4500 },
      { description: "Implementation support (daily rate)", qty: 10, unitPrice: 750 },
      { description: "Impact review + handover (fixed fee)", qty: 1, unitPrice: 2200 },
    ],
    terms: INVOICE_TERMS,
    paymentDueDays: 30,
    vatPercent: 5,
    currency: "USD",
  },
  custom: {
    kind: "custom",
    label: "Custom invoice",
    subject: "Services rendered — invoice",
    lineItems: [{ description: "Line item 1", qty: 1, unitPrice: 0 }],
    terms: INVOICE_TERMS,
    paymentDueDays: 30,
    vatPercent: 0,
    currency: "USD",
  },
};

export function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}
