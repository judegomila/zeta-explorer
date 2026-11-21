import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout from '../components/editorial/PostLayout.jsx';

import {
  IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT,
  IMP96753_HONEST_BANNER,
} from '../data/imp-96753-basis-c-reach-dataset-requirement.js';
import { GMIN_LADDER_REACH_FRONTIER } from '../data/imp-96754-gmin-ladder-reach-frontier.js';

/* Audit index for the imp-96802 ticket: the imp-96753/imp-96754 reach-frontier
   verdict -- the ordinate heights those two measurements need EXIST far below
   the Platt-Trudgian frontier, but no contiguous machine-readable zero list of
   the required length is cached -- previously lived only in module prose with
   no importing page, no run-assertions.mjs entry beyond the module's own
   self-check, and no reader-reachable surface. This page imports both modules
   directly so their verdicts become page-reachable; it re-derives nothing. */

export default function ReachFrontierDatasetAuditPage() {
  const r753 = IMP96753_BASIS_C_REACH_DATASET_REQUIREMENT;
  const r754 = GMIN_LADDER_REACH_FRONTIER;

  return (
    <PostLayout
      grade="AUDIT"
      meta={['reach-frontier audit index', '2 modules']}
      title="Reach Frontier: Heights Exist, Ordinate Lists Don't"
      dek={<>
        Two independent measurements -- the Basis-C two-interval box correlation (imp-96753) and the
        disjoint dyadic gap-exponent ladder (imp-96754) -- hit the same wall: the zero heights their
        next rung needs sit far <em>below</em> the Platt&ndash;Trudgian verified frontier, so the
        ordinates exist and have been rigorously computed, but no contiguous machine-readable ordinate
        list of the required length is cached anywhere in this project. This page surfaces both
        verdicts, which previously lived only in module prose.
      </>}
      byline={['exploreriemann', 'audit-index · no bound']}
      ticker={<span>index · Platt–Trudgian Λ ≤ 0.2 stays SOTA</span>}
      footer={<>
        Source modules: <code>imp-96753-basis-c-reach-dataset-requirement.js</code>,{' '}
        <code>imp-96754-gmin-ladder-reach-frontier.js</code>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab">Index only — wires existing modules, establishes nothing new</div>
        <p style={{ margin: 0 }}>
          Every claim below is imported verbatim from its own data module. This page performs no
          re-derivation, moves no bound, and asserts no QED; Platt–Trudgian Λ ≤ 0.2 remains SOTA and
          RH is open.
        </p>
      </div>

      <div className="ed-thm" style={{ margin: '14px 0' }}>
        <div className="tlab">imp-96753 — Basis-C reach-rung dataset requirement</div>
        <p style={{ margin: '6px 0 0', fontSize: 14 }}>{IMP96753_HONEST_BANNER}</p>
        <p className="ed-mono" style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--faint)' }}>
          span needed {r753.primaryReadout.spanReqZeros.toExponential(2)} zeros (T ≈{' '}
          {r753.primaryReadout.heightT.toExponential(2)}) — {r753.primaryReadout.heightBelowPlattBy.toFixed(0)}x
          below the PT frontier, {r753.primaryReadout.shortfallVsCache.toFixed(0)}x past the cached span
        </p>
      </div>

      <div className="ed-thm" style={{ margin: '14px 0' }}>
        <div className="tlab">imp-96754 — gmin ladder reach frontier</div>
        <p style={{ margin: '6px 0 0', fontSize: 14 }}>{r754.verdict}</p>
        <p className="ed-mono" style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--faint)' }}>
          next rung k={r754.acquisition.nextRungK} needs {r754.acquisition.nextRungExtraOrdinates.toLocaleString()} more
          consecutive ordinates (height ≈ {r754.acquisition.heightForNextRungIndexApprox.toExponential(2)}, PT frontier
          T = {r754.acquisition.plattTrudgianFrontierT.toExponential(4)})
        </p>
      </div>
    </PostLayout>
  );
}
