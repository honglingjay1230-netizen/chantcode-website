const blockedResponseHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Access denied</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; color: #222; background: #fff; }
    main { max-width: 680px; margin: 12vh auto; padding: 0 24px; }
    h1 { margin: 0 0 16px; font-size: 48px; font-weight: 500; }
    p { margin: 0; font-size: 18px; }
  </style>
</head>
<body>
  <main>
    <h1>Access denied</h1>
    <p>This request cannot be completed.</p>
  </main>
</body>
</html>`;

const blockedCrawlerTokens = [
  "360spider",
  "amazonbot",
  "baiduspider",
  "bytespider",
  "ccbot",
  "claudebot",
  "gptbot",
  "meta-externalagent",
  "petalbot",
  "sogou web spider",
  "yisouspider",
  "youdaobot",
];

export function isMainlandChinaRequest(request) {
  return request.cf?.country === "CN";
}

export function isBlockedCrawlerRequest(request) {
  const userAgent = request.headers?.get?.("user-agent")?.toLowerCase() ?? "";
  return blockedCrawlerTokens.some((token) => userAgent.includes(token));
}

export function shouldBlockRequest(request) {
  return isMainlandChinaRequest(request) || isBlockedCrawlerRequest(request);
}

export function blockedResponse() {
  return new Response(blockedResponseHtml, {
    status: 403,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=UTF-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function onRequest(context) {
  if (shouldBlockRequest(context.request)) {
    return blockedResponse();
  }

  return await context.next();
}
