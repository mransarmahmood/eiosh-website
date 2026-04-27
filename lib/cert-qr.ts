import QRCode from "qrcode";

/**
 * Returns a data-URL PNG for a QR code encoding `url`.
 * Used server-side so the certificate PNG/PDF is self-contained.
 */
export async function qrDataUrl(url: string, opts?: { size?: number; darkColor?: string }): Promise<string> {
    const size = opts?.size ?? 240;
    const dark = opts?.darkColor ?? "#0A2540";
    try {
        return await QRCode.toDataURL(url, {
            width: size,
            margin: 1,
            errorCorrectionLevel: "M",
            color: { dark, light: "#FDFCF8" },
        });
    } catch (e) {
        // Fallback to a tiny transparent pixel if generation fails.
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }
}
