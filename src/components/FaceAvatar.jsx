import React, { useState } from 'react';

/**
 * FaceAvatar — a round portrait for a timeline contributor.
 *
 * Renders the person's photo when `person.photo` is set (a /portraits/ path served
 * from public/); otherwise, or if the image fails to load, falls back to a monogram
 * avatar: a colored disc with the person's initials. The disc color is derived
 * deterministically from the person's key so each contributor is visually stable.
 *
 * @param {{ person: import('../data/lambda-timeline-people.js').Person, size?: number }} props
 */

// Deterministic hue from a string (0–359).
function hueFor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

// Initials from a display name: first letter of the last two significant tokens,
// skipping single-letter initials like "N." so "N. G. de Bruijn" → "dB".
function initialsFor(display) {
  const tokens = display.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(Boolean);
  const words = tokens.filter((t) => !/^[A-Z]\.?$/.test(t));
  const pick = (words.length >= 2 ? words.slice(-2) : words.length ? words : tokens.slice(-1));
  return pick.map((w) => w[0].toUpperCase()).join('').slice(0, 2) || '?';
}

export default function FaceAvatar({ person, size = 44 }) {
  const [failed, setFailed] = useState(false);
  const hue = hueFor(person.key || person.display);
  const ring = `hsl(${hue} 55% 55%)`;
  const showPhoto = person.photo && !failed;

  const common = {
    width: size, height: size, borderRadius: '50%',
    border: `2px solid ${ring}`, boxSizing: 'border-box', flexShrink: 0,
    objectFit: 'cover', display: 'block',
  };

  const inner = showPhoto ? (
    <img
      src={person.photo}
      alt={person.display}
      title={person.display}
      loading="lazy"
      onError={() => setFailed(true)}
      style={common}
    />
  ) : (
    <div
      title={person.display}
      aria-label={person.display}
      style={{
        ...common,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `hsl(${hue} 45% 22%)`, color: `hsl(${hue} 70% 78%)`,
        fontFamily: 'var(--font-mono)', fontWeight: 700,
        fontSize: Math.round(size * (person.collective ? 0.28 : 0.36)),
        letterSpacing: 0.5, userSelect: 'none',
      }}
    >
      {person.collective ? 'P15' : initialsFor(person.display)}
    </div>
  );

  if (person.wiki) {
    return (
      <a href={person.wiki} target="_blank" rel="noreferrer"
         style={{ display: 'inline-block', lineHeight: 0 }}
         title={`${person.display} — ${person.wiki.includes('wikipedia') ? 'Wikipedia' : 'reference'}`}>
        {inner}
      </a>
    );
  }
  return inner;
}
