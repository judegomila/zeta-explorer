# Security

Zeta Observatory is a static site. It has no server-side code, no accounts,
no cookies, no analytics and no third-party scripts. Everything it computes
runs in the visitor's browser. Saved views are kept in that browser's local
storage and are never transmitted.

## Reporting a problem

Please report security issues privately through GitHub's
"Report a vulnerability" button on the repository's Security tab, rather than
in a public issue.

## What is in scope

- Script injection through a shared view URL or an imported session file.
- A shared URL that makes the page do unbounded work.
- Anything that causes the site to load code or data from another origin.

Numerical or mathematical errors are not security issues; please open a
normal issue for those.
