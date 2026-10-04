import React from 'react';
import { Link } from 'react-router-dom';

/**
 * VizCeilingNote — shared-ceiling guardrail note for exploratory
 * visualization pages. Renders the standard anti-overclaim line: this picture
 * is an exact, exploratory visualization that re-derives only `claim`, does NOT
 * beat Platt-Trudgian Lambda <= 0.2, and is no false QED.
 *
 * Props:
 *   claim        what the picture re-derives (e.g. "Λ ≥ 0"). Default "Λ ≥ 0".
 *   ceiling      optional extra ceiling phrase appended in parentheses
 *                (e.g. "twin-ladder geometry is a dead end as a rigorous Λ route").
 *   routeMapLink whether to append a link to the route map. Default true.
 *   as           "li" (default, slots into an existing ul) or "div" (standalone banner).
 */
export default function VizCeilingNote({
  claim = 'Λ ≥ 0',
  ceiling,
  routeMapLink = true,
  as = 'li',
}) {
  const body = (
    <>
      <strong>Ceiling:</strong> this is an exact, exploratory visualization — it
      re-derives only <strong>{claim}</strong>
      {ceiling ? <> ({ceiling})</> : null} and does <em>not</em> beat Platt–Trudgian
      {' '}Λ ≤ 0.2 or prove RH — no false QED.
      {routeMapLink ? (
        <> See the <Link to="/route-map">route map</Link> for where each thread sits.</>
      ) : null}
    </>
  );

  if (as === 'div') {
    return (
      <div
        style={{
          fontSize: 13,
          color: 'var(--ink-soft)',
          lineHeight: 1.7,
          padding: '8px 14px',
          borderRadius: 6,
          marginTop: 12,
          background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--rule) 12%, transparent)',
        }}
      >
        {body}
      </div>
    );
  }

  return <li style={{ color: 'var(--ink-soft)' }}>{body}</li>;
}
