import { z } from "zod";
import { handlePublicSubmit } from "@/lib/cms/public-submit";

const Schema = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(5),
  serviceRequired: z.string().min(3),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  return handlePublicSubmit(req, "quotations", Schema, (d) => ({ ...d }));
}
