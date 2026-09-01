import { SITE } from "../config";

export const dynamic = "force-static";

const body = [
  "User-agent: *",
  "Allow: /",
  "",
  "User-agent: Googlebot",
  "Allow: /",
  "",
  "User-agent: OAI-SearchBot",
  "Allow: /",
  "",
  `Sitemap: ${SITE.url}/sitemap.xml`,
  "",
].join("\n");

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
