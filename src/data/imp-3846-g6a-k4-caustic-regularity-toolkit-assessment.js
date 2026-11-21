/**
 * @module imp-3846-g6a-k4-caustic-regularity-toolkit-assessment
 *
 * imp-3846 (proof, frontier-direction): the TOOLKIT-side companion to imp-3727. imp-3727 enumerated the
 * six hypotheses (H1..H6) a Burgers / Calogero-Moser entropy-solution regularity argument for the
 * collision-time field tau_c(x) would need to certify the open G6a_shock_lipschitz Hoelder-1/2 modulus
 *   |tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2}
 * and tagged each hypothesis by its availability from the imp-3642 direct CM/Dyson RK4 flow. This module
 * turns the assessment around: it walks the CLASSICAL caustic-regularity TOOLKIT tool-by-tool (Oleinik
 * E-condition one-sided bound u_x <= 1/s; Lax / Dafermos genuinely-nonlinear shock-set structure theorem;
 * Hopf-Lax / Lax-Oleinik value-function representation; Arnold A_2-fold / A_3-cusp caustic classification;
 * Bec-Khanin Burgers-turbulence Lagrangian-map framework), records for EACH tool what regularity it yields,
 * which of the imp-3727 hypotheses it CONSUMES as input, and whether the imp-3642 discrete flow discharges
 * those inputs. Literature-anchored scoping / derivation only; no estimate shipped, no bridge closure, NO QED.
 *
 * WHAT THIS ADDS BEYOND imp-3727 (the honest incremental contribution)
 * -------------------------------------------------------------------
 * imp-3727 gave a FLAT availability tally (H6 partial, H2 latent, H1/H3/H4/H5 absent) and concluded the gap
 * is "essentially the whole entropy-solution theory". This module refines that verdict in one structural way:
 * the toolkit is INTERNALLY COUPLED, so the missing hypotheses are NOT independent gaps but a DEPENDENCY
 * CHAIN. Reading the tools in the order a proof would chain them:
 *   T3 Hopf-Lax value-function representation  -->  supplies H1 (conservation-law / HJ structure for tau_c)
 *   T2 Lax/Dafermos shock-set structure        -->  supplies H3 (entropy admissibility, rectifiable shock set)
 *   T1 Oleinik one-sided E-condition u_x<=1/s  -->  supplies H4 (the semiconcavity / BV core of the modulus)
 *   T4 Arnold A_2-fold classification          -->  supplies H5 (fixes the exponent at exactly 1/2)
 * EVERY one of T1, T2, T3 has H2 (genuine nonlinearity / convex flux of the free-Burgers hydrodynamic flux)
 * as a PREREQUISITE: Oleinik decay needs f_prime_prime bounded below, Lax admissibility is stated for
 * genuinely-nonlinear flux, and the Hopf-Lax representation needs a convex Hamiltonian. So the four absent
 * hypotheses form the chain H2 -> {H1, H3} -> H4 -> (with H5) -> the 1/2 modulus, and the SINGLE unwritten
 * ROOT that unlocks the chain is H2: the repo never writes the continuum complex-inviscid-Burgers limit of
 * the imp-3642 flow nor certifies its flux is uniformly convex. imp-3727 marked H2 merely "latent"; this
 * module identifies it as the dependency-chain ROOT -- the first (and cheapest-to-name, still-unwritten)
 * gate every downstream tool waits on. That is a scoping refinement, not a closure: naming the root does not
 * supply it, and none of T1..T4 is discharged by the repo.
 *
 * THE ONE TOOL THE imp-3642 FLOW TOUCHES (and why it is downstream, not a shortcut)
 * -------------------------------------------------------------------------------
 * T5 (Bec-Khanin Lagrangian-map / shock-density framework) is the only tool whose INPUT the imp-3642 machinery
 * partially supplies: the RK4 integrator advances the per-particle x_k, so the DISCRETE Lagrangian
 * characteristic map and its crossing/collision events are computed, matching H6 (characteristic-speed /
 * two-point x-difference structure) at the discrete level. But T5 reads regularity OFF an already-constructed
 * continuum entropy solution -- it is a DOWNSTREAM consumer of H1/H2/H3, not an independent producer of the
 * modulus -- so the partial availability of its input is not a shortcut around the H2-rooted chain. It also
 * cannot be upgraded using the repo's single one-sided estimate, the imp-2520 Lemma B Gronwall floor, because
 * that floor is precisely the mesoscopic mechanism K4 is DEFINED to bypass (imp-3708); recycling it would
 * re-import the S2-scale obstruction K4 exists to dodge.
 *
 * THE HONEST GAP (unchanged headline, sharper structure)
 * ------------------------------------------------------
 * Of the five classical tools, FOUR (T1 Oleinik, T2 Lax/Dafermos, T3 Hopf-Lax, T4 Arnold) are wholly absent
 * from the repo and share the single unwritten prerequisite H2, and ONE (T5 Bec-Khanin) has only its discrete
 * Lagrangian-map input partially present and sits downstream of that same chain. So the K4 route still needs
 * essentially the whole Burgers/CM entropy-solution regularity apparatus; imp-3846 only sharpens the shape of
 * that need from "a flat set of four absent hypotheses" to "a dependency chain whose single unwritten root is
 * the convex-flux certification H2 of the imp-3642 hydrodynamic limit". K4 stays WHOLLY NEW (consistent with
 * imp-3714 / imp-3727) and G6a_shock_lipschitz stays OPEN. Literature-anchored scoping / derivation only; no
 * estimate shipped, no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3727-g6a-k4-entropy-solution-regularity-scoping (parent: the H1..H6 hypothesis-availability map this refines)
 * @see imp-3714-g6a-modulus-object-requirements (K4 enumerated as the entropy-solution route, marked NEW)
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (S1 type / S2 scale obstructions K4 dodges)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (the Gronwall floor T5 cannot be upgraded with)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (direct RK4 flow; supplies only the discrete Lagrangian map)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// The classical caustic-regularity toolkit, tool-by-tool. Each entry records the regularity the tool yields,
// the imp-3727 hypotheses it PRODUCES (supplies) and REQUIRES (prerequisite), and whether the imp-3642 discrete
// CM/Dyson RK4 flow discharges the tool's input. availability: absent | partial (no tool is fully present).
const TOOLKIT = [
  {
    id: 'T1',
    tool: 'Oleinik one-sided E-condition estimate u_x(., s) <= 1/s',
    yields:
      'semiconcavity of the solution / Hopf-Lax value function -> BV control and the square-root caustic ' +
      'opening that is the structural source of the Hoelder-1/2 modulus.',
    produces: ['H4'],
    requires: ['H2', 'H3'],
    availability: 'absent',
    repoNote:
      'the ONLY one-sided bound the repo owns is the imp-2520 Lemma B Gronwall floor, the mesoscopic mechanism ' +
      'K4 must BYPASS, so it cannot discharge the Oleinik semiconcavity input',
  },
  {
    id: 'T2',
    tool: 'Lax / Dafermos genuinely-nonlinear shock-set structure theorem',
    yields:
      'the entropy solution shock set is a locally finite union of Lipschitz curves and characteristics enter ' +
      'shocks, so the first-crossing (collision) time tau_c(x) is well-defined and stable.',
    produces: ['H3'],
    requires: ['H2'],
    availability: 'absent',
    repoNote: 'no continuum entropy solution is constructed, so its shock-set structure is unavailable',
  },
  {
    id: 'T3',
    tool: 'Hopf-Lax / Lax-Oleinik value-function representation',
    yields:
      'tau_c(x) expressed as the caustic-envelope (first-crossing) functional of a Hamilton-Jacobi value ' +
      'function, giving the conservation-law / HJ structure the whole toolkit acts on.',
    produces: ['H1'],
    requires: ['H2'],
    availability: 'absent',
    repoNote: 'the repo carries the discrete flow but no continuum HJ / value-function formulation of tau_c(x)',
  },
  {
    id: 'T4',
    tool: 'Arnold A_2-fold / A_3-cusp caustic classification',
    yields:
      'identifies the generic first singularity as a fold (A_2) whose caustic branch opens as a square root, ' +
      'fixing the local exponent at exactly 1/2 (an A_3 cusp would give the cube-root exponent instead).',
    produces: ['H5'],
    requires: ['H2'],
    availability: 'absent',
    repoNote: 'no caustic-type (fold vs cusp) classification of the seed profile in the repo',
  },
  {
    id: 'T5',
    tool: 'Bec-Khanin Burgers-turbulence Lagrangian-map / shock-density framework',
    yields:
      'characteristic-crossing rate and Lagrangian-to-Eulerian Lipschitz invertibility away from caustics, ' +
      'letting the modulus be read across a RANGE of separations (the two-point x-difference structure).',
    produces: ['H6'],
    requires: ['H1', 'H2', 'H3'],
    availability: 'partial',
    repoNote:
      'the imp-3642 RK4 advances the per-particle x_k so the DISCRETE Lagrangian map and its crossing events are ' +
      'computed, but T5 reads regularity OFF an already-constructed continuum solution (downstream of H1/H2/H3), ' +
      'so this partial input is not a shortcut around the chain',
  },
];

// The dependency chain: every genuinely-absent tool (T1..T4) has H2 as a prerequisite, so the four absent
// hypotheses are not independent -- H2 is the single unwritten ROOT the chain hangs from.
const DEPENDENCY_CHAIN = {
  root: 'H2', // genuine nonlinearity / convex flux of the free-Burgers hydrodynamic limit -- unwritten in repo
  chain: 'H2 -> {H1 (via T3), H3 (via T2)} -> H4 (via T1) -> with H5 (via T4) -> Hoelder-1/2 modulus C_Lip',
  rationale:
    'Oleinik decay (T1) needs f_prime_prime bounded below; Lax admissibility (T2) is stated for ' +
    'genuinely-nonlinear flux; the Hopf-Lax representation (T3) needs a convex Hamiltonian -- all three ' +
    'presuppose H2, so H2 is the first gate every downstream tool waits on.',
  // imp-3727 marked H2 merely "latent"; imp-3846 identifies it as the dependency-chain root.
  refinesImp3727: 'flat {H6 partial, H2 latent, H1/H3/H4/H5 absent} tally -> H2-rooted dependency chain',
};

// No tool is fully present in the repo. T5 is the only one whose input is even partially available.
const TOOLKIT_AVAILABILITY = {
  partial: TOOLKIT.filter((t) => t.availability === 'partial').map((t) => t.id), // ['T5']
  absent: TOOLKIT.filter((t) => t.availability === 'absent').map((t) => t.id), // ['T1','T2','T3','T4']
};

// Every absent tool lists H2 as a prerequisite -- the coupling that makes H2 the chain root.
const ABSENT_TOOLS_ALL_REQUIRE_H2 = TOOLKIT.filter((t) => t.availability === 'absent').every((t) =>
  t.requires.includes('H2'),
);

export const IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT = {
  id: 'imp-3846',
  proofSection: 'S-frontier',
  question:
    'Walking the classical caustic-regularity toolkit tool-by-tool (Oleinik E-condition, Lax/Dafermos ' +
    'shock-set structure, Hopf-Lax representation, Arnold fold/cusp classification, Bec-Khanin Lagrangian ' +
    'framework): which imp-3727 hypotheses does each tool produce and require, and which are discharged by the ' +
    'imp-3642 CM/Dyson RK4 flow? Literature-anchored scoping / derivation only, no estimate, no QED.',
  candidate: 'K4',
  parentModule: 'imp-3727', // the hypothesis-availability map this toolkit assessment refines
  toolkit: TOOLKIT,
  toolkitAvailability: TOOLKIT_AVAILABILITY,
  dependencyChain: DEPENDENCY_CHAIN,
  absentToolsAllRequireH2: ABSENT_TOOLS_ALL_REQUIRE_H2,
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'SCOPING / DERIVATION (frontier-direction, NOT rigorous): assessed the classical caustic-regularity toolkit ' +
    'against the imp-3642 CM/Dyson RK4 flow, tool-by-tool. FOUR tools are wholly absent from the repo -- T1 the ' +
    'Oleinik one-sided E-condition u_x<=1/s (produces the H4 semiconcavity core), T2 the Lax/Dafermos shock-set ' +
    'structure theorem (produces H3 entropy admissibility), T3 the Hopf-Lax value-function representation ' +
    '(produces H1 the HJ structure of tau_c), and T4 the Arnold A_2-fold classification (produces H5, fixing the ' +
    'exponent at 1/2) -- and exactly ONE, T5 the Bec-Khanin Lagrangian-map framework (H6), has only its discrete ' +
    'characteristic-map input partially present, sitting downstream of H1/H2/H3 rather than being a shortcut. The ' +
    'refinement over imp-3727 is structural: all four absent tools share the single prerequisite H2 (genuine ' +
    'nonlinearity / convex flux of the free-Burgers hydrodynamic limit), so the absent hypotheses are not ' +
    'independent gaps but a dependency chain H2 -> {H1, H3} -> H4 -> (with H5) -> the Hoelder-1/2 modulus, whose ' +
    'single unwritten ROOT is H2 -- the continuum complex-inviscid-Burgers limit of the imp-3642 flow and its ' +
    'convex-flux certification, which the repo never writes. The imp-2520 Lemma B Gronwall floor, the repo only ' +
    'one-sided estimate, cannot discharge T1 or upgrade T5 because it is exactly the mesoscopic mechanism K4 is ' +
    'defined to BYPASS (imp-3708). K4 therefore stays WHOLLY NEW (consistent with imp-3714 / imp-3727) and ' +
    'G6a_shock_lipschitz stays OPEN. Literature-anchored scoping / derivation only; no estimate shipped, no ' +
    'positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'positivity UNTOUCHED. No refereed bound is changed.',
  citation:
    'imp-3727 (parent: the H1..H6 hypothesis-availability map refined here); imp-3714 (K4 enumerated, marked NEW); ' +
    'imp-3671 (S1 type / S2 scale obstructions K4 dodges); imp-3708 (the Gronwall floor T5 cannot be upgraded with); ' +
    'imp-3642 (direct RK4 attractive-Dyson flow, supplies only the discrete Lagrangian map); literature: Oleinik ' +
    'one-sided E-condition, Lax / Dafermos genuinely-nonlinear shock-set structure, Hopf-Lax / Lax-Oleinik ' +
    'value-function semiconcavity, Arnold A_2-fold / A_3-cusp caustic classification, Bec-Khanin Burgers-turbulence ' +
    'Lagrangian-map review, Menon-Pego / Biane complex-Burgers log-gas hydrodynamics; lambda-roadmap Step 4 ' +
    '(Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT_ASSERTIONS = [
  {
    // Exactly five classical tools are assessed, tagged T1..T5.
    id: 'imp3846-five-tools-assessed',
    description: 'five classical caustic-regularity tools T1..T5 are assessed',
    holds: () =>
      TOOLKIT.length === 5 && TOOLKIT.map((t) => t.id).join(',') === 'T1,T2,T3,T4,T5',
  },
  {
    // Toolkit availability: T5 partial, T1..T4 absent -- no tool fully present in the repo.
    id: 'imp3846-toolkit-availability',
    description: 'T5 partial, T1/T2/T3/T4 absent from the imp-3642 machinery; no tool fully present',
    holds: () =>
      TOOLKIT_AVAILABILITY.partial.join(',') === 'T5' &&
      TOOLKIT_AVAILABILITY.absent.join(',') === 'T1,T2,T3,T4' &&
      TOOLKIT.every((t) => t.availability !== 'available'),
  },
  {
    // The five tools produce the five downstream hypotheses H1,H3,H4,H5,H6 (H2 is the shared prerequisite, not produced).
    id: 'imp3846-tools-produce-downstream-hypotheses',
    description: 'T1..T5 produce H4/H3/H1/H5/H6; H2 is the shared prerequisite, produced by none',
    holds: () => {
      const produced = TOOLKIT.flatMap((t) => t.produces);
      const asSet = [...new Set(produced)].sort().join(',');
      return asSet === 'H1,H3,H4,H5,H6' && !produced.includes('H2');
    },
  },
  {
    // The dependency-chain root is H2, and every absent tool (T1..T4) lists H2 as a prerequisite.
    id: 'imp3846-h2-is-dependency-chain-root',
    description: 'H2 is the chain root: every absent tool T1..T4 requires H2',
    holds: () =>
      DEPENDENCY_CHAIN.root === 'H2' &&
      ABSENT_TOOLS_ALL_REQUIRE_H2 === true &&
      IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.absentToolsAllRequireH2 === true,
  },
  {
    // Honesty gate: scoping only, K4 wholly new, G6a open, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3846-honesty-gate-no-qed',
    description: 'scoping/derivation only: K4 wholly new, G6a open, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.isRigorous === false &&
      IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.k4ConfirmedWhollyNew === true &&
      IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.g6aStillOpen === true &&
      /NO QED/.test(IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT.verdict),
  },
];

for (const a of IMP3846_G6A_K4_CAUSTIC_REGULARITY_TOOLKIT_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3846-g6a-k4-caustic-regularity-toolkit-assessment assertion failed: ${a.id}`);
  }
}
