import { z } from "zod";
import { handlePublicSubmit } from "@/lib/cms/public-submit";

const Schema = z.object({
  title: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  eventSlug: z.string().min(1),
  eventTitle: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  return handlePublicSubmit(req, "registrations", Schema, (d) => ({ ...d }));
}
