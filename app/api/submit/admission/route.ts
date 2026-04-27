import { z } from "zod";
import { handlePublicSubmit } from "@/lib/cms/public-submit";

const Schema = z.object({
  // Course & session
  courseApplied: z.string().min(2),
  session: z.string().optional(),
  admissionDate: z.string().optional(),
  // Personal
  title: z.string().min(2),
  fatherName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  cnic: z.string().optional(),
  religion: z.string().optional(),
  lastQualification: z.string().optional(),
  // Contact
  email: z.string().email(),
  mobile: z.string().min(5),
  company: z.string().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
});

export async function POST(req: Request) {
  return handlePublicSubmit(req, "admissions", Schema, (d) => ({ ...d }));
}
