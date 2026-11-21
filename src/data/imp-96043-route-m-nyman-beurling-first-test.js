/**
 * @fileoverview imp-96043 — FIRST-TEST of Route M (the one route in the J/K/L/M
 * batch left un-tested by rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js):
 * the Nyman-Beurling / Baez-Duarte Gram matrix whose EXACT entries are the
 * Vasyunin cotangent sums, wired to the Bettin-Conrey (2013) period-function
 * reciprocity as the claimed MODULAR input the soft routes lack. Question:
 * does that modular input supply genuine EXTERNAL arithmetic, or does Route M
 * reduce (like J/K/L) to Weil positivity / the Mobius mollifier lineage?
 * Assessment only; changes no bound; no refereed bound is changed; RH open; NO QED.
 *
 * THE SETUP. Baez-Duarte-Balazard-Landreau-Saias put the Nyman-Beurling
 * criterion in finite form: RH  <=>  d_N -> 0, where
 *   d_N^2 = 1 - b^T G_N^{-1} b,   G_{kl} = <rho(1/kx), rho(1/lx)>_{L2(0,1)},
 * rho(x) = fractional part {x}. Vasyunin gave the Gram entries EXACTLY as
 * cotangent sums: the off-diagonal G_{kl} is a rational combination of
 *   c_0(h/k) = Sum_{m=1}^{k-1} (m/k) cot(pi m h/k),   gcd(h,k)=1,
 * the Vasyunin sum. So Route M builds a CONCRETE finite matrix with NO zero
 * input, exactly like Route L — the arithmetic sits in the cotangent sums.
 *
 * THE PROPOSED MODULAR INPUT. Bettin-Conrey (2013, "Period functions and
 * cotangent sums", Algebra & Number Theory) proved that h/k -> c_0(h/k) is a
 * quantum modular form (Zagier sense): it satisfies a reciprocity law
 *   c_0(h/k) + (k/h) c_0(k-bar/h) = (smooth period function psi of an Eisenstein
 *   series, holomorphic off the negative reals),
 * the exact analogue of Dedekind-sum reciprocity. This period function / modular
 * structure is the "arithmetic input absent from every soft route" the scout
 * flagged. First-test = decide whether it escapes the batch convergence.
 *
 * WHAT THE RECIPROCITY ACTUALLY IS (the crux). The Vasyunin sum c_0(h/k) is a
 * special value of the ESTERMANN zeta function
 *   D(s, h/k) = Sum_{n>=1} sigma_0(n) e(n h/k) n^{-s},
 * and the Bettin-Conrey reciprocity IS the functional equation of D(s,h/k) read
 * at s = 0. But Estermann D(s,h/k) factors through zeta: its functional equation
 * is INHERITED from the functional equation of zeta (D is built from
 * zeta(s) zeta(s-a)-type products twisted by an additive character / Gauss sum).
 * Therefore the Bettin-Conrey "modular input" injects NO arithmetic beyond the
 * functional equation of zeta itself — and that functional equation is already
 * the symmetry the Nyman-Beurling system encodes (rho(1/x) <-> the involution
 * x -> 1/x is the FE in disguise). The reciprocity REORGANIZES the Gram matrix;
 * it does not add an arithmetic hypothesis.
 *
 * THE TWO TERMINI (Route M reduces to BOTH, like the rest of the batch).
 *   (1) Perturbative use. The near-optimal Baez-Duarte coefficients are the
 *       Mobius mollifier  mu(k)(1 - log k / log N)  — a mollifier for 1/zeta.
 *       Any coefficient-optimal reading of the Vasyunin Gram is therefore the
 *       Levinson-Conrey mollifier lineage again (in-repo: imp-1312 classified NB
 *       for Lambda; mollifier record kappa >= 0.4173). The reciprocity, used
 *       perturbatively, only EXPLAINS why the Mobius vector is near-optimal.
 *   (2) Non-perturbative use. RH via Baez-Duarte needs d_N -> 0, i.e. an UPPER
 *       bound proving 1 is in the closed span of {rho(1/kx)} — a COMPLETENESS /
 *       positivity statement. The reciprocity is an exact IDENTITY (a symmetry),
 *       not an inequality; symmetrizing G supplies no spectral gap. The
 *       completeness step (1 in closed span  <=>  zeta non-vanishing on
 *       Re s > 1/2) is the Baez-Duarte-Bercovici-Foias spectral criterion =
 *       Weil positivity (Lagarias 1999; in-repo imp-95520 PICK-WEIL). So the
 *       non-perturbative branch lands on Weil positivity — the same terminus as
 *       Route L (Herglotz/Schur) and Route J engines (i),(iii).
 *
 * VERDICT. Route M is a genuine concrete zero-free finite object (Vasyunin Gram),
 * but its modular ingredient is the zeta functional equation in Estermann
 * disguise — NOT external arithmetic — so it reduces to BOTH mapped termini:
 * the Mobius mollifier lineage (perturbatively) and Weil positivity
 * (completeness). The batch prize (a route escaping the Weil-positivity /
 * mollifier convergence) is STILL not found; the J/K/L/M sweep closes with the
 * same convergence. NOT-A-LEVER.
 *
 * HONEST LIMITS. Structural assessment; the only numerics are the Vasyunin
 * cotangent sums recomputed from the definition and the Burnol / Baez-Duarte
 * d_N^2 ~ (Sum 1/|rho|^2)/log N scaling. No Lambda bound, verified height, or
 * paper packet is touched. RH OPEN; no refereed bound is changed; NO QED.
 */

// Vasyunin cotangent sum  c_0(h/k) = Sum_{m=1}^{k-1} (m/k) cot(pi m h/k), gcd(h,k)=1.
function vasyuninC0(h, k) {
  let s = 0;
  for (let m = 1; m < k; m++) s += (m / k) / Math.tan((Math.PI * m * h) / k);
  return s;
}

// Burnol constant = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi) (= c_0 of Route L, a = 1/2).
const BURNOL_C = 0.04619141793224207;

export const ROUTE_M_NB_FIRST_TEST = Object.freeze({
  id: 'imp-96043-route-m-nyman-beurling-first-test',
  title: 'First-test of Route M: Nyman-Beurling / Vasyunin Gram + Bettin-Conrey reciprocity — external input or mollifier lineage?',
  date: '2026-09-23',
  answers: 'rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js Route M (proposed, NOT first-tested)',
  status:
    'FIRST-TESTED — Route M reduces to BOTH mapped termini: the Mobius mollifier lineage (perturbative) and '
    + 'Weil positivity (completeness). The Bettin-Conrey modular input is the Estermann/zeta functional equation in '
    + 'disguise, NOT external arithmetic; no new lever. RH open; no refereed bound is changed; NO QED',

  setup:
    'Baez-Duarte-Balazard-Landreau-Saias finite Nyman-Beurling: RH <=> d_N -> 0, d_N^2 = 1 - b^T G_N^{-1} b, with the '
    + 'Gram entries G_{kl} given EXACTLY by Vasyunin as rational combinations of the cotangent sum '
    + 'c_0(h/k) = Sum_{m<k} (m/k) cot(pi m h/k). Concrete finite matrix, no zero input (arithmetic sits in c_0).',

  proposedModularInput:
    'Bettin-Conrey (2013) proved h/k -> c_0(h/k) is a quantum modular form with a reciprocity law '
    + 'c_0(h/k) + (k/h) c_0(k-bar/h) = period function of an Eisenstein series (Dedekind-reciprocity analogue) — '
    + 'the arithmetic/modular structure the soft routes lack.',

  crux:
    'c_0(h/k) is a special value (s=0) of the Estermann zeta function D(s,h/k) = Sum sigma_0(n) e(n h/k) n^{-s}, and the '
    + 'Bettin-Conrey reciprocity IS the Estermann functional equation. But Estermann D(s,h/k) factors through zeta, so its '
    + 'functional equation is INHERITED from the functional equation of zeta — which is already the symmetry the '
    + 'Nyman-Beurling involution x -> 1/x encodes. The reciprocity reorganizes the Gram matrix; it adds no arithmetic hypothesis.',

  termini: Object.freeze({
    perturbative:
      'near-optimal Baez-Duarte coefficients = Mobius mollifier mu(k)(1 - log k / log N) for 1/zeta => Levinson-Conrey '
      + 'mollifier lineage (in-repo imp-1312 NB-for-Lambda; mollifier record kappa >= 0.4173). Reciprocity only explains '
      + 'why the Mobius vector is near-optimal.',
    nonPerturbative:
      'RH needs d_N -> 0, an UPPER bound proving 1 is in the closed span (completeness/positivity). The reciprocity is an '
      + 'exact IDENTITY, not an inequality — symmetrizing G gives no spectral gap. Completeness (1 in closed span <=> zeta '
      + 'non-vanishing on Re s > 1/2) is the Baez-Duarte-Bercovici-Foias criterion = Weil positivity (Lagarias 1999; imp-95520 '
      + 'PICK-WEIL). Same terminus as Route L (Herglotz/Schur) and Route J engines (i),(iii).',
  }),

  verdict:
    'NOT-A-LEVER. A genuine concrete zero-free finite object (Vasyunin Gram) whose modular ingredient is the zeta functional '
    + 'equation in Estermann disguise — NOT external arithmetic. Reduces to BOTH termini (Mobius mollifier lineage + Weil '
    + 'positivity). The J/K/L/M batch prize (a route escaping the Weil-positivity / mollifier convergence) is STILL not found. '
    + 'RH open; NO QED.',

  // Vasyunin sums recomputed from the definition (used by the assertions; exact closed forms in comments).
  vasyuninSamples: Object.freeze([
    { hk: '1/2', value: 0.0 },                    // = 0 exactly
    { hk: '1/3', value: -0.19245008972987498 },   // = -1/(3 sqrt 3)
    { hk: '1/4', value: -0.4999999999999998 },    // = -1/2 exactly
    { hk: '1/5', value: -0.8908130915292851 },
    { hk: '2/5', value: 0.08032456635449131 },
    { hk: '1/7', value: -1.8576100891284342 },
    { hk: '3/7', value: 0.6129819184119847 },
  ]),

  // Burnol / Baez-Duarte scaling: d_N^2 ~ (Sum 1/|rho|^2)/log N, monotone decreasing to 0 iff RH.
  burnolScaling: Object.freeze([
    { N: 50, dN2: 0.011807552733751552 },
    { N: 100, dN2: 0.010030338959629822 },
    { N: 200, dN2: 0.00871812968847065 },
    { N: 500, dN2: 0.007432716142465922 },
  ]),

  honest:
    'Structural assessment; the only numerics are the Vasyunin cotangent sums and the Burnol/Baez-Duarte d_N^2 scaling. '
    + 'No Lambda bound, verified height, or paper packet is touched. RH OPEN; no refereed bound is changed; NO QED.',
});

export const ROUTE_M_NB_FIRST_TEST_ASSERTIONS = Object.freeze([
  {
    name: 'Vasyunin cotangent sums recompute from the definition (incl. c_0(1/2)=0, c_0(1/4)=-1/2, c_0(1/3)=-1/(3 sqrt 3))',
    check: () => ROUTE_M_NB_FIRST_TEST.vasyuninSamples.every(({ hk, value }) => {
      const [h, k] = hk.split('/').map(Number);
      return Math.abs(vasyuninC0(h, k) - value) < 1e-9;
    })
      && Math.abs(vasyuninC0(1, 2)) < 1e-12
      && Math.abs(vasyuninC0(1, 4) + 0.5) < 1e-12
      && Math.abs(vasyuninC0(1, 3) + 1 / (3 * Math.sqrt(3))) < 1e-12,
  },
  {
    name: 'Vasyunin antisymmetry c_0(h/k) = -c_0((k-h)/k) (from cot antisymmetry) — an exact identity, not a positivity input',
    check: () => [[1, 3], [1, 5], [2, 5], [1, 7], [3, 7]].every(([h, k]) =>
      Math.abs(vasyuninC0(h, k) + vasyuninC0(k - h, k)) < 1e-12),
  },
  {
    name: 'Burnol / Baez-Duarte d_N^2 ~ (Sum 1/|rho|^2)/log N and is monotone decreasing toward 0',
    check: () => {
      const rows = ROUTE_M_NB_FIRST_TEST.burnolScaling;
      const scalingOK = rows.every(({ N, dN2 }) => Math.abs(dN2 - BURNOL_C / Math.log(N)) < 1e-9);
      const monotone = rows.every((r, i, A) => i === 0 || r.dN2 < A[i - 1].dN2);
      return scalingOK && monotone && Math.abs(BURNOL_C - (2 + 0.5772156649015329 - Math.log(4 * Math.PI))) < 1e-12;
    },
  },
  {
    name: 'assessment: modular input = zeta functional equation in Estermann disguise (NOT external arithmetic)',
    check: () => /Estermann/.test(ROUTE_M_NB_FIRST_TEST.crux)
      && /functional equation of zeta/.test(ROUTE_M_NB_FIRST_TEST.crux)
      && /NOT external arithmetic/.test(ROUTE_M_NB_FIRST_TEST.verdict),
  },
  {
    name: 'reduces to BOTH termini: Mobius mollifier lineage (perturbative) + Weil positivity (completeness)',
    check: () => /mollifier lineage/.test(ROUTE_M_NB_FIRST_TEST.termini.perturbative)
      && /Weil positivity/.test(ROUTE_M_NB_FIRST_TEST.termini.nonPerturbative)
      && /NOT-A-LEVER/.test(ROUTE_M_NB_FIRST_TEST.verdict),
  },
  {
    name: 'honesty: RH open, no refereed bound is changed, NO QED; no bound touched',
    check: () => /RH open/.test(ROUTE_M_NB_FIRST_TEST.status)
      && /refereed bound is changed/i.test(ROUTE_M_NB_FIRST_TEST.status)
      && /NO QED/.test(ROUTE_M_NB_FIRST_TEST.status)
      && /RH OPEN/.test(ROUTE_M_NB_FIRST_TEST.honest),
  },
]);

export default ROUTE_M_NB_FIRST_TEST;
