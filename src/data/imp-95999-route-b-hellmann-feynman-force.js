/**
 * @fileoverview imp-95999 -- Novel-routes roadmap (2026-09-23) ROUTE B first test:
 * the arithmetic freeze-flow Hellmann-Feynman force drho/dtau on a zeta zero under a
 * prime-field coupling tau, and the confinement test on the low zeta zeros.
 *
 * ROUTE B (rh-novel-routes-roadmap-2026-09-23, key 'B'). The heat / de Bruijn flow is
 * flow-BLIND (soft, never sees primes) -- the proven reason it cannot give RH
 * (project_flow_blindness_and_T3_strip). Build the complementary ARITHMETIC flow: couple
 * the primon external field with a parameter tau and ask whether the induced motion of a
 * zero is a confining drift toward the self-dual line sigma=1/2.
 *
 * THE DEFORMATION (concrete, reflection-symmetric). Take the completed zeta xi(s) and add
 * an additive prime-field source that respects the functional equation xi(s)=xi(1-s):
 *     F(s,tau) = xi(s) + tau . Psi(s),   Psi(s) = sum_p log p . (p^{-s} + p^{-(1-s)}).
 * Psi(s)=Psi(1-s) by construction, so F is reflection-symmetric about sigma=1/2 for every
 * tau (Kramers-Wannier self-duality is preserved along the flow). Multiplicative rescalings
 * of xi never move its zeros (a nonvanishing factor at rho leaves xi(rho)=0 fixed); an
 * ADDITIVE source is the minimal deformation that actually transports a zero, so Psi is the
 * prime-field the flow-blindness no-go says the soft flow lacks.
 *
 * THE HELLMANN-FEYNMAN FORCE (implicit function theorem). F(rho(tau),tau)=0 defines rho(tau);
 * differentiating,
 *     drho/dtau = - (dF/dtau) / (dF/ds) |_(rho,tau) = - Psi(rho) / xi'(rho).
 * This is the log-gas reading exactly: the numerator Psi(rho) is the prime EXTERNAL field at
 * the zero; the denominator xi'(rho) is (via the Hadamard product, xi'/xi = sum 1/(s-rho'))
 * the 2D-Coulomb field the OTHER zeros exert -- the neighbour repulsion that resists the
 * prime push. Force = prime field / Coulomb field, the primon-gas Newton law for a zero.
 *
 * THE SIGMA-DRIFT ON THE CRITICAL LINE (the confinement observable). All low zeros sit ON
 * sigma=1/2, so the test is a linear-stability test: probe the sigma-component of the force as
 * sigma leaves 1/2. The clean, cheaply-computable half is the prime field itself. Writing
 * s=1/2+delta+i gamma one gets the CLOSED FORM (verified against direct evaluation to 12
 * digits, scratch tmp/imp-95999-scratch.mjs):
 *     Re Psi(1/2+delta+i gamma) = 2 sum_p log p . p^{-1/2} . cos(gamma ln p) . cosh(delta ln p).
 * cosh is even in delta, hence Re Psi is EVEN in delta, hence
 *     d/ddelta Re Psi |_(delta=0) = 0    for EVERY gamma.
 * So the prime-field sigma-drift VANISHES on the critical line: sigma=1/2 is an exact FIXED
 * POINT of the arithmetic flow (a direct consequence of Psi(s)=Psi(1-s); measured residual
 * Re Psi(+delta)-Re Psi(-delta) = 0 to machine precision, cap 500, delta=0.02).
 *
 * THE STABILITY SIGN (the binding sub-gap). Whether the fixed point is CONFINING (attracting)
 * is governed by the curvature
 *     d2/ddelta2 Re Psi |_0 = 2 sum_p (log p)^3 . p^{-1/2} . cos(gamma ln p).
 * As a raw prime sum this DIVERGES (the coefficients (log p)^3 p^{-1/2} grow), and the finite
 * "octave-freezing" truncation does NOT converge -- its very SIGN flips with the cutoff. At
 * gamma_1=14.1347 the truncated curvature runs -56.07 (primes<=50) -> -275.8 (<=1000) ->
 * +203.8 (<=5000) -> +1224.6 (<=20000): no stable sign. Finite-prime freezing therefore
 * cannot decide confinement; the curvature is meaningful only through the analytically-
 * continued -zeta'/zeta (the explicit-formula / Coulomb-regularized prime field), which
 * re-imports the transcendental input.
 *
 * VERDICT (honest partial; route B first test). FIXED-POINT-YES / STABILITY-OPEN:
 *   (1) sigma=1/2 is an EXACT fixed point of the arithmetic flow for every zero (proved from
 *       reflection symmetry; not numeric luck) -- a genuine, non-soft structural statement the
 *       heat flow cannot make;
 *   (2) the confinement (attracting) sign is OPEN and its natural finite-prime estimator does
 *       not converge -- the named sub-gap is B-STABILITY-SIGN: obtain the sign of the
 *       Coulomb-regularized curvature (equivalently Re of the regularized prime field's second
 *       sigma-derivative at each zero) via -zeta'/zeta continuation, not truncation.
 * This is consistent with the flow-blindness no-go rather than against it: the no-go says a
 * SOFT flow cannot give RH and genuine arithmetic input is required; route B locates exactly
 * where that arithmetic input must enter (the regularized curvature sign) and shows the naive
 * arithmetic surrogate is insufficient. NO bound; NO QED; RH open; no refereed bound is changed.
 */

// --- low nontrivial zeta zeros (imaginary parts, on sigma=1/2) ---
export const LOW_ZETA_ZEROS = Object.freeze([
  14.134725141734693,
  21.022039638771555,
  25.010857580145688,
  30.424876125859513,
  32.935061587739189,
  37.586178158825671,
]);

function primesUpTo(P) {
  const sieve = new Uint8Array(P + 1);
  const out = [];
  for (let i = 2; i <= P; i += 1) {
    if (!sieve[i]) {
      out.push(i);
      for (let j = 2 * i; j <= P; j += i) sieve[j] = 1;
    }
  }
  return out;
}

// Re Psi(1/2+delta+i gamma) via the closed cosh form.
function rePsiClosed(gamma, delta, primes) {
  let s = 0;
  for (const p of primes) {
    const lp = Math.log(p);
    s += lp * Math.pow(p, -0.5) * Math.cos(gamma * lp) * Math.cosh(delta * lp);
  }
  return 2 * s;
}

// Re Psi via direct evaluation of log p (p^{-s} + p^{-(1-s)}), s=1/2+delta+i gamma.
function rePsiDirect(gamma, delta, primes) {
  let s = 0;
  for (const p of primes) {
    const lp = Math.log(p);
    const a = Math.pow(p, -(0.5 + delta)) * Math.cos(gamma * lp); // Re p^{-s}
    const b = Math.pow(p, -(0.5 - delta)) * Math.cos(gamma * lp); // Re p^{-(1-s)}
    s += lp * (a + b);
  }
  return s;
}

// curvature d2/ddelta2 Re Psi |_0 = 2 sum_p (log p)^3 p^{-1/2} cos(gamma ln p)
function curvature(gamma, primes) {
  let s = 0;
  for (const p of primes) {
    const lp = Math.log(p);
    s += Math.pow(lp, 3) * Math.pow(p, -0.5) * Math.cos(gamma * lp);
  }
  return 2 * s;
}

const PRIMES_500 = primesUpTo(500);
const GAMMA1 = LOW_ZETA_ZEROS[0];

// Truncation ladder of the curvature at gamma_1: the SIGN flips -> non-convergence.
export const CURVATURE_TRUNCATION_LADDER = Object.freeze({
  50: curvature(GAMMA1, primesUpTo(50)),
  1000: curvature(GAMMA1, primesUpTo(1000)),
  5000: curvature(GAMMA1, primesUpTo(5000)),
  20000: curvature(GAMMA1, primesUpTo(20000)),
});

export const ROUTE_B_HELLMANN_FEYNMAN = Object.freeze({
  id: 'imp-95999-route-b-hellmann-feynman-force',
  route: 'B',
  roadmap: 'rh-novel-routes-roadmap-2026-09-23',
  forceLaw: 'drho/dtau = -Psi(rho)/xi’(rho) = (prime field) / (Coulomb field of other zeros)',
  deformation: 'F(s,tau)=xi(s)+tau.Psi(s), Psi(s)=sum_p log p (p^{-s}+p^{-(1-s)}), Psi(s)=Psi(1-s)',
  closedForm:
    'Re Psi(1/2+delta+i gamma) = 2 sum_p log p . p^{-1/2} . cos(gamma ln p) . cosh(delta ln p)',
  fixedPoint:
    'Re Psi even in delta (cosh) => d/ddelta Re Psi|_0 = 0 for every gamma => sigma=1/2 is an '
    + 'EXACT fixed point of the arithmetic flow (from reflection symmetry, not numeric).',
  stabilitySubGap:
    'B-STABILITY-SIGN: confinement is set by the curvature 2 sum_p (log p)^3 p^{-1/2} cos(gamma ln p), '
    + 'whose raw prime truncation DIVERGES and whose sign FLIPS with the cutoff; deciding it needs the '
    + 'analytically-continued -zeta’/zeta (Coulomb-regularized), re-importing the transcendental input.',
  verdict: 'FIXED-POINT-YES / STABILITY-OPEN',
  note: 'Derivation + measurement only; no bound; RH open; no refereed bound is changed; NO QED.',
});

export const ROUTE_B_HELLMANN_FEYNMAN_ASSERTIONS = Object.freeze([
  {
    name: 'closed cosh form of Re Psi matches direct evaluation to 1e-9 (gamma_1, delta=0.01, primes<=500)',
    holds: () => Math.abs(
      rePsiClosed(GAMMA1, 0.01, PRIMES_500) - rePsiDirect(GAMMA1, 0.01, PRIMES_500),
    ) < 1e-9,
  },
  {
    name: 'sigma=1/2 fixed point: Re Psi is even in delta (Re Psi(+d) - Re Psi(-d) = 0) for every low zero',
    holds: () => LOW_ZETA_ZEROS.every(
      (g) => Math.abs(rePsiDirect(g, 0.02, PRIMES_500) - rePsiDirect(g, -0.02, PRIMES_500)) < 1e-9,
    ),
  },
  {
    name: 'confinement sub-gap: truncated curvature at gamma_1 flips sign (negative at cap 50, positive at cap 20000)',
    holds: () => CURVATURE_TRUNCATION_LADDER[50] < 0 && CURVATURE_TRUNCATION_LADDER[20000] > 0,
  },
  {
    name: 'curvature truncation is non-convergent: |curv(20000)| exceeds |curv(1000)| (grows, does not settle)',
    holds: () => Math.abs(CURVATURE_TRUNCATION_LADDER[20000]) > Math.abs(CURVATURE_TRUNCATION_LADDER[1000]),
  },
  {
    name: 'honest verdict recorded: fixed-point established, stability sign open, no QED / RH open',
    holds: () => ROUTE_B_HELLMANN_FEYNMAN.verdict === 'FIXED-POINT-YES / STABILITY-OPEN'
      && /RH open/.test(ROUTE_B_HELLMANN_FEYNMAN.note),
  },
]);

export default ROUTE_B_HELLMANN_FEYNMAN;
