"use client";

export default function PrintBtn() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="cert-print"
      style={{
        background: "#0A2540",
        color: "white",
        border: 0,
        borderRadius: 4,
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      🖨  Print / Save as PDF
    </button>
  );
}
