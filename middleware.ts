// Vercel Edge Middleware — runs on every request before any function or static file.
// Implements a shared-password gate. Sets an `auth` cookie on success.
//
// To unprotect specific routes (e.g., a public landing page), edit MATCHER below.

import { next } from '@vercel/edge';

const COOKIE_NAME = 'jwg-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const LOGIN_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Jayasom — Sign in</title>
  <style>
    body { background: hsl(16 33% 93%); color: hsl(300 2% 27%); font-family: 'Century Gothic', 'Didact Gothic', 'Futura', 'Trebuchet MS', Arial, sans-serif; font-weight: 300; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    form { border: 1px solid hsl(300 2% 60%); padding: 32px; min-width: 320px; }
    h1 { font-size: 22px; font-weight: 300; margin-bottom: 6px; }
    p { font-size: 13px; color: hsl(300 2% 40%); margin-bottom: 24px; }
    label { display: block; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: hsl(300 2% 40%); margin-bottom: 6px; }
    input { width: 100%; padding: 10px 12px; font-size: 14px; border: 1px solid hsl(300 2% 60%); background: hsl(16 33% 93%); color: hsl(300 2% 27%); font-family: inherit; box-sizing: border-box; }
    button { width: 100%; margin-top: 16px; padding: 12px; font-size: 11px; letter-spacing: 0.15em; border: 1px solid hsl(300 2% 27%); background: hsl(300 2% 27%); color: hsl(16 33% 93%); cursor: pointer; }
    .err { color: hsl(0 70% 40%); font-size: 12px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <form method="POST" action="/__auth">
    <h1>Jayasom</h1>
    <p>Wireframe Generator — sign in to continue.</p>
    {{ERROR}}
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autocomplete="current-password" autofocus/>
    <button type="submit">Sign in</button>
  </form>
</body>
</html>`;

function loginResponse(error?: string): Response {
  const body = LOGIN_HTML.replace('{{ERROR}}', error ? `<p class="err">${error}</p>` : '');
  return new Response(body, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function checkAuth(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => c.trim().split('=', 2)).filter((p) => p.length === 2)
  );
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  return cookies[COOKIE_NAME] === expected;
}

export const config = {
  matcher: [
    // Skip Vercel internals and static assets — gate everything else.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',
  ],
};

export default async function middleware(req: Request) {
  const url = new URL(req.url);

  // Login form submission
  if (url.pathname === '/__auth' && req.method === 'POST') {
    const form = await req.formData();
    const password = form.get('password');
    const expected = process.env.APP_PASSWORD;
    if (!expected) {
      return new Response('Server not configured', { status: 500 });
    }
    if (typeof password !== 'string' || password !== expected) {
      return loginResponse('Wrong password.');
    }
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(expected)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax; Secure`,
      },
    });
  }

  if (checkAuth(req)) return next();

  // For API requests, return 401 JSON
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // For page requests, return the login HTML
  return loginResponse();
}
