import React from 'react';
import { Link } from 'react-router-dom';
import { ANIMATIONS_INDEX } from '../data/animations-index.js';

/**
 * AnimationEmbed — drop a single rendered Manim film into its subject page,
 * in context, without duplicating the video markup or the honesty grade.
 *
 * Pass the film's `id` (from ANIMATIONS_INDEX). The component looks the film up,
 * renders a compact cream-themed player (poster -> click-to-play, metadata-only
 * preload so it never blocks the page), the film's honesty-grade badge verbatim,
 * and a link to the full walkthrough + scene list on /animations#id. Renders
 * nothing if the id is unknown, so a page can never crash on a missing film.
 *
 * The full gallery still lives at /animations; this is the same film surfaced
 * where its mathematics is documented.
 */
export default function AnimationEmbed({ id, caption }) {
  const anim = ANIMATIONS_INDEX.find((a) => a.id === id);
  if (!anim) return null;

  return (
    <figure
      style={{
        margin: '26px 0',
        padding: 0,
        border: '1px solid var(--hairline, #d5c9b2)',
        borderRadius: 8,
        overflow: 'hidden',
        background: 'var(--paper2, #f6f1e7)',
      }}
    >
      <div style={{ background: '#0b0e14' }}>
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
      <figcaption style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <strong style={{ color: 'var(--ink, #1c1814)', fontSize: 15 }}>{anim.title}</strong>
          <span
            className="ed-mono"
            style={{ color: 'var(--faint, #877b67)', fontSize: 11 }}
          >
            {anim.durationLabel}
          </span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: 'var(--ink-soft, #4a4238)',
            lineHeight: 1.5,
          }}
        >
          {caption || `Grade: ${anim.grade}`}
        </div>
        <div style={{ marginTop: 8, fontSize: 12.5 }}>
          <Link to={`/animations#${anim.id}`} style={{ fontWeight: 600 }}>
            Full walkthrough &amp; scene list ↗
          </Link>
        </div>
      </figcaption>
    </figure>
  );
}
