import { next } from '@vercel/edge';

// Vercel Edge Middleware — form-based login gate for the whole site.
//
// Why a form instead of HTTP Basic Auth: Chrome's password manager does NOT
// offer to save credentials entered into the native Basic Auth dialog. A real
// HTML <form> with username/password fields DOES trigger Chrome's "Save
// password?" prompt, so this serves a login page, validates the POST, and sets
// a signed, HttpOnly session cookie that authorizes subsequent requests.
//
// Credentials come from env vars set in the Vercel project:
//   BASIC_AUTH_USER     (optional, defaults to "admin")
//   BASIC_AUTH_PASSWORD (required; if unset, the site fails closed with 503)

export const config = {
  // Protect everything except Vercel internals and the favicon.
  matcher: ['/((?!_vercel|favicon.ico).*)'],
};

const COOKIE_NAME = 'me_session';
const LOGIN_PATH = '/__login';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Derive an opaque session token from the password. Anyone who knows the
// password can mint it; nobody else can forge it. Rotating the password
// invalidates all existing sessions.
async function sessionToken(secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('me-session-v1'));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function loginPage({ failed } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Sign in</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: radial-gradient(circle at 50% 30%, #16213a, #0a0e1a 70%);
    color: #e6edf3;
  }
  .card {
    width: min(360px, 92vw); padding: 32px 28px;
    background: rgba(20, 27, 45, 0.85); border: 1px solid #243049;
    border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.45);
  }
  h1 { margin: 0 0 4px; font-size: 1.4rem; font-weight: 600; }
  p.sub { margin: 0 0 22px; color: #8b98ad; font-size: 0.9rem; }
  label { display: block; font-size: 0.8rem; color: #9fb0c8; margin: 14px 0 6px; }
  input {
    width: 100%; padding: 11px 13px; font-size: 1rem;
    background: #0d1322; border: 1px solid #2a3756; border-radius: 8px;
    color: #e6edf3; outline: none;
  }
  input:focus { border-color: #4c7dff; box-shadow: 0 0 0 3px rgba(76,125,255,0.2); }
  button {
    margin-top: 22px; width: 100%; padding: 12px; font-size: 1rem; font-weight: 600;
    color: #fff; background: linear-gradient(135deg, #4c7dff, #6a5cff);
    border: 0; border-radius: 8px; cursor: pointer;
  }
  button:hover { filter: brightness(1.07); }
  .err {
    margin-top: 16px; padding: 9px 12px; font-size: 0.85rem;
    background: rgba(220, 70, 70, 0.12); border: 1px solid rgba(220,70,70,0.4);
    border-radius: 8px; color: #ff9b9b;
  }
</style>
</head>
<body>
  <form class="card" method="POST" action="${LOGIN_PATH}">
    <h1>ζ Private access</h1>
    <p class="sub">Sign in to view the explorer.</p>
    <label for="username">Username</label>
    <input id="username" name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" required autofocus />
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required />
    ${failed ? '<div class="err">Incorrect username or password.</div>' : ''}
    <button type="submit">Sign in</button>
  </form>
</body>
</html>`;
}

function htmlResponse(body, status) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function middleware(request) {
  const expectedPass = process.env.BASIC_AUTH_PASSWORD;
  const expectedUser = process.env.BASIC_AUTH_USER || 'admin';

  // Fail loud rather than silently serving an unprotected private site.
  if (!expectedPass) {
    return new Response(
      'Server auth not configured: set BASIC_AUTH_PASSWORD in the Vercel project env.',
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const url = new URL(request.url);
  const expectedToken = await sessionToken(expectedPass);

  // Already signed in?
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)me_session=([a-f0-9]+)/);
  if (m && timingSafeEqual(m[1], expectedToken)) return next();

  // Handle the login form submission.
  if (request.method === 'POST' && url.pathname === LOGIN_PATH) {
    let form;
    try {
      form = await request.formData();
    } catch {
      return htmlResponse(loginPage({ failed: true }), 400);
    }
    const user = String(form.get('username') ?? '');
    const pass = String(form.get('password') ?? '');
    if (user === expectedUser && timingSafeEqual(pass, expectedPass)) {
      const headers = new Headers();
      headers.set(
        'Set-Cookie',
        `${COOKIE_NAME}=${expectedToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`,
      );
      headers.set('Location', '/');
      headers.set('Cache-Control', 'no-store');
      return new Response(null, { status: 303, headers });
    }
    return htmlResponse(loginPage({ failed: true }), 401);
  }

  // Anything else from an unauthenticated client → show the login page.
  return htmlResponse(loginPage({ failed: false }), 401);
}
