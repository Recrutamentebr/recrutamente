import { supabase } from "@/integrations/supabase/client";

/**
 * Converts a text string into a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generates a unique slug for a job, adding a number suffix if needed
 */
export async function generateUniqueSlug(
  title: string,
  companyId: string,
  excludeJobId?: string
): Promise<string> {
  const baseSlug = slugify(title);
  
  // Check if base slug already exists for this company
  let query = supabase
    .from("jobs")
    .select("slug")
    .eq("company_id", companyId)
    .like("slug", `${baseSlug}%`);
  
  if (excludeJobId) {
    query = query.neq("id", excludeJobId);
  }
  
  const { data: existingSlugs } = await query;
  
  if (!existingSlugs || existingSlugs.length === 0) {
    return baseSlug;
  }
  
  // Extract numbers from existing slugs
  const slugSet = new Set(existingSlugs.map((s) => s.slug));
  
  // If base slug doesn't exist, use it
  if (!slugSet.has(baseSlug)) {
    return baseSlug;
  }
  
  // Find next available number
  let counter = 2;
  while (slugSet.has(`${baseSlug}-${counter}`)) {
    counter++;
  }
  
  return `${baseSlug}-${counter}`;
}
