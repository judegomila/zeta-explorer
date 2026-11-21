/**
 * @module imp-95336-fresnel-airy-envelope-port-assessment
 * @fileoverview imp-95336 -- import-light ASSESSMENT of the sub-gap
 *   imp-95212-subgap-fresnel-airy-envelope-port: whether the Fresnel-Airy
 *   transition-packet envelope of the paper Section 4.5 packets can be
 *   ported into the seam pencil model family that the RZ-PEN chain
 *   (imp-95212/95328..95334) uses. SCOPING ONLY: it names the four
 *   candidate envelope-to-pencil maps, states the structural obstruction
 *   each one hits, and records which single candidate survives as
 *   conditional. It derives NO bound and fires NO certificate.
 *
 *   WHY AN ASSESSMENT (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95212 developed the multiplicity-pricing branch (THEOREM DR-M /
 *   HL-M / COROLLARY CP) in closed form for TWO-SIDED EXPONENTIAL packets
 *   a e^(-mu|t-c|), and its own HONEST LIMIT (a) narrowed the surviving
 *   successor to two legs: (i) extract the paper Section 4.5 dictionary
 *   constants and (ii) port the two-sided-exponential envelope MODEL to
 *   the actual Fresnel-Airy envelope (or re-derive DR-M for that envelope
 *   class). Leg (ii) -- the ENVELOPE-SHAPE port -- is recorded STILL OPEN
 *   at the foot of imp-95332 and across the RZ-PEN legs. This module
 *   assesses leg (ii): it scopes the maps and their obstructions; it does
 *   not close the sub-gap and it does not touch leg (i).
 *
 *   WHAT THE SEAM PENCIL MACHINERY ACTUALLY DEPENDS ON
 *   -----------------------------------------------
 *   The RZ-PEN / DR-M route is NOT a generic packet argument; every step
 *   is specific to the exponential-system structure:
 *     (M1) LEMMA R1 (same-rate collapse): all packets sharing one rate mu
 *          with centers c_j <= -d collapse on [-d, inf) to a SINGLE
 *          exponential (sum_j a_j e^(mu c_j)) e^(-mu t). This needs the
 *          semigroup identity e^(-mu(t-c)) = e^(mu c) e^(-mu t); it is
 *          exact for exponentials and false for a general envelope.
 *     (M2) LEMMA BI (Cauchy biorthogonal bound): |A_r| <= sqrt(2 mu_r)
 *          beta_r ||f||, beta_r = prod_{k != r} (mu_r+mu_k)/|mu_r-mu_k|.
 *          The closed-form beta_r is the Cauchy DETERMINANT of the Gram
 *          matrix G_rk = 1/(mu_r+mu_k) of {e^(-mu_r t)} on L2(0, inf) --
 *          it is a property of that specific Gram, not of packet size.
 *     (M3) Dyadic lacunary shells -> beta PRODUCTS P_j = prod c_j,
 *          c_j = (2^j+1)/(2^j-1), C_inf = 8.255987935778247, giving the
 *          doubly-exponential decay sqrt(LamBarM) = A_in K C_inf^K
 *          sum P_{b-1}^K e^(-2^(b-1) x). Each c_j is itself a Cauchy
 *          factor for a ratio-2 rate jump.
 *     (M4) Diagonal shift action: the collar shift acts diagonally on the
 *          exponential dictionary, so the multi-shell bound reduces to
 *          single-shell damping e^(-mu_r d) times the (M2)-(M3) coupling.
 *   A port must reproduce M1-M4 (or replace them) for the Fresnel-Airy
 *   envelope class. That is where the obstructions live.
 *
 *   THE FRESNEL-AIRY ENVELOPE (what is being ported)
 *   -----------------------------------------------
 *   Near a simple turning point of the packet phase the local model is the
 *   Airy profile Ai(mu (t - c)) (Fresnel/oscillatory on the pre-caustic
 *   side, Airy exponential tail on the post-caustic side). Its two
 *   asymptotic regimes (Abramowitz-Stegun 10.4.59/10.4.60) decide the
 *   port:
 *     (+ side, post-caustic) Ai(s) ~ (1/(2 sqrt(pi))) s^(-1/4)
 *          e^(-(2/3) s^(3/2))  -- SUPER-exponential decay: dominated by
 *          ANY e^(-gamma s) beyond a finite s. (Cross-checked below: the
 *          product Ai(s) e^(s) is strictly decreasing on [2, 4].)
 *     (- side, pre-caustic) Ai(-s) ~ (1/sqrt(pi)) s^(-1/4)
 *          sin((2/3) s^(3/2) + pi/4)  -- OSCILLATORY with an only
 *          ALGEBRAICALLY (s^(-1/4)) decaying envelope, and Ai(-s)^2 ~
 *          (1/pi) s^(-1/2), whose integral DIVERGES: the pure Airy
 *          envelope is not in L2 on the pre-caustic side. (Cross-checked:
 *          Ai changes sign on [-3, -1], and |Ai(-3)| = 0.3788 far exceeds
 *          any exponential Ai(0) e^(-3) = 0.0177 anchored at the seam.)
 *
 *   THE FOUR CANDIDATE ENVELOPE-TO-PENCIL MAPS (scoped; obstructions named)
 *   -----------------------------------------------
 *   MAP 1 -- POINTWISE EXPONENTIAL DOMINATION. Bound Ai(mu(t-c)) <=
 *     C e^(-gamma|t-c|) pointwise, then run DR-M on the majorant.
 *     OBSTRUCTION (two-fold, hard): (a) on the pre-caustic side the
 *     envelope decays only algebraically (s^(-1/4), non-L2), so NO
 *     two-sided decaying exponential dominates it there -- the packet
 *     carries pre-caustic mass a decaying exponential cannot see;
 *     (b) even where domination holds, LEMMA BI is a statement about the
 *     EXACT Gram of the dictionary, not about pointwise size -- replacing
 *     packets by majorants destroys the R1 collapse identity and the
 *     Cauchy determinant, so an L2-norm inequality does not deliver a
 *     biorthogonal spanning bound. Domination is not a port.
 *   MAP 2 -- EFFECTIVE-RATE SUBSTITUTION. Assign each Airy packet an
 *     effective rate mu from its turning-point scale and treat the
 *     dictionary as {e^(-mu_r t)}. OBSTRUCTION: the Gram of Airy packets
 *     is NOT the Cauchy matrix 1/(mu_r+mu_k); the closed-form beta_r and
 *     the c_j = (2^j+1)/(2^j-1) product law (M2/M3) are the Cauchy
 *     determinant and have no proven Airy analog. Effective rates recover
 *     the damping exponent but not the coupling constants.
 *   MAP 3 -- FRESNEL SUPERPOSITION. Use Ai(x) = (1/2pi) integral
 *     e^(i(u^3/3 + x u)) du to write the packet as a continuous
 *     superposition of Fresnel/exponential modes. OBSTRUCTION: this turns
 *     a finite-rate pencil into a continuous-spectrum object with a CUBIC
 *     OSCILLATORY phase (not a real decay in L2(0, inf)); the finite beta
 *     products and LEMMA BI have no continuous-superposition analog, and
 *     the modes are not in the exponential-system class BI requires.
 *   MAP 4 -- COLLAR-PAST-CAUSTIC RESTRICTION (the survivor, CONDITIONAL).
 *     Place the collar depth d BEYOND each packet turning point so that on
 *     [-d, inf) only the post-caustic Airy tail lives, where MAP-1
 *     domination Ai(s) <= e^(-gamma s) IS valid (super-exponential decay),
 *     and run DR-M on that dominated tail. This is the only structurally
 *     plausible route because it uses the envelope regime that behaves
 *     like an exponential. OBSTRUCTION (conditional, not fatal): it needs
 *     an extra GEOMETRIC hypothesis -- every packet turning point sits at
 *     depth >= d on the packet own side of the seam, so no pre-caustic
 *     oscillatory lobe crosses t = 0 -- and that hypothesis is a fact
 *     about the Section 4.5 packet geometry, which is exactly the STILL
 *     OPEN constants-extraction leg (i). It also does not recover the
 *     Cauchy coupling (M2/M3) for free: the dominated tails are
 *     exponentials only up to the s^(-1/4) prefactor and the (2/3)s^(3/2)
 *     phase, so DR-M would run on the exponential majorant of the tail,
 *     inheriting the MAP-2 Gram question for the majorant rates.
 *
 *   VERDICT (assessment, not a proof)
 *   -----------------------------------------------
 *   The envelope-shape port is a GENUINE STRUCTURAL GAP, not a mechanical
 *   re-derivation: the RZ-PEN/DR-M machinery is specific to the
 *   exponential-system Cauchy-Gram structure (M1-M4), and the Fresnel-Airy
 *   envelope breaks it in two independent ways -- a non-L2 algebraically
 *   decaying pre-caustic oscillatory side, and a non-Cauchy Gram. Of the
 *   four candidate maps, three (pointwise domination, effective-rate,
 *   Fresnel superposition) hit hard obstructions; only MAP 4
 *   (collar-past-caustic) is structurally plausible, and it is CONDITIONAL
 *   on the unextracted Section 4.5 turning-point geometry (leg (i)) and
 *   still inherits the MAP-2 Cauchy-Gram question for the tail majorant.
 *   No bound is derived, no certificate fires, and the sub-gap
 *   imp-95212-subgap-fresnel-airy-envelope-port remains OPEN. This is an
 *   assessment that sharpens WHAT the port must supply (M1-M4 for the Airy
 *   class, plus the turning-point-depth geometry), not a closure.
 *
 * @see imp-95212-multiplicity-priced-shift-damping.js (source: THEOREM
 *   DR-M / HL-M / COROLLARY CP, LEMMA R1 / BI, the sub-gap this assesses)
 * @see imp-95332-chart-tail-pencil-floor.js (records the sub-gap STILL
 *   OPEN at its foot)
 * @see imp-95320-lag-env-laguerre-envelope-concept-note.js (import-light
 *   concept-note pattern followed here)
 *
 * Ticket: imp-95336 (proof, medium). Assessment/scoping only; establishes
 * no new bound; fires no certificate; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Self-contained Airy Ai(x) via its Maclaurin series (entire function),
// used ONLY to cross-check the two documented envelope-shape facts on
// |x| <= 4 (accurate to ~1e-10 there). This is a cross-check of textbook
// asymptotics, never the assessment claim itself.
// ---------------------------------------------------------------------------
function airyAi(x) {
  const c1 = 0.3550280538878172; // Ai(0)
  const c2 = 0.2588194037928068; // -Ai'(0)
  let f = 0;
  let g = 0;
  let af = 1; // running product a_k = prod_{j<k}(3j+1)
  let ag = 1; // running product b_k = prod_{j<k}(3j+2)
  let fact3k = 1; // (3k)!
  let fact3k1 = 1; // (3k+1)!
  for (let k = 0; k < 60; k++) {
    if (k > 0) {
      af *= 3 * (k - 1) + 1;
      ag *= 3 * (k - 1) + 2;
      fact3k *= (3 * k - 2) * (3 * k - 1) * (3 * k);
      fact3k1 *= (3 * k - 1) * (3 * k) * (3 * k + 1);
    }
    f += (af * Math.pow(x, 3 * k)) / fact3k;
    g += (ag * Math.pow(x, 3 * k + 1)) / fact3k1;
  }
  return c1 * f - c2 * g;
}

// The four candidate maps, baked verbatim (no re-import of imp-95212).
const CANDIDATE_MAPS = Object.freeze([
  Object.freeze({
    key: 'map1-pointwise-exponential-domination',
    idea:
      'Bound Ai(mu(t-c)) <= C e^(-gamma|t-c|) pointwise and run DR-M on ' +
      'the two-sided-exponential majorant.',
    obstruction:
      'Pre-caustic side decays only algebraically (s^(-1/4), non-L2) so no ' +
      'decaying exponential dominates it; and LEMMA BI is a Cauchy-Gram ' +
      'statement, not a size statement, so a majorant loses the R1 ' +
      'collapse and the beta determinant. HARD.',
    survives: false,
  }),
  Object.freeze({
    key: 'map2-effective-rate-substitution',
    idea:
      'Assign each Airy packet an effective rate mu from its turning-point ' +
      'scale and treat the dictionary as exponentials {e^(-mu_r t)}.',
    obstruction:
      'The Gram of Airy packets is not the Cauchy matrix 1/(mu_r+mu_k); ' +
      'the closed-form beta_r and the c_j product law have no proven Airy ' +
      'analog. Recovers the damping exponent but not the coupling. HARD.',
    survives: false,
  }),
  Object.freeze({
    key: 'map3-fresnel-superposition',
    idea:
      'Use Ai(x) = (1/2pi) integral e^(i(u^3/3 + x u)) du to write the ' +
      'packet as a continuous superposition of Fresnel/exponential modes.',
    obstruction:
      'Turns a finite-rate pencil into a continuous-spectrum object with a ' +
      'cubic oscillatory phase (not a real L2 decay); finite beta products ' +
      'and LEMMA BI have no continuous-superposition analog. HARD.',
    survives: false,
  }),
  Object.freeze({
    key: 'map4-collar-past-caustic-restriction',
    idea:
      'Place the collar depth d beyond each packet turning point so only ' +
      'the post-caustic Airy tail (super-exponential, exponent-dominable) ' +
      'lives on [-d, inf), then run DR-M on the dominated tail.',
    obstruction:
      'Needs an extra geometric hypothesis (every turning point at depth ' +
      '>= d on its own side, no pre-caustic lobe across the seam) that is ' +
      'the STILL OPEN Section 4.5 constants-extraction leg; and still ' +
      'inherits the MAP-2 Cauchy-Gram question for the tail majorant. ' +
      'CONDITIONAL, not fatal -- the only structurally plausible route.',
    survives: true,
  }),
]);

const MACHINERY_REQUIREMENTS = Object.freeze([
  'M1 LEMMA R1 same-rate collapse (needs the exponential semigroup identity)',
  'M2 LEMMA BI Cauchy biorthogonal bound (needs the Cauchy Gram determinant)',
  'M3 dyadic lacunary beta products P_j = prod c_j (Cauchy ratio-2 factors)',
  'M4 diagonal shift action e^(-mu_r d) (diagonal on the exponential system)',
]);

export const IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT = Object.freeze({
  id: 'imp-95336',
  proofSection: 'S-frontier',
  glosses: 'imp-95212',
  scopes: 'imp-95212-subgap-fresnel-airy-envelope-port',
  question:
    'Can the Fresnel-Airy transition-packet envelope of the paper ' +
    'Section 4.5 packets be ported into the seam pencil model family the ' +
    'RZ-PEN chain uses -- what are the candidate envelope-to-pencil maps ' +
    'and where does each one break?',
  machineryRequirements: MACHINERY_REQUIREMENTS,
  candidateMaps: CANDIDATE_MAPS,
  envelopeFacts: Object.freeze({
    postCausticDecay:
      'Ai(s) ~ (1/(2 sqrt(pi))) s^(-1/4) e^(-(2/3) s^(3/2)): ' +
      'super-exponential, dominated by any e^(-gamma s) beyond finite s.',
    preCausticEnvelope:
      'Ai(-s) ~ (1/sqrt(pi)) s^(-1/4) sin((2/3) s^(3/2) + pi/4): ' +
      'oscillatory, only algebraically (s^(-1/4)) decaying, Ai(-s)^2 ~ ' +
      '(1/pi) s^(-1/2) with divergent integral -- not L2 on that side.',
  }),
  anyEnclosureEstablished: false,
  subGapStillOpen: 'imp-95212-subgap-fresnel-airy-envelope-port',
  verdict:
    'ASSESSMENT ONLY (scoping, not a proof). The Fresnel-Airy ' +
    'envelope-shape port is a genuine structural gap: the RZ-PEN/DR-M ' +
    'machinery is specific to the exponential-system Cauchy-Gram structure ' +
    '(M1-M4), and the Airy envelope breaks it via a non-L2 algebraically ' +
    'decaying pre-caustic oscillatory side and a non-Cauchy Gram. Of four ' +
    'scoped maps, three (pointwise domination, effective-rate, Fresnel ' +
    'superposition) hit hard obstructions; only MAP 4 (collar-past-caustic) ' +
    'survives as CONDITIONAL on the unextracted Section 4.5 turning-point ' +
    'geometry and still inherits the MAP-2 Cauchy-Gram question. No bound ' +
    'is derived, no certificate fires, the sub-gap remains OPEN. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95212-multiplicity-priced-shift-damping.js (THEOREM DR-M/HL-M, ' +
    'COROLLARY CP, LEMMA R1/BI, the sub-gap); ' +
    'imp-95332-chart-tail-pencil-floor.js (sub-gap STILL OPEN at foot); ' +
    'imp-95320-lag-env-laguerre-envelope-concept-note.js (pattern).',
});

export default IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp95336-four-maps-scoped-one-survivor',
    why:
      'The assessment must scope exactly four candidate envelope-to-pencil ' +
      'maps with exactly one surviving (conditional) candidate -- MAP 4, ' +
      'the collar-past-caustic restriction.',
    holds: () => {
      const maps = IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT.candidateMaps;
      if (maps.length !== 4) return false;
      const survivors = maps.filter((m) => m.survives);
      return (
        survivors.length === 1 &&
        survivors[0].key === 'map4-collar-past-caustic-restriction' &&
        maps.every((m) => typeof m.idea === 'string' && m.obstruction.length > 0)
      );
    },
  },
  {
    id: 'imp95336-machinery-requirements-listed',
    why:
      'The port target must name the four RZ-PEN machinery pieces (M1 R1, ' +
      'M2 BI Cauchy Gram, M3 beta products, M4 diagonal shift) any port ' +
      'has to reproduce -- the assessment core.',
    holds: () => {
      const reqs =
        IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT.machineryRequirements;
      return (
        reqs.length === 4 &&
        /LEMMA R1/.test(reqs[0]) &&
        /Cauchy Gram/.test(reqs[1]) &&
        /beta products/.test(reqs[2]) &&
        /shift/.test(reqs[3])
      );
    },
  },
  {
    id: 'imp95336-post-caustic-super-exponential-decay',
    why:
      'MAP 4 rests on the post-caustic Airy tail decaying faster than any ' +
      'exponential; cross-check that Ai(s) e^(s) is strictly decreasing on ' +
      '[2, 4] (so Ai(s) beats e^(-s)).',
    holds: () => {
      let prev = Infinity;
      for (let s = 2; s <= 4 + 1e-9; s += 0.5) {
        const v = airyAi(s) * Math.exp(s);
        if (!(v < prev)) return false;
        prev = v;
      }
      // and the +side stays positive/decreasing (decaying tail)
      return airyAi(2) > airyAi(4) && airyAi(4) > 0;
    },
  },
  {
    id: 'imp95336-pre-caustic-not-exponentially-dominated',
    why:
      'The MAP-1 obstruction: the pre-caustic side oscillates and does not ' +
      'admit a decaying-exponential majorant from the seam. Cross-check ' +
      'that Ai changes sign on [-3, -1] and |Ai(-3)| far exceeds ' +
      'Ai(0) e^(-3).',
    holds: () => {
      const aM1 = airyAi(-1);
      const aM3 = airyAi(-3);
      const signChange = aM1 > 0 && aM3 < 0;
      const notDominated = Math.abs(aM3) > 10 * airyAi(0) * Math.exp(-3);
      return signChange && notDominated;
    },
  },
  {
    id: 'imp95336-airy-series-reference-accuracy',
    why:
      'Guard the self-contained Airy evaluator against a coding error: it ' +
      'must reproduce known reference values Ai(0), Ai(-1), Ai(2) to 1e-9 ' +
      'and Ai(4) to 1e-6 on |x| <= 4.',
    holds: () =>
      Math.abs(airyAi(0) - 0.3550280538878172) < 1e-12 &&
      Math.abs(airyAi(-1) - 0.5355608832923521) < 1e-9 &&
      Math.abs(airyAi(2) - 0.03492413042327235) < 1e-9 &&
      Math.abs(airyAi(4) - 0.0009515638725841338) < 1e-6,
  },
  {
    id: 'imp95336-honesty-gate-no-qed',
    why:
      'Assessment only: no enclosure established, sub-gap still open, no-refereed-bound-change line present, and it glosses/scopes the right sub-gap.',
    holds: () =>
      IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT.verdict
      ) &&
      IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT.glosses === 'imp-95212' &&
      IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT.subGapStillOpen ===
        'imp-95212-subgap-fresnel-airy-envelope-port',
  },
];

for (const assertion of IMP95336_FRESNEL_AIRY_ENVELOPE_PORT_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95336-fresnel-airy-envelope-port-assessment assertion failed: ${assertion.id}`
    );
  }
}
