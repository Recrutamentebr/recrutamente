// Site URL for sharing - uses the actual domain
const SITE_URL = "https://recrutamente.site";

// Path on our own domain that redirects to the OG meta generator (keeps the shared link clean)
const OG_SHARE_PATH = "/compartilhar/vagas";

/**
 * Generates the share URL for display and copying.
 * Uses the actual site domain for cleaner URLs.
 */
export function getShareUrl(slug: string): string {
  return `${SITE_URL}/vagas/${slug}`;
}

/**
 * Generates the share URL used by social networks.
 * We use a clean URL on our own domain that redirects to the OG meta generator.
 */
export function getOgShareUrl(slug: string): string {
  return `${SITE_URL}${OG_SHARE_PATH}/${slug}`;
}

/**
 * Opens WhatsApp share dialog with the job link
 * Uses edge function URL for proper OG preview
 */
export function shareViaWhatsApp(title: string, slug: string): void {
  const url = getOgShareUrl(slug);
  const text = `Confira essa vaga: ${title}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
}

/**
 * Opens LinkedIn share dialog with the job link
 * Uses edge function URL for proper OG preview
 */
export function shareViaLinkedIn(slug: string): void {
  const url = getOgShareUrl(slug);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
}

/**
 * Opens Facebook share dialog with the job link
 * Uses edge function URL for proper OG preview
 */
export function shareViaFacebook(title: string, slug: string): void {
  const url = getOgShareUrl(slug);
  const text = `Confira essa vaga: ${title}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, "_blank");
}

/**
 * Opens Twitter/X share dialog with the job link
 * Uses edge function URL for proper OG preview
 */
export function shareViaTwitter(title: string, slug: string): void {
  const url = getOgShareUrl(slug);
  const text = `Confira essa vaga: ${title}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
}

/**
 * Copies the share URL to clipboard
 * Uses the actual site URL for cleaner display
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
