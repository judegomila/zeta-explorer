import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout from '../components/editorial/PostLayout.jsx';

import { IMP96631_VERDICT, IMP96631_HONEST_BANNER } from '../data/imp-96631-route-m-largesieve-lower-frame-assessment.js';
import { IMP96688_VERDICT, IMP96688_HONEST_BANNER } from '../data/imp-96688-route-m-frobenius-g-factorization-assessment.js';
import { IMP96689_VERDICT, IMP96689_HONEST_BANNER } from '../data/imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder.js';
import { IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT } from '../data/imp-96691-route-m-bohr-lift-multiplicative-szego-assessment.js';
import { IMP96697_VERDICT, IMP96697_HONEST_BANNER } from '../data/imp-96697-route-m-lammin-elementary-lower-bound-routes-assessment.js';
import { IMP96709_VERDICT, IMP96709_HONEST_BANNER } from '../data/imp-96709-route-m-drift-vif-block-bootstrap.js';
import { IMP96751_VERDICT, IMP96751_HONEST_BANNER } from '../data/imp-96751-route-m-frobenius-ladder-above-12000.js';
import { IMP96770_VERDICT, IMP96770_HONEST_BANNER } from '../data/imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js';
import { IMP96687_RESIDUAL_SUMMARY, IMP96687_HONEST_BANNER } from '../data/imp-96687-lammax-normalized-ratios-above-6000.js';

/* Editorial index for the imp-96707 cohort2 orphan audit: ten Route M finding
   modules that carried real numeric/proof verdicts but had no import statement
   anywhere in src/, no run-assertions.mjs DATA_MODULES entry, and no
   visualizations-index.js entry (imp-96722's glossary headword was separately
   wired by imp-96797). This page imports the remaining nine directly so their
   own verdicts become page-reachable; it re-derives nothing and states no new
   claim of its own. */

const ENTRIES = [
  { id: 'imp-96631', title: 'Large-sieve lower-frame assessment', question: IMP96631_VERDICT.question, summary: IMP96631_HONEST_BANNER },
  { id: 'imp-96688', title: 'Frobenius G-factorization assessment', question: IMP96688_VERDICT.question, summary: IMP96688_HONEST_BANNER },
  { id: 'imp-96689', title: 'lam_min double-double cert crossover ladder', question: IMP96689_VERDICT.question, summary: IMP96689_HONEST_BANNER },
  {
    id: 'imp-96691',
    title: 'Bohr-lift multiplicative-Szego assessment',
    question: IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT.question,
    summary: IMP96691_BOHR_LIFT_MULTIPLICATIVE_SZEGO_ASSESSMENT.verdict,
  },
  { id: 'imp-96697', title: 'lam_min elementary lower-bound routes assessment', question: IMP96697_VERDICT.question, summary: IMP96697_HONEST_BANNER },
  { id: 'imp-96709', title: 'Drift-VIF block bootstrap', question: null, summary: IMP96709_VERDICT.conclusion + ' ' + IMP96709_HONEST_BANNER },
  { id: 'imp-96751', title: 'Frobenius ladder above N=12000', question: IMP96751_VERDICT.question, summary: IMP96751_HONEST_BANNER },
  { id: 'imp-96770', title: 'Weighted-cotangent homogeneous envelope', question: IMP96770_VERDICT.question, summary: IMP96770_HONEST_BANNER },
  { id: 'imp-96687', title: 'lam_max normalized ratios above N=6000', question: null, summary: IMP96687_RESIDUAL_SUMMARY.reading + ' ' + IMP96687_HONEST_BANNER },
];

export default function RouteMCohort2AuditIndexPage() {
  return (
    <PostLayout
      grade="AUDIT"
      meta={['orphan-cohort audit index', `${ENTRIES.length} modules`]}
      title="Route M Cohort-2 Orphans — Audit Index"
      dek={<>
        The imp-96707 audit found ten Route M finding modules with real numeric or proof
        verdicts but zero real consumers anywhere in the build: no importing page, no
        run-assertions.mjs entry, no visualizations-index.js entry — only text mentions
        inside sibling <code>@see</code> lines and log rows. This appendix imports the nine
        still unwired (imp-96722's glossary headword was separately wired into the{' '}
        <Link to="/">Concepts</Link> glossary) so their own verdicts are reader-reachable.
      </>}
      byline={['exploreriemann', 'audit-index · no bound']}
      ticker={<span>index · moves no bound</span>}
      footer={<>
        Source audit: <code>imp-96707-orphan-consumer-audit-cohort2.js</code>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab">Index only — wires existing modules, establishes nothing new</div>
        <p style={{ margin: 0 }}>
          Every entry below is imported verbatim from its own data module. This page performs
          no re-derivation, moves no bound, and asserts no QED; RH is open.
        </p>
      </div>

      {ENTRIES.map((e) => (
        <div key={e.id} className="ed-thm" style={{ margin: '14px 0' }}>
          <div className="tlab">{e.id} — {e.title}</div>
          {e.question && (
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--faint)' }}>{e.question}</p>
          )}
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>{e.summary}</p>
          <p className="ed-mono" style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--faint)' }}>
            src/data/{e.id}-*.js
          </p>
        </div>
      ))}
    </PostLayout>
  );
}
