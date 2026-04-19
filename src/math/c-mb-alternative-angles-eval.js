/**
 * imp-864 + imp-865 + imp-866: scoping evaluation of three alternative
 * unconditional-angle approaches to C_mb.
 *
 * WHY
 * ---
 * imp-486 ruled out three approaches (Selberg, Huxley, GGM) for an
 * unconditional C_mb = O(1) bound. imp-856 scoped three hybrid rescues
 * looking for ANY finite-K weaker bound. This file evaluates three
 * further alternative angles that imp-486 and imp-856 did not
 * systematically analyse:
 *
 *   (C1, imp-864) Vinogradov mean-value theorem (Bourgain-Demeter-Guth 2016)
 *   (C2, imp-865) Bourgain-Bondarenko-Seip 2013 zero-density
 *   (C3, imp-866) Maier matrix method for extremal gap statistics
 *
 * For each, record (i) what it delivers if it worked, (ii) the specific
 * technical obstacle, (iii) a feasibility verdict, (iv) the next concrete
 * computation that would test the approach. This is honest-partial
 * scoping — no new theorems are proved here.
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences in JSDoc text.
 */

// ── C1 / imp-864: Vinogradov mean-value theorem ───────────────────────────

export const C1_VINOGRADOV_MEAN_VALUE = {
  id: 'imp-864',
  name: 'Vinogradov mean-value theorem (Bourgain-Demeter-Guth 2016)',

  idea:
    'The Bourgain-Demeter-Guth 2016 proof of the Vinogradov mean-value ' +
    'conjecture gives the SHARP bound on exponential sums ' +
    'J_{s,k}(N) = #{(m_1,...,m_s,n_1,...,n_s) : sum m_j^d = sum n_j^d, 1<=d<=k}, ' +
    'via decoupling. This bound is now unconditional and sharp, closing a ' +
    'gap that was open since the 1930s. Question: does the bound control ' +
    'the variance of S_{k_star} via the zero-counting exponential sum?',

  whatItWouldGive:
    'If the Fourier dual of S_{k_star}(tau) at the Riemann-zero frequencies ' +
    'can be bounded by a Vinogradov-type mean-value over integer d-tuples ' +
    'of bounded height, the sharp BDG bound gives a finite K. Specifically, ' +
    'if we can reformulate S_{k_star} as an exponential sum over truncated ' +
    'von Mangoldt coefficients, BDG 2016 would deliver a power-saving in ' +
    'the variance.',

  technicalObstacle:
    'The BDG bound controls lattice-point counts for SMOOTH polynomial ' +
    'maps — its natural input is the zeta function on the critical line ' +
    'at discrete heights, not the Cauchy sum S_{k_star} at the argmin. ' +
    'The Fourier dual of a Cauchy sum is a Hilbert transform, which is ' +
    'NOT of the form BDG handles. Even if we could reformulate, the ' +
    'Dirichlet approximation required to feed BDG-style bounds re-introduces ' +
    'the log-averaged fluctuation that imp-486 APPROACH_A (Selberg) hit.',

  nextComputation:
    'Write down S_{k_star}(tau) as an explicit contour integral of ' +
    'Hilbert-transformed zero density, then Fourier-dualise at the ' +
    'microscopic scale 1/log(T). If the resulting sum factors over ' +
    'integer d-tuples of bounded height, try BDG 2016. Early indication: ' +
    'the Hilbert-transform factor is not polynomial in the dual variable, ' +
    'so direct BDG does not apply.',

  feasibility: 'LOW — structural shape-mismatch between Cauchy sum and BDG input',
  verdict: 'LIKELY FAILS — BDG controls smooth polynomial sums, not Hilbert transforms',
};

// ── C2 / imp-865: Bourgain-Bondarenko-Seip zero-density ───────────────────

export const C2_BBS_ZERO_DENSITY = {
  id: 'imp-865',
  name: 'Bourgain-Bondarenko-Seip 2013 zero-density',

  idea:
    'Bourgain, Bondarenko, and Seip 2013 improved zero-density estimates ' +
    'N(sigma, T) = #{rho: Re(rho) >= sigma, |Im(rho)| <= T} for sigma in ' +
    '(1/2, 1). The bound is tighter than Huxley at sigma close to 1/2 ' +
    'and gives an unconditional control on the count of off-line zeros. ' +
    'Question: combined with on-line Selberg S(T) = O(log T / log log T), ' +
    'does the product/combination give a finite K for C_mb?',

  whatItWouldGive:
    'If BBS controls off-line density and Selberg controls on-line ' +
    'fluctuation, the PRODUCT might bound the Cauchy-sum variance on ' +
    'the critical line — the part that C_mb actually measures. The ' +
    'hope is that off-line zeros contribute a small error that Selberg ' +
    'absorbs.',

  technicalObstacle:
    'Same structural obstacle as imp-486 APPROACH_B (Huxley) — ' +
    'orthogonality. S_{k_star} is a sum over ON-line zeros. BBS counts ' +
    'OFF-line zeros. Knowing that off-line zeros are rare does not ' +
    'constrain how ON-line zeros are spaced. The Selberg on-line bound ' +
    'is at the log-averaged scale, not the CLT scale that C_mb needs. ' +
    'The product of two log-factor bounds is still log-factor.',

  nextComputation:
    'Attempt an explicit variance decomposition: Var(S_{k_star}) = ' +
    'Var_on + Var_off + 2*Cov. BBS bounds Var_off. Selberg bounds Var_on ' +
    'at log scale. The covariance term is the dangerous one — on a ' +
    'typical configuration, Cov is O(Var_on) which dominates. Unless BBS ' +
    'also bounds Cov (it does not), the combination does not close.',

  feasibility: 'LOW — same orthogonality obstacle that killed Huxley; ' +
               'product-of-bounds does not escape log scaling',
  verdict: 'LIKELY FAILS — off-line and on-line statistics are orthogonal',
};

// ── C3 / imp-866: Maier matrix method ─────────────────────────────────────

export const C3_MAIER_MATRIX = {
  id: 'imp-866',
  name: 'Maier matrix method for extremal gap statistics (Montgomery 1973 only)',

  idea:
    'Maier 1988 used a matrix method to extract extremal prime-gap ' +
    'statistics from Bombieri-Vinogradov + Elliott-Halberstam assumptions. ' +
    'The analog for Riemann zeros would use only Montgomery 1973 ' +
    'unconditional pair-correlation content (Fourier support in (-1,1)) + ' +
    'some standard prime-zero-to-density dictionary. Question: does the ' +
    'Maier-style method give extremal Cauchy-sum statistics at the argmin ' +
    'site WITHOUT the full Ben Arous-Bourgade extremal conditioning?',

  whatItWouldGive:
    'If yes, the argmin-conditional value of S_{k_star} could be bounded ' +
    'by a ratio (extremal) / (typical) of Maier-method matrix entries, ' +
    'giving a finite K via Montgomery-only input. This would close imp-856 ' +
    'approach (b) fully.',

  technicalObstacle:
    'The Maier matrix method fundamentally uses the DIVISOR-function ' +
    'structure of primes. Riemann zeros have no divisor-function analog ' +
    '(they are not integers). Transporting Maier to the zero process ' +
    'requires a surrogate — candidates: (a) use a Dirichlet character ' +
    'sum over the zero-counting function (but this IS the BDG target of ' +
    'C1 and runs into the same obstacle), (b) use the determinantal ' +
    'structure of the zero point process (but the determinantal kernel ' +
    'IS GUE universality — circular). Neither surrogate is known to close.',

  nextComputation:
    'Write down the Maier-style matrix M_{ij} where i,j index "primes" ' +
    '(or prime powers) and entries are Montgomery pair-correlation ' +
    'integrals against a short-interval indicator. If the diagonal ' +
    'entries concentrate under Montgomery unconditional content, an ' +
    'extremal bound might fall out. Early indication: the required ' +
    'diagonal concentration IS the local-law statement ESY 2011, which ' +
    'is GUE universality — we are back to imp-486.',

  feasibility: 'LOW — surrogate dictionary (primes -> zeros) reintroduces ' +
               'either BDG obstacle or full GUE universality',
  verdict: 'LIKELY FAILS — circularity via divisor-function surrogate',
};

// ── Synthesis ─────────────────────────────────────────────────────────────

export const C_MB_ALTERNATIVE_ANGLES_EVAL = {
  id: 'imp-864+imp-865+imp-866',
  title: 'Scoping evaluation of three alternative unconditional C_mb angles',
  status: 'partial',
  closureLevel: 'evaluation-scoping',

  context:
    'imp-486 ruled out Selberg / Huxley / GGM. imp-856 scoped three hybrid ' +
    'rescues (Selberg+Huxley hybrid, partial-GUE, interval-arithmetic ' +
    'certification). This file adds three further independent angles ' +
    'suggested in Phase 51 planning.',

  approaches: {
    vinogradov:          C1_VINOGRADOV_MEAN_VALUE,
    bourgainBondarenkoSeip: C2_BBS_ZERO_DENSITY,
    maierMatrix:         C3_MAIER_MATRIX,
  },

  verdict:
    'All three alternative angles LIKELY FAIL, by three distinct mechanisms: ' +
    '(C1) shape mismatch between Cauchy sum and BDG input; (C2) orthogonality ' +
    'between off-line density and on-line spacing (same as Huxley); (C3) ' +
    'circularity via the surrogate dictionary primes -> zeros, which ' +
    'reintroduces either BDG obstacle or full GUE universality.',

  conclusion:
    'The unconditional-C_mb landscape is now mapped across 6 independent ' +
    'approaches: imp-486 (Selberg, Huxley, GGM), imp-856 (Selberg+Huxley ' +
    'hybrid, partial-GUE, interval-arithmetic cert), and this module ' +
    '(imp-864/865/866: BDG, BBS, Maier). The ONLY approach with finite ' +
    'positive probability of success remains (imp-856 approach c): ' +
    'interval-arithmetic certification on a finite-N range. imp-486 ' +
    'irreducibility result stands after this evaluation.',

  nextTicket:
    'imp-857 interval-arithmetic certification (already partially closed ' +
    'at N in {50,100,200,500}; extend to N in {1000,...,10000} under the ' +
    'named sub-gap imp-857-sub-scale-to-N10k).',
};

export const C_MB_ALTERNATIVE_ANGLES_EVAL_ASSERTIONS = [
  {
    id: 'imp864-865-866-three-approaches-evaluated',
    holds: () => Object.keys(C_MB_ALTERNATIVE_ANGLES_EVAL.approaches).length === 3,
    why:
      'Three alternative angles (Vinogradov/BBS/Maier) must be evaluated. ' +
      'A drop below three means the file scope regressed.',
  },
  {
    id: 'imp864-865-866-status-partial',
    holds: () => C_MB_ALTERNATIVE_ANGLES_EVAL.status === 'partial',
    why:
      'This is a scoping evaluation, not a closure. The partial status ' +
      'must persist until one of the three approaches actually produces a ' +
      'finite-K theorem (none expected per the verdicts).',
  },
  {
    id: 'imp864-865-866-next-ticket-named',
    holds: () => typeof C_MB_ALTERNATIVE_ANGLES_EVAL.nextTicket === 'string',
    why:
      'The evaluation must name the surviving follow-up (imp-857 interval-' +
      'arithmetic cert). Without a named next ticket, the scoping is not ' +
      'actionable.',
  },
];
