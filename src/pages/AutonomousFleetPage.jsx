import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { Figure, Pull } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

/* New explanation page: the autonomous fleet / engine room — how the approach is
   run. Functional post reading-view. Describes the pipeline, not live status. */

export default function AutonomousFleetPage() {
  return (
    <PostLayout
      grade="ENGINE"
      meta={['live', 'infrastructure']}
      title={<>The autonomous fleet</>}
      dek={<>The approach is run continuously by a fleet of AI engines against a self-refilling queue of tickets, with independent referees and hard no-false-QED gates. This page describes how the machine works — not a claim about the mathematics.</>}
      byline={['Infrastructure · explorezeta', 'method, not result']}
      ticker={<span><b>engine live</b> · fleet working the frontier</span>}
      footer={<>Related: <Link to="/route-map">the wall map</Link> · <Link to="/lambda-bounds">the bounds ledger</Link><br /><br />← <Link to="/">the atlas</Link></>}
    >
      <p className="lead">Most of the findings in this atlas were produced by an autonomous pipeline, not a single interactive session. A fleet of engines pulls tickets from a queue, works each one in isolation, and commits results back — with referees and gates in between. This note describes that machine so the results can be read with the right caveats.</p>

      <h2>The loop</h2>
      <p>Three ticket sources keep the queue from starving: sub-gaps of open problems, "closes-if" dependencies surfaced from existing results, and a frontier-scout daemon. Engines claim tickets highest-value-first, run in isolated worktrees to avoid collisions, and route around anything already being worked.</p>

      <Figure caption={<>The pipeline: sources refill the queue; engines claim and work tickets in isolation; referees verify; only gated results merge. The premium engine (Fable-5) is reserved for the hardest frontier walls.</>}>
        <svg width="100%" height="170" viewBox="0 0 440 170" fill="none">
          {[['sources', 40], ['queue', 150], ['engines', 260], ['referee', 360]].map(([lbl, x], i) => (
            <g key={i}>
              <rect x={x} y="60" width="72" height="34" rx="6" fill={ED.paper2} stroke={ED.rule} />
              <text x={Number(x) + 36} y="81" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkSoft} textAnchor="middle">{lbl}</text>
              {i < 3 && <path d={`M${Number(x) + 72} 77 H${Number(x) + 110}`} stroke={ED.brass} strokeWidth="1.2" markerEnd="url(#ar)" />}
            </g>
          ))}
          <path d="M396 94 C420 130 150 150 120 100" stroke={ED.rule} strokeWidth="1" strokeDasharray="3 3" />
          <text x="210" y="150" fontFamily="IBM Plex Mono" fontSize="9" fill={ED.inkFaint}>rejected → re-queued as sub-gaps</text>
          <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill={ED.brass} /></marker></defs>
        </svg>
      </Figure>

      <h2>The gates</h2>
      <p>Two rules are absolute. First: no false QED — the rigorous state of the art stays Λ ≤ 0.2 (Platt–Trudgian), and no engine may claim a proof of RH or a beat of the record. Candidates are labelled candidates. Second: skeptical verification — findings are checked by independent referee agents prompted to refute, not confirm, before anything is recorded.</p>

      <Pull>The fleet produces candidates and no-gos at scale. It does not produce proofs. Every bound on this site is either rigorous-and-cited or explicitly labelled computer-assisted and unrefereed.</Pull>

      <h2>What it is for</h2>
      <p>The value is coverage: mapping every route, ruling out whole families of approaches with theorems, and pushing computer-assisted bounds as far as interval arithmetic allows. Where that leaves the mathematics is recorded across the atlas — the frontier is a verified-height problem, and the fleet cannot manufacture height it has not verified. See <Link to="/route-map">the wall map</Link> for the full route inventory.</p>
    </PostLayout>
  );
}
