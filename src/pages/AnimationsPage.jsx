// AnimationsPage.jsx — index of rendered (Manim) animations.
//
// Unlike the interactive /visualizations pages, these are pre-rendered films:
// fixed narratives over the same mathematics the app documents. One card per
// film with an inline player, an honesty-grade badge (carried from the site's
// evidence-grading discipline), a scene list, and related internal routes.
//
// Data + tripwires: src/data/animations-index.js.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ANIMATIONS_INDEX } from '../data/animations-index.js';

const WATCH_ORDER = [...ANIMATIONS_INDEX].sort(
  (a, b) => (a.watchOrder ?? 99) - (b.watchOrder ?? 99));

const cardStyle = (accent) => ({
  background: 'var(--paper2)',
  border: '1px solid var(--hairline)',
  borderLeft: `3px solid ${accent}`,
  borderRadius: 8,
  padding: '18px 20px',
  marginTop: 24,
});

const badgeStyle = {
  display: 'inline-block',
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 11,
  color: 'var(--terra-dk)',
  border: '1px solid var(--faint)',
  borderRadius: 4,
  padding: '2px 8px',
  marginTop: 6,
};

const bodyText = { color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8 };

function AnimationCard({ anim }) {
  return (
    <div id={anim.id} className="card" style={{ ...cardStyle(anim.accent), scrollMarginTop: 90 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span className="ed-mono" style={{ color: anim.accent, fontSize: 16, fontWeight: 700 }}>
          {anim.watchOrder}
        </span>
        <h2 style={{ color: 'var(--ink)', fontSize: 20, margin: 0 }}>{anim.title}</h2>
        <span className="ed-mono" style={{ color: 'var(--faint)', fontSize: 12 }}>
          {anim.durationLabel}
        </span>
        <span className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11,
                                           border: '1px solid var(--hairline)',
                                           borderRadius: 4, padding: '1px 6px' }}>
          {anim.category}
        </span>
      </div>
      <span style={badgeStyle}>{anim.grade}</span>

      <div style={{ marginTop: 14, borderRadius: 6, overflow: 'hidden',
                    border: '1px solid var(--hairline)', background: 'var(--paper)' }}>
        <video
          controls
          playsInline
          preload="metadata"
          poster={anim.posterSrc}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <source src={anim.videoSrc} type="video/mp4" />
          Your browser doesn&rsquo;t support embedded video.{' '}
          <a href={anim.videoSrc}>Download the video</a>.
        </video>
      </div>

      <p style={{ ...bodyText, marginTop: 14 }}>{anim.description}</p>

      <div style={{ marginTop: 12 }}>
        <div className="ed-mono" style={{ fontSize: 10, textTransform: 'uppercase',
                                          letterSpacing: 0.5, color: 'var(--faint)' }}>
          Scenes
        </div>
        <ol style={{ ...bodyText, fontSize: 13, margin: '6px 0 0', paddingLeft: 20 }}>
          {anim.scenes.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14 }}>
        {anim.relatedRoutes.map((r) => (
          <Link key={r.to} to={r.to}
                style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}>
            → {r.label}
          </Link>
        ))}
        {anim.external && anim.externalPage && (
          <a href={anim.externalPage} target="_blank" rel="noreferrer"
             style={{ color: 'var(--faint)', fontSize: 13, textDecoration: 'none' }}>
            ↗ canonical host
          </a>
        )}
      </div>
    </div>
  );
}

export default function AnimationsPage() {
  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '60rem', padding: '28px 34px 70px' }}>
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>Animations</h1>
        <nav aria-label="Watch order" style={{ margin: '18px 0 6px' }}>
          <div className="ed-mono" style={{ fontSize: 10, textTransform: 'uppercase',
                                            letterSpacing: 0.5, color: 'var(--faint)',
                                            marginBottom: 6 }}>
            Watch order — best first
          </div>
          <ol style={{ margin: 0, paddingLeft: 22, fontSize: 14, lineHeight: 1.85,
                       color: 'var(--ink-soft)' }}>
            {WATCH_ORDER.map((anim) => (
              <li key={anim.id}>
                <a href={`#/animations#${anim.id}`}
                   onClick={(e) => { e.preventDefault(); document.getElementById(anim.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                   style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                  {anim.title}
                </a>
                <span className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11,
                                                   marginLeft: 8 }}>
                  {anim.durationLabel.split(' · ')[0]} · {anim.category}
                </span>
              </li>
            ))}
          </ol>
        </nav>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 760 }}>
          Pre-rendered film walkthroughs of the project&rsquo;s mathematics, made with{' '}
          <a href="https://github.com/3b1b/manim" target="_blank" rel="noreferrer">Manim</a>.
          The interactive versions live under{' '}
          <Link to="/visualizations">Visualizations</Link>; these are the fixed narratives —
          each badge states exactly what evidentiary grade the film&rsquo;s content carries.
        </p>
        {WATCH_ORDER.map((anim) => (
          <AnimationCard key={anim.id} anim={anim} />
        ))}
        <p className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 28 }}>
          Rendered with Manim Community Edition · data &amp; tripwires in{' '}
          <code>src/data/animations-index.js</code> · films in <code>public/animations/</code>
        </p>
      </div>
    </div>
  );
}
