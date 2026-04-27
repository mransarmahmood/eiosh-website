import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Enterprise CTA system. Primary = navy authority; accent = cyan clarity;
// gold reserved for the single top-of-funnel action on a page.
const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-heading font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-navy-900 text-white hover:bg-navy-800 shadow-elevated",
        accent: "bg-cyan-500 text-white hover:bg-cyan-600 shadow-elevated",
        gold: "bg-gold-400 text-navy-950 hover:bg-gold-500 shadow-elevated",
        outline: "bg-transparent text-navy-900 ring-1 ring-inset ring-navy-900/20 hover:bg-navy-50 hover:ring-navy-900/40",
        ghost: "bg-transparent text-navy-900 hover:bg-navy-50",
        link: "bg-transparent text-cyan-700 underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base py-3.5",
        xl: "h-14 px-8 text-base py-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type BaseProps = VariantProps<typeof buttonStyles> & {
  className?: string;
  children: React.ReactNode;
};

type LinkProps = BaseProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">;
type ButtonProps = BaseProps & { href?: never } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button(props: LinkProps | ButtonProps) {
  const { variant, size, className, children } = props;
  const classes = cn(buttonStyles({ variant, size }), className);
  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }
  const { ...rest } = props as ButtonProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
