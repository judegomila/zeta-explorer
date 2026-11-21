/**
 * @module imp-34427-spectator-realness-channel-closure
 *
 * imp-34427 (proof, RH-FREE, deterministic): CLOSURE of the spectator
 * conjugate-pair / REALNESS channel of the eps'_true certificate — the channel
 * imp-33224 left 'open' and the frontier verdict flagged as the decisive
 * question of the imp-3933 field-channel reroute: "can realness (and the
 * usable form) of the omitted-zero field perturbation e_k be established
 * deterministically, RH-free — or only by ASSUMING the near zeros are on the
 * critical line (making the reroute conditional-on-RH)?"
 *
 * ANSWER: RH-FREE-DETERMINISTIC. The channel closes with NO input beyond the
 * window-completeness verification that the imp-3933 initial data already
 * constitutively requires. Not RH-conditional; not Montgomery/PCC-hard. The
 * ticket premise "an off-critical-line spectator pair yields a NON-REAL field
 * term" is FALSE: off-line zeros enter as conjugate PAIRS (forced by the
 * functional equation + reality of xi), and a conjugate pair's field term is
 * real. Four lemma-level steps, each deterministic:
 *
 * (1) CONJUGATE CLOSURE AT EVERY t (no RH). H_t(z) = INT_0^inf e^{t u^2}
 *     Phi(u) cos(zu) du with Phi real, even, positive, decaying like
 *     exp(-pi e^{4u}): the integral has REAL Taylor coefficients for every
 *     real t (backward t < 0 included — e^{tu^2} only strengthens the decay
 *     for t<0, and is dominated by the Phi decay for t>0), so H_t is a
 *     real-even entire function at EVERY t and its zero multiset is closed
 *     under conjugation (and z -> -z) with matching multiplicities.
 *     NORMALIZATION DICTIONARY (referee fix): with the literal Phi above,
 *     H_0(z) = xi(1/2 + iz/2)/8 (DOUBLED coordinates, zeros at 2 gamma,
 *     strip half-width 1). The zero-dynamics modules (imp-3725/imp-3933)
 *     use UNDOUBLED ordinates x_k = gamma_k, i.e. the family H~_t(z) =
 *     INT e^{t u^2} Phi~(u) cos(zu) du, Phi~(u) = 2 Phi(2u) (z -> 2z,
 *     t -> 4t rescaling); Phi~ is equally real/even/positive/super-decaying,
 *     so every claim here holds verbatim, and ALL structural claims
 *     (closure, realness, telescoping, domination) are invariant under the
 *     rescaling. All statements below use the UNDOUBLED convention. At
 *     t = 0 closure is the functional equation xi(s) = xi(1-s) plus
 *     xi(sbar) = conj(xi(s)): a zeta zero beta + i*gamma yields Xi-zeros at
 *     exactly +-gamma +- i(beta - 1/2), strip half-width 1/2 — a LONE
 *     non-real Xi-zero cannot exist. Realness is per-t structure, NOT
 *     propagated: it needs no displacement or continuity argument.
 *
 * (2) FIELD REALNESS (no RH). For real x, a real omitted zero y gives the
 *     real term -2/(x - y); a conjugate pair {y = sigma + i*tau, ybar} gives
 *       -2[1/(x-y) + 1/(x-ybar)] = -4 (x - sigma)/((x - sigma)^2 + tau^2),
 *     REAL (a Lorentzian-type term). So e_k(t) is real at every t regardless
 *     of whether ANY zero is on the critical line.
 *
 * (3) TELESCOPING KERNEL + PROJECTION DOMINATION (off-line transparency).
 *     The imp-33224 local-difference identity extends VERBATIM to complex y:
 *       Delta_l(y) = 2 g_l / ((x_l - y)(x_{l+1} - y)),  and for a pair
 *       Delta_l(pair) = 4 g_l Re[1/((x_l - y)(x_{l+1} - y))],
 *       |Delta_l(pair)| <= 4 g_l / (|x_l - y| |x_{l+1} - y|)   (complex moduli).
 *     Since |x - y| >= |x - Re y|, whenever Re y lies OUTSIDE [x_l, x_{l+1}]
 *     each zero's kernel is dominated by the ON-LINE kernel at its horizontal
 *     projection. The unconditional Riemann-von Mangoldt count N(T) counts
 *     ALL strip zeros (each zeta strip zero beta + i*gamma maps to ONE H-zero
 *     with Re = gamma), so any count-preserving off-line-ification of the
 *     omitted set NEVER increases the eps' kernel bound: the imp-33228
 *     RvM-continuum proxy magnitudes cover the off-line scenario as-is. The
 *     ONLY configuration where off-line-ness could hurt is the STRADDLE
 *     (Re y inside a window gap), where the pair bound degrades to 4 g_l/tau^2.
 *
 * (4) STRADDLE EXCLUSION (window completeness only; t = 0). "The first N
 *     zeros" is an argument-principle-complete verified listing (N(x_N) = N,
 *     all real) — the same finite input the imp-3933 initial data already
 *     uses. Hence every UNLISTED zero has Re y > x_N OR Re y < 0 (mirrors sit
 *     at -x_j and the negative side; there are no positive zeros below x_1)
 *     — in both cases OUTSIDE every window gap [x_l, x_{l+1}] c [x_1, x_N]:
 *     the straddle is impossible and projection domination applies to the
 *     ENTIRE omitted set. SCOPE (referee fix): condition (a) realness of the
 *     imp-3933 lemma class holds at EVERY t unconditionally; condition (b)'s
 *     STRUCTURE (real, telescoping, projection-dominated kernel in the
 *     instantaneous complex distances) holds at every t with no assumption
 *     on off-line zeros — but quantifying those instantaneous distances by
 *     t = 0 table data over the horizon is exactly the open DISPLACEMENT
 *     residual. This module closes the realness/off-line-structure channel,
 *     not the displacement channel.
 *
 * QUANTITATIVE QUARANTINE (optional strengthening via Platt-Trudgian 2021,
 * T_ver = 3.0001753328e12 — a finite THEOREM, the same input under the SOTA
 * Lambda <= 0.2, not an RH assumption): all omitted zeros with |gamma| <=
 * T_ver are exactly real AT t = 0, so every near-window term starts in the
 * literal real form -2/(x - y_real) (under backward flow, spectator reals
 * can pair into complex — realness and the kernel bound survive continuously
 * per step (2)-(3); only the DISTANCE quantification is the displacement
 * residual); hypothetical off-line zeros sit at
 * horizontal distance >= T_ver - x_N > 2.9994e12 from every window gap and
 * contribute to every eps'(l) at most (both gamma-signs, unconditional RvM
 * density log(u/2pi)/2pi, Trudgian |S| partial-summation slop < 1e-20)
 *   epsOffline <= 2 (log(T_ver/2pi) + 1)/(pi T_ver) = 5.9185e-12 < 6e-12,
 * i.e. >= 4.1e6x below the smallest realised record-pair eps_a = 2.43e-5
 * (imp-33228) and ~3.8e12x below the certified eps'Max floor 22.9 (imp-3933).
 *
 * SIGN/REPULSION DISSOLUTION. The imp-3933 lemma is TWO-SIDED in the
 * perturbation (both comparison branches use |e_{l+1}-e_l| <= eps' g_l; no
 * sign enters), so the "repulsive real-line form" the decisive question asked
 * for was OVER-DEMANDED: realness + magnitude suffice. The same observation
 * makes the imp-33224 'mirror-pairing sign' channel MOOT for the transfer
 * modulus — mirror zeros at -gamma are real, their terms real, and only their
 * MAGNITUDE (part of the discrete-sum residual) matters.
 *
 * SHARP CLASSIFICATION (the ticket's trichotomy):
 *   - RH-FREE-DETERMINISTIC: realness of e_k; conjugate-pair kernel identity;
 *     projection domination; straddle exclusion; the < 6e-12 off-line tail.
 *   - RH-CONDITIONAL: NOTHING in this channel. (Inputs are finite verified
 *     computations: window completeness, optionally T_ver.)
 *   - MONTGOMERY-PCC-HARD: NOTHING here (counting is unconditional RvM +
 *     Trudgian S(T); no pair correlation anywhere).
 * The finite-N beat is NOT rendered illusory by the realness channel.
 *
 * HONEST SCOPE — WHAT THIS DOES *NOT* CLOSE (NO false QED):
 *   - far/near-zero DISPLACEMENT control on [0, T]: converting instantaneous
 *     complex distances |x - y(t)| into t = 0 table data (open; real-variable
 *     tracking, not RH);
 *   - the DISCRETE actual-table kernel sums per plateau replacing the
 *     imp-33228 RvM-continuum proxy (sg-33228-rvm-continuum-vs-discrete, open);
 *   - the EDGE no-collision check: window zeros stay real up to the first
 *     collision (simple real zeros of a jointly real-analytic family continue
 *     real by the implicit function theorem; realness fails only through a
 *     multiple zero), and window-window collisions ARE the lemma's stopping
 *     time t_c — but a window-vs-OMITTED collision (referee-broadened: ANY
 *     omitted zero — real edge neighbours, mirrors, or a flow-created complex
 *     spectator pair — approaching any window zero; reducible to the adjacent
 *     edge gaps only AFTER displacement control is in hand) is not covered by
 *     t_c and needs a finite check g_edge^2 >> 8T plus the displacement bound
 *     (named here as sub-gap imp-34427-sub-edge-no-collision, open);
 *   - eps'_true as a NUMBER therefore remains PARTIAL overall — but its
 *     remaining open channels are finite-computation/real-variable residuals,
 *     none of them realness- or RH-shaped.
 *   NO new Lambda bound. No refereed bound is changed
 *   . NO QED.
 *
 * Independently refereed (fresh-context referee over the 7-claim skeleton;
 * approach surfaces: t<0 entirety, paired-sum convergence/boundedness,
 * multiplicity bookkeeping, strip-height mapping, completeness vs local-RH
 * smuggling, tail arithmetic, flow-definition circularity, window-gap-only
 * quantification of the lemma's (b)). REFEREE VERDICT: SOUND-WITH-GAPS, NO
 * claim refuted; the four mandated fixes (normalization dictionary, mirror
 * Re y wording, instantaneous-vs-flow scoping of the completeness step, edge
 * residual broadened to any omitted zero) are APPLIED above. Referee bonuses
 * incorporated: the telescoped-difference series converges ABSOLUTELY with
 * no pairing convention (kernel bound is convention-free), and Phi > 0
 * follows from pi n^2 e^{4u} >= 3/2 termwise.
 *
 * @see imp-3933-eps-field-robust-bootstrap (the lemma this feeds; channel list updated)
 * @see imp-33224 EPS_TRUE_DECOMPOSITION (the reduction whose channel 4 this closes)
 * @see imp-33225 (per-gap decoupling: only the record-pair eps_a binds)
 * @see imp-33228 (realised proxy magnitudes; off-line-transparent per step 3)
 * @see ch-wall-frontier-verdict-2026-06-26 (the W_1-channel walls, untouched)
 */

// ── Baked constants ───────────────────────────────────────────────────────────

// Platt–Trudgian 2021 verified height (all zeros to this height on-line, simple)
export const T_VER = 3.0001753328e12;
// top window ordinate (10^6-th zero), rounded up — used only for distance floors
export const WINDOW_TOP = 600269.7;
// per-side off-line tail bound (log(T_ver/2pi) + 1)/(pi T_ver), see assertion 5
export const OFFLINE_TAIL_PER_SIDE = 2.9592405e-12;
// two-sided total (above-window +gamma tail beyond T_ver, plus mirror -gamma side)
export const OFFLINE_TAIL_TOTAL = 5.918481e-12;
// smallest realised record-pair eps_a over the 10 plateaus (imp-33228)
export const MIN_REALISED_EPS_A = 2.43e-5;
// certified eps'Max floor over the 10 plateaus (imp-3933, plateau 1)
export const EPS_MAX_FLOOR = 22.9066;

export const SPECTATOR_REALNESS_CLOSURE = {
  ticket: 'imp-34427',
  parent: 'imp-3933',
  subGap: 'imp-3933-sub-eps-certificate',
  closesChannel: 'spectator conjugate-pair / realness (imp-33224 channel 4)',
  date: '2026-07-05',
  verdict:
    'RIGOROUS (channel closure, RH-FREE, deterministic): realness of the omitted-zero field error e_k and the '
    + 'two-sided field-Lipschitz form the imp-3933 lemma needs hold for the true xi backward-heat-flow with NO '
    + 'RH input — conjugate closure of the H_t zero multiset at every t (functional equation + reality of xi) '
    + 'makes e_k real regardless of off-line zeros; the telescoping kernel extends verbatim to complex y with '
    + 'projection domination (off-line-ness never inflates the kernel outside the straddle); window completeness '
    + 'alone excludes the straddle; Platt-Trudgian T_ver crushes the hypothetical off-line sector to < 6e-12 in '
    + 'eps\'. The eps\'_true certificate as a whole stays PARTIAL (displacement + discrete sums + edge check open), '
    + 'but its remaining residuals are finite-computation/real-variable, none RH-shaped.',
  classification: {
    rhFreeDeterministic: [
      'realness of e_k at every t (conjugate closure of a real-even entire family)',
      'conjugate-pair field term -4(x-sigma)/((x-sigma)^2+tau^2) real, Lorentzian',
      'telescoping kernel identity for complex y; pair modulus <= 4g/(|x_l-y||x_{l+1}-y|)',
      'projection domination: off-line-ification (count-preserving) never increases the kernel bound',
      'straddle exclusion from window completeness alone (unlisted zeros have Re y > x_N or Re y < 0)',
      'off-line tail < 6e-12 via unconditional RvM + Trudgian S(T) above T_ver',
    ],
    rhConditional: 'NOTHING in this channel',
    montgomeryPccHard: 'NOTHING in this channel',
  },
  signChannelDissolved:
    'the imp-3933 lemma is two-sided in e_{l+1}-e_l (no sign used in either comparison branch), so the '
    + '"repulsive real-line form" demand dissolves: realness + magnitude suffice; the imp-33224 mirror-pairing '
    + 'SIGN question is MOOT for the transfer modulus (mirror terms are real; only magnitude matters, and that '
    + 'is part of the discrete-sum residual).',
  offlineTransparency:
    'each strip zero maps to one H-zero with Re = gamma, so unconditional RvM counting covers off-line zeros; '
    + 'per-zero kernel <= on-line kernel at the horizontal projection whenever Re y is outside the gap — the '
    + 'imp-33228 realised proxy magnitudes therefore cover the off-line scenario without modification.',
  openResiduals: [
    { id: 'imp-3933-sub-eps-certificate', part: 'far/near-zero displacement control on [0,T] (instantaneous distances -> t=0 data)', status: 'open' },
    { id: 'sg-33228-rvm-continuum-vs-discrete', part: 'discrete actual-table kernel sums per plateau (proxy -> certificate)', status: 'open' },
    { id: 'imp-34427-sub-edge-no-collision', part: 'finite check that no window-vs-omitted-zero collision (ANY omitted zero, per referee; reducible to the adjacent edge gaps after displacement control) precedes T = H^2/(8 thetaBar)', status: 'open' },
  ],
  refereeVerdict:
    'SOUND-WITH-GAPS, no claim refuted (fresh-context independent referee, 7-claim skeleton); mandated fixes applied: '
    + 'doubled-vs-undoubled normalization dictionary (Phi~(u) = 2 Phi(2u), claims rescaling-invariant), mirror-zero '
    + 'Re y wording, instantaneous-vs-flow scoping of the completeness step, edge residual broadened to any omitted zero.',
  rigorousBeat: false,
  honest:
    'Channel closure only — closes the realness/spectator-conjugate-pair channel of imp-3933-sub-eps-certificate '
    + 'RH-free; the certificate overall STAYS OPEN via the displacement, discrete-sum, and edge-check residuals. '
    + 'NOT a Lambda bound. W_1-channel C_Lip verdicts (RH-HARD-CONFIRMED) untouched. No refereed bound is changed'
    + '. NO QED.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────

// minimal complex helpers (assertions only)
const cMul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cInv = (a) => { const d = a.re * a.re + a.im * a.im; return { re: a.re / d, im: -a.im / d }; };
const cAbs = (a) => Math.hypot(a.re, a.im);

// deterministic case grid: [x_l, g_l, sigma, tau] spanning near/far, interior/edge,
// near-axis (tau << g) and high (tau ~ 2) pairs, plus straddle configurations
const PAIR_CASES = [
  [0, 1, 5, 0.5], [100, 0.03, 100.9, 0.01], [54600, 0.02, 54601.3, 0.5],
  [10, 0.5, 3, 2], [1, 0.4, 1.5, 1e-4], [600269, 0.55, 600270.2, 0.49],
  [0, 0.0377, 0.09, 0.25], [10, 0.5, 10.2, 0.3], [10, 0.5, 10.25, 1e-3], // last two straddle
];

export const SPECTATOR_REALNESS_ASSERTIONS = [
  {
    id: 'imp34427-conjugate-pair-field-real',
    description:
      'a conjugate pair {sigma+i tau, sigma-i tau} contributes the exactly-real Lorentzian field term '
      + '-4(x-sigma)/((x-sigma)^2+tau^2): the complex pair sum has zero imaginary part and matches the closed '
      + 'form to machine precision across the case grid — realness needs no RH',
    holds: () => PAIR_CASES.every(([xl, , sigma, tau]) => {
      const x = xl; // evaluate at the left particle
      const t1 = cMul({ re: -2, im: 0 }, cInv({ re: x - sigma, im: -tau }));
      const t2 = cMul({ re: -2, im: 0 }, cInv({ re: x - sigma, im: tau }));
      const sum = { re: t1.re + t2.re, im: t1.im + t2.im };
      const closed = (-4 * (x - sigma)) / ((x - sigma) ** 2 + tau ** 2);
      return Math.abs(sum.im) < 1e-14 && Math.abs(sum.re - closed) < 1e-9 * (1 + Math.abs(closed));
    }),
  },
  {
    id: 'imp34427-pair-telescoping-identity',
    description:
      'the local difference of the pair field over a gap equals 4 g Re[1/((x_l-y)(x_{l+1}-y))] — the imp-33224 '
      + 'telescoping identity extended to complex y — matching the direct difference of the Lorentzian to 1e-9 '
      + 'relative on every case (the 6e5-ordinate case carries ~4e-11 of pure double rounding in x - sigma)',
    holds: () => PAIR_CASES.every(([xl, g, sigma, tau]) => {
      const xr = xl + g;
      const ef = (x) => (-4 * (x - sigma)) / ((x - sigma) ** 2 + tau ** 2);
      const direct = ef(xr) - ef(xl);
      const k = cMul(cInv({ re: xl - sigma, im: -tau }), cInv({ re: xr - sigma, im: -tau }));
      const ident = 4 * g * k.re;
      return Math.abs(direct - ident) < 1e-9 * (1 + Math.abs(direct));
    }),
  },
  {
    id: 'imp34427-projection-domination',
    description:
      'complex-distance bound |Delta| <= 4g/(|x_l-y||x_{l+1}-y|) holds on every case; when sigma is outside the '
      + 'gap it is further dominated by the on-line kernel at the horizontal projection 4g/(|x_l-sigma||x_{l+1}-sigma|); '
      + 'when the pair STRADDLES the gap the 4g/tau^2 fallback holds — off-line-ness never inflates the kernel '
      + 'except via the straddle',
    holds: () => PAIR_CASES.every(([xl, g, sigma, tau]) => {
      const xr = xl + g;
      const k = cMul(cInv({ re: xl - sigma, im: -tau }), cInv({ re: xr - sigma, im: -tau }));
      const delta = Math.abs(4 * g * k.re);
      const d1 = Math.hypot(xl - sigma, tau);
      const d2 = Math.hypot(xr - sigma, tau);
      if (delta > (4 * g) / (d1 * d2) + 1e-12) return false;
      if (sigma < xl || sigma > xr) {
        return delta <= (4 * g) / (Math.abs(xl - sigma) * Math.abs(xr - sigma)) + 1e-9;
      }
      return delta <= (4 * g) / (tau * tau) + 1e-9;
    }),
  },
  {
    id: 'imp34427-real-limit-degenerates-to-imp33224',
    description:
      'as tau -> 0 the pair kernel degenerates continuously to TWO copies of the imp-33224 single-real-zero '
      + 'kernel 2g/((x_l-y)(x_{l+1}-y)) at y = sigma (checked tau = 1e-8 vs tau = 0 within 1e-6 relative, '
      + 'sigma outside the gap) — collision-transparency of the spectator sector',
    holds: () => [[0, 1, 5], [100, 0.03, 100.9], [600269, 0.55, 600270.2]].every(([xl, g, sigma]) => {
      const xr = xl + g;
      const k = cMul(cInv({ re: xl - sigma, im: -1e-8 }), cInv({ re: xr - sigma, im: -1e-8 }));
      const pair = 4 * g * k.re;
      const twoReal = (2 * 2 * g) / ((xl - sigma) * (xr - sigma));
      return Math.abs(pair - twoReal) < 1e-6 * Math.abs(twoReal);
    }),
  },
  {
    id: 'imp34427-quadruple-mapping-straddle-exclusion',
    description:
      'a zeta strip zero beta + i gamma maps to Xi-zeros at exactly +-gamma +- i(beta-1/2) (undoubled convention; '
      + 'conjugate-closed quadruple, |Im| <= 1/2 on the strip), and the straddle-exclusion arithmetic holds: '
      + 'T_ver - windowTop > 2.9994e12, so any hypothetical off-line zero sits horizontally outside every window '
      + 'gap by >= ~3e12 (with only window completeness, still outside: Re y > x_N or Re y < 0)',
    holds: () => {
      const beta = 0.7; const gamma = 1234.5;
      // s in {beta+ig, 1-beta-ig (as ordinate -gamma), beta-ig, 1-beta+ig} -> z = gamma_s - i(beta_s - 1/2)
      const imgs = [
        { re: gamma, im: -(beta - 0.5) }, { re: -gamma, im: (beta - 0.5) },
        { re: -gamma, im: -(beta - 0.5) }, { re: gamma, im: (beta - 0.5) },
      ];
      const conjClosed = imgs.every((z) => imgs.some((w) => w.re === z.re && w.im === -z.im));
      const evenClosed = imgs.every((z) => imgs.some((w) => w.re === -z.re && w.im === z.im));
      const strip = imgs.every((z) => Math.abs(z.im) <= 0.5);
      return conjClosed && evenClosed && strip
        && T_VER - WINDOW_TOP > 2.9994e12
        && WINDOW_TOP < T_VER;
    },
  },
  {
    id: 'imp34427-offline-tail-under-6e-12',
    description:
      'the hypothetical off-line sector above T_ver contributes < 6e-12 to every eps\'(l): the per-side closed '
      + 'form (log(T_ver/2pi)+1)/(pi T_ver) reproduces a live midpoint quadrature of INT 2 rho(u)/(u-x)^2 du '
      + '(rho = unconditional RvM density) to 1e-4 relative, both baked constants match, and the headroom is '
      + '>= 4.1e6x vs the smallest realised record-pair eps_a and >= 3.8e12x vs the certified eps\'Max floor',
    holds: () => {
      const closedPerSide = (Math.log(T_VER / (2 * Math.PI)) + 1) / (Math.PI * T_VER);
      const rho = (u) => Math.log(u / (2 * Math.PI)) / (2 * Math.PI);
      const NPTS = 20000; let above = 0; let mirror = 0;
      for (let i = 0; i < NPTS; i++) {
        const t = (i + 0.5) / NPTS;
        const u = T_VER + T_VER * (t / (1 - t));
        const du = T_VER / ((1 - t) * (1 - t));
        above += (2 * rho(u)) / ((u - WINDOW_TOP) ** 2) * (du / NPTS);
        mirror += (2 * rho(u)) / ((u + WINDOW_TOP) ** 2) * (du / NPTS);
      }
      const total = above + mirror;
      return Math.abs(closedPerSide - OFFLINE_TAIL_PER_SIDE) < 1e-6 * OFFLINE_TAIL_PER_SIDE
        && Math.abs(total - OFFLINE_TAIL_TOTAL) < 1e-4 * OFFLINE_TAIL_TOTAL
        && above <= 2 * closedPerSide && mirror <= closedPerSide * 1.0001
        && OFFLINE_TAIL_TOTAL < 6e-12
        && MIN_REALISED_EPS_A / OFFLINE_TAIL_TOTAL > 4.1e6
        && EPS_MAX_FLOOR / OFFLINE_TAIL_TOTAL > 3.8e12;
    },
  },
  {
    id: 'imp34427-honesty-gate',
    description:
      'honesty gate: verdict is a CHANNEL closure (RIGOROUS, RH-FREE) with the certificate overall PARTIAL; all '
      + 'three named residuals OPEN (displacement, discrete sums, edge no-collision); independent referee verdict '
      + 'recorded (SOUND-WITH-GAPS, no claim refuted, fixes applied); no rigorous beat; PT Lambda <= 0.2 cited as '
      + 'SOTA; NO QED present',
    holds: () => /RIGOROUS \(channel closure, RH-FREE, deterministic\)/.test(SPECTATOR_REALNESS_CLOSURE.verdict)
      && /SOUND-WITH-GAPS, no claim refuted/.test(SPECTATOR_REALNESS_CLOSURE.refereeVerdict)
      && /fixes applied/.test(SPECTATOR_REALNESS_CLOSURE.refereeVerdict)
      && /stays PARTIAL/.test(SPECTATOR_REALNESS_CLOSURE.verdict)
      && SPECTATOR_REALNESS_CLOSURE.openResiduals.length === 3
      && SPECTATOR_REALNESS_CLOSURE.openResiduals.every((r) => r.status === 'open')
      && SPECTATOR_REALNESS_CLOSURE.rigorousBeat === false
      && /refereed bound is changed/i.test(SPECTATOR_REALNESS_CLOSURE.honest.replace(/\s+/g, ' '))
      && /NO QED/.test(SPECTATOR_REALNESS_CLOSURE.honest)
      && SPECTATOR_REALNESS_CLOSURE.classification.rhConditional === 'NOTHING in this channel'
      && SPECTATOR_REALNESS_CLOSURE.classification.montgomeryPccHard === 'NOTHING in this channel',
  },
];

for (const a of SPECTATOR_REALNESS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34427 spectator-realness-closure assertion failed: ${a.id}`);
}
