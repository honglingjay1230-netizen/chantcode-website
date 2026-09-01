const mainlandChinaNotFound = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>404 Not Found</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; color: #222; background: #fff; }
    main { max-width: 680px; margin: 12vh auto; padding: 0 24px; }
    h1 { margin: 0 0 16px; font-size: 48px; font-weight: 500; }
    p { margin: 0; font-size: 18px; }
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>Page not found.</p>
  </main>
</body>
</html>`;

export function shouldHideFromRequest(request) {
  return request.cf?.country === "CN";
}

export function mainlandChinaNotFoundResponse() {
  return new Response(mainlandChinaNotFound, {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=UTF-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
