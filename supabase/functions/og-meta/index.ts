import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Social media crawlers user agents
const crawlerPatterns = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "WhatsApp",
  "LinkedInBot",
  "Slackbot",
  "TelegramBot",
  "Discordbot",
  "Pinterest",
  "Googlebot",
  "bingbot",
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return crawlerPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern.toLowerCase())
  );
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/\n/g, " ").trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userAgent = req.headers.get("user-agent");
    
    console.log("Request URL:", url.pathname);
    console.log("User-Agent:", userAgent);

    // Extract slug from path (e.g., /vagas/desenvolvedor-frontend)
    const pathMatch = url.pathname.match(/\/vagas\/([^\/]+)/);
    const slug = pathMatch ? pathMatch[1] : null;

    console.log("Extracted slug:", slug);

    // If not a crawler or no slug, redirect to the SPA
    if (!isCrawler(userAgent) || !slug) {
      const siteUrl = Deno.env.get("SITE_URL") || `https://${url.host}`;
      console.log("Not a crawler or no slug, redirecting to:", siteUrl + url.pathname);
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: siteUrl + url.pathname,
        },
      });
    }

    // Fetch job data from database
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: job, error } = await supabase
      .from("jobs")
      .select("title, description, city, state, type, level, area")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    console.log("Job data:", job, "Error:", error);

    if (error || !job) {
      // Return default meta tags if job not found
      return new Response(
        generateHtml({
          title: "Vaga não encontrada | RecrutaMente",
          description: "Esta vaga não está mais disponível. Confira outras oportunidades em RecrutaMente.",
          url: url.href,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/html; charset=utf-8",
          },
        }
      );
    }

    const siteUrl = Deno.env.get("SITE_URL") || `https://${url.host}`;
    const jobUrl = `${siteUrl}/vagas/${slug}`;
    const title = `${job.title} | RecrutaMente`;
    const description = truncateText(
      stripHtml(job.description),
      160
    );
    const location = `${job.city}, ${job.state}`;

    const html = generateHtml({
      title,
      description: `${description} | ${job.type} • ${job.level} • ${location}`,
      url: jobUrl,
      type: job.type,
      level: job.level,
      area: job.area,
      location,
    });

    console.log("Returning HTML for crawler");

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: unknown) {
    console.error("Error in og-meta function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

interface MetaData {
  title: string;
  description: string;
  url: string;
  type?: string;
  level?: string;
  area?: string;
  location?: string;
}

function generateHtml(meta: MetaData): string {
  const siteName = "RecrutaMente";
  const logoUrl = "https://rbokwvgkxndjzybgomnz.supabase.co/storage/v1/object/public/assets/logo-recrutamente.png";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${meta.title}</title>
  <meta name="title" content="${meta.title}">
  <meta name="description" content="${meta.description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${meta.url}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${logoUrl}">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:locale" content="pt_BR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="${meta.url}">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${logoUrl}">
  
  <!-- Additional Meta -->
  ${meta.type ? `<meta property="og:job:type" content="${meta.type}">` : ""}
  ${meta.level ? `<meta property="og:job:level" content="${meta.level}">` : ""}
  ${meta.location ? `<meta property="og:job:location" content="${meta.location}">` : ""}
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
  ${meta.location ? `<p>📍 ${meta.location}</p>` : ""}
  ${meta.type ? `<p>📋 ${meta.type}</p>` : ""}
  ${meta.level ? `<p>🎯 ${meta.level}</p>` : ""}
  <a href="${meta.url}">Ver vaga completa</a>
</body>
</html>`;
}
