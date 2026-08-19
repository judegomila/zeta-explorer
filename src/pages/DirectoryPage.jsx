import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { NAV_GROUPS } from '../data/nav-groups.js';
import { EDITORIAL_ROUTES } from '../data/editorial-routes.js';

/* The complete organized directory of the whole program — every section from
   NAV_GROUPS, in the editorial theme. This is the hub that incorporates all
   parts of the app into the new design: converted pages open editorial (marked
   with a dot), the rest open in the classic view until their batch lands. */

export default function DirectoryPage() {
  const total = NAV_GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ padding: '32px 34px 70px' }}>
        <div className="ed-lbl">directory</div>
        <h1 className="ed-h1" style={{ fontSize: 'clamp(28px,4vw,40px)', marginTop: 8 }}>Directory</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, maxWidth: '56ch', marginTop: 12 }}>
          {NAV_GROUPS.length} sections, {total} pages. A marker
          <span className="ed-new" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }} />
          indicates a page in the current design; unmarked pages open in the classic view.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 22, marginTop: 34 }}>
          {NAV_GROUPS.map((group) => (
            <section key={group.label} style={{ border: '1px solid var(--hairline)', borderRadius: 11, padding: '18px 20px', background: 'var(--paper)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--hairline)', paddingBottom: 8, marginBottom: 10 }}>
                <h2 style={{ fontSize: 19 }}>{group.label}</h2>
                <span className="ed-lbl">{group.items.length}</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {group.items.map((it) => {
                  const isEd = EDITORIAL_ROUTES.has(it.to);
                  return (
                    <li key={it.to} style={{ margin: '2px 0' }}>
                      <Link
                        to={it.to}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', borderRadius: 6, color: 'var(--ink)', fontSize: 15 }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'var(--paper2)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span className="ed-new" style={{ visibility: isEd ? 'visible' : 'hidden', flex: '0 0 auto' }} />
                        <span>{it.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="ed-postfoot" style={{ marginTop: 40 }}>
          Also: <Link to="/visualizations">the full visualizations index</Link>
          {' · '}<Link to="/classic">the classic (dark) console</Link>
          {' · '}← <Link to="/">the atlas</Link>
        </div>
      </div>
    </div>
  );
}
