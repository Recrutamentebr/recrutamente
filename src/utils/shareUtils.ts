// Edge function URL for sharing with proper OG meta tags
const EDGE_FUNCTION_BASE_URL = "https://rbokwvgkxndjzybgomnz.supabase.co/functions/v1/og-meta";

/**
 * Generates the share URL that includes proper OG meta tags for social media previews.
 * This URL goes through the edge function which serves meta tags to crawlers
 * and redirects real users to the actual page.
 */
export function getShareUrl(slug: string): string {
  return `${EDGE_FUNCTION_BASE_URL}/vagas/${slug}`;
}

/**
 * Opens WhatsApp share dialog with the job link
 */
export function shareViaWhatsApp(title: string, slug: string): void {
  const url = getShareUrl(slug);
  const text = `Confira essa vaga: ${title}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
}

/**
 * Opens LinkedIn share dialog with the job link
 */
export function shareViaLinkedIn(slug: string): void {
  const url = getShareUrl(slug);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
}

/**
 * Opens Facebook share dialog with the job link
 */
export function shareViaFacebook(title: string, slug: string): void {
  const url = getShareUrl(slug);
  const text = `Confira essa vaga: ${title}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, "_blank");
}

/**
 * Opens Twitter/X share dialog with the job link
 */
export function shareViaTwitter(title: string, slug: string): void {
  const url = getShareUrl(slug);
  const text = `Confira essa vaga: ${title}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
}

/**
 * Copies the share URL to clipboard
 */
export async function copyShareLink(slug: string): Promise<boolean> {
  const url = getShareUrl(slug);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
