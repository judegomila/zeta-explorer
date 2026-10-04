import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { NAV_GROUPS, NAV_DROPPED, NAV_SEARCH_ONLY } from '../data/nav-groups.js';

/* The complete directory of the site: every group and section from
   NAV_GROUPS (the same structure as the header menus), in the editorial theme. */

export default function DirectoryPage() {
  const total = NAV_GROUPS.reduce((n, g) => n + g.items.length, 0);
  const placed = new Set(NAV_GROUPS.flatMap((g) => g.items.map((it) => it.to)));
  // Routed pages with no slot in the header menus.
  const other = [...NAV_DROPPED, ...NAV_SEARCH_ONLY].filter((d) => !placed.has(d.path));

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ padding: '32px clamp(16px, 3.2vw, 34px) 70px' }}>
        <div className="ed-lbl">directory · {NAV_GROUPS.length} groups · {total} pages</div>
        <h1 className="ed-h1" style={{ fontSize: 'clamp(28px,4vw,40px)', marginTop: 8 }}>Directory</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, maxWidth: '60ch', marginTop: 12 }}>
          Every section of the site, grouped as in the header menus. All pages except /classic use the cream theme.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(320px,100%),1fr))', gap: 22, marginTop: 34 }}>
          {NAV_GROUPS.map((group) => (
            <section key={group.label} style={{ border: '1px solid var(--rule)', borderRadius: 11, padding: '18px 20px', background: 'var(--paper)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--rule)', paddingBottom: 8, marginBottom: 10 }}>
                <h2 style={{ fontSize: 19 }}>{group.label}</h2>
                <span className="ed-lbl">{group.items.length}</span>
              </div>
              {group.sections.map((sec) => (
                <div key={sec.heading} style={{ marginBottom: 12 }}>
                  <h3 className="ed-lbl" style={{ fontWeight: 400, margin: '8px 0 4px 6px' }}>{sec.heading}</h3>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {sec.items.map((it) => (
                      <li key={it.to} style={{ margin: '1px 0' }}>
                        <Link
                          to={it.to}
                          style={{ display: 'block', padding: '4px 6px', borderRadius: 6, color: 'var(--ink)', fontSize: 15 }}
                          onMouseOver={(e) => (e.currentTarget.style.background = 'var(--paper-2)')}
                          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>

        {other.length > 0 && (
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginTop: 30 }}>
            Pages not in the header menus:{' '}
            {other.map((d, i) => (
              <React.Fragment key={d.path}>
                {i > 0 && ' · '}
                <Link to={d.path}>{d.label}</Link>
              </React.Fragment>
            ))}
          </p>
        )}
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginTop: 12 }}>
          Diagnostic pages: the per-improvement /viz-imp… pages are listed in the{' '}
          <Link to="/visualizations">visualization index</Link>.
        </p>

        <div className="ed-postfoot" style={{ marginTop: 24 }}>
          Also: <Link to="/visualizations">the full visualizations index</Link>
          {' · '}<Link to="/classic">the classic (dark) console</Link>
          {' · '}← <Link to="/atlas">the atlas</Link>
        </div>
      </div>
    </div>
  );
}
