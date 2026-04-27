import { z } from "zod";
import { handlePublicSubmit } from "@/lib/cms/public-submit";

const Schema = z.object({
  title: z.string().min(3),
  companyName: z.string().min(2),
  companyEmail: z.string().email(),
  phone: z.string().optional(),
  companyAddress: z.string().optional(),
  invoiceDate: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  return handlePublicSubmit(req, "proposals", Schema, (d) => ({ ...d }));
}
