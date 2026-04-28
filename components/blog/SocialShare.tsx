"use client";

import { useState } from "react";
import { Linkedin, Twitter, Facebook, MessageCircle, Link2, Check } from "lucide-react";

interface Props {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback: open the URL in a new tab so the user can copy it manually.
      window.prompt("Copy this link:", url);
    }
  }

  const baseBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink-soft transition hover:bg-navy-50 hover:text-navy-900";

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">Share</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtn}
        aria-label="Share on LinkedIn"
        title="LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtn}
        aria-label="Share on Twitter"
        title="Twitter / X"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtn}
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtn}
        aria-label="Share on WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        className={baseBtn}
        aria-label="Copy article link"
        title={copied ? "Link copied" : "Copy link"}
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
