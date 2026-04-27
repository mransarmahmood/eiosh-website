"use client";

import { useRouter } from "next/navigation";
import { DeleteRecordButton } from "./DeleteRecordButton";

interface Props {
  resource: string;
  id: string;
  label?: string;
  redirectTo: string;
}

/**
 * Wrapper around DeleteRecordButton that navigates to a target path
 * after a successful delete — used on the edit page so the admin lands
 * back on the list instead of trying to re-render the deleted record.
 */
export function DeleteAndRedirect({ resource, id, label, redirectTo }: Props) {
  const router = useRouter();
  return (
    <DeleteRecordButton
      resource={resource}
      id={id}
      label={label}
      variant="button"
      onDeleted={() => router.push(redirectTo)}
    />
  );
}
