# REFEREE2 (second referee) for `c8-hecke-entropy-resonance-rigidity`: the requested corrections

2026-11-18, lane `c9-repair-referee-debts-r8`. Written in this lane's directory; no file of the original lane was
edited. Read: RESULT.md, REFEREE.md, DEVICE_NODE.json, check.py. Script `ref2_hecke.py`, log `ref2_hecke.log` (mpmath
25 digits, one local run through `scripts/memcap.sh 8`, a few seconds, no arrays). No server use. No statement about
zeros of zeta is made or checked.

## Outcome

| requested correction (first referee) | this pass |
|---|---|
| 1. Withdraw Lemma G2 (i) and the DH row | **holds** (the object is identically zero; checked; an even non-trivial character gives a non-zero object, but it is real) |
| 2. Gamma-multiplicity in Lemma 3 | **holds, and is necessary**: with m as defined in RESULT.md the inequality is false (ratio 19.5 in one case); **Lemma 3 as written is broken** at the line "Let m be the largest number of pairs (p, j) ... whose images of B in Gamma\H contain a common point" |
| 3. Sign in Lemma 5 | **holds**: (a_s)_* m_sigma = e^(-(2 sigma - 1) s) m_sigma; the line "(a_s)_* m_sigma = e^((2 sigma - 1) s) m_sigma" of RESULT.md is **broken** (sign), with no effect on what is used |
| added line of Lemma G1; uniqueness in section 6 with two scalars | **holds** |
| the obstruction (Proposition 4, control EIS-w) | **holds** (classical properties of E; two referees) |

The corrected statement holds. Device node written (`engine/nodes/nodes-19.json`, `engine/curated/mk_devices.py`),
control EIS-w added (`engine/curated/controls.json`); see `engine/ENGINE_LOG.md`, last section.
No requirement flag changes: R1 = R2 = R3 = R4 = false.

## 1. Lemma G2 (i)

The characters mod 5 are chi^k, k = 0..3, chi(2) = i, and chi^k(-1) = (-1)^k. The two complex ones are odd. In
G_chi(z, w) = sum_{(c, d) = 1, 5 | c} chi(d) y^w/abs(cz + d)^(2w) the terms (c, d) and (-c, -d) cancel. Summing over
pairs modulo +-1 instead does not define a function (the summand changes sign with the representative). So no
weight-0 object exists for the complex pair, and the Davenport-Heilbronn combination has no model in this setting.
`ref2_hecke.log` (z = 0.13 + 0.9i, w = 1.7, abs(c), abs(d) <= 40): abs(sum) = 5.7e-27 for both complex characters
against a sum of absolute values 1.7486; trivial character 1.749, quadratic character 1.673 (not zero: the
construction is non-trivial exactly for the even characters, and the non-trivial even one is real, so
chi = conj(chi) and there is no two-term combination). **Withdrawal holds. DH: not run.**

## 2. Lemma 3

Folding step: int_B sum_{p, j} abs(f(g_{p,j} z))^2 dmu = sum_{p, j} int_{g_{p,j} B} abs(f)^2 dmu (isometries)
= int over Gamma\H of abs(f(q))^2 #{(p, j, gamma) : q~ in gamma g_{p,j} B} dmu(q). The count includes gamma. With
m_Gamma = sup_q of this count the proof goes through ((p + 1)/p <= 2; images below height p ht(z) <= P e^r ht(z0)
because min over non-zero integer rows of abs(cz + d)^2 is y/ht(z); abs(f) = abs(Lambda^Y f) below height Y).

Counter-case for the definition in RESULT.md (`ref2_hecke.log`, block 2): resonance w = 1 - rho_1/2 = 0.75 - 7.0674i,
Pr = {2}, B = B(i y0, 1/2). On B, f = y^w up to terms below exp(-2 pi y0 e^(-1/2)), and norm(Lambda^Y f)^2 =
Y^(2 sigma - 1)/(2 sigma - 1) exactly (Lemma 2). abs(tau_w(2))^2 = 0.2586.

| y0 | left side | 2 (p + 1) norm(Lambda^Y f)^2 | ratio | Gamma-multiplicity of the image under z -> 2z |
|---|---|---|---|---|
| 20 | 18.99 | 97.45 | 0.195 | about 42 |
| 200 | 600.4 | 308.2 | 1.948 | about 417 |
| 2000 | 18986 | 974.5 | 19.48 | about 4169 |

The number of pairs (p, j) is at most 3, so the inequality with the lane's m fails for y0 >= 200; analytically the
ratio is pi r^2 y0 (2 sigma - 1)/(2 (p + 1)) up to bounded factors, unbounded in y0. With m_Gamma (of order r y0 p
here) it holds. The consequence drawn in RESULT.md section 3 for balls in a fixed compact set is unaffected; the
statement about balls high in the cusp there already uses m >= min(p, 2 r y0).

## 3. Lemma 5

Test function g(y) = y^2 e^(-y), s = 0.7 (`ref2_hecke.log`, block 3): m_sigma(g o a_s)/m_sigma(g) = 0.869358, 0.704688,
0.571209 at sigma = 0.6, 0.75, 0.9, equal to e^(-(2 sigma - 1) s) to 12 digits (e^(+(2 sigma - 1) s) = 1.150, 1.419, 1.751).
T_3: ratio 2.621132336747, 3.333333333333, 4.410908542056 = 3^(2 sigma - 1/2) + 3^(1/2 - 2 sigma) to 12 digits.
The relation T_p nu_y = p^(-1/2)(nu_{py} + p nu_{y/p}) and the projection E(z, 2 sigma) dmu were re-derived by hand.
The measure is not zero (m_sigma(g) = Gamma(2 sigma + 1) > 0).

## 4. Lemma G1 and section 6

(ii): tau^eps_w(p0) - (p0^u + p0^(-u)) = (eps - 1)(p0^u - conj(eps) p0^(-u)), u = w - 1/2: algebra re-derived; numerically
equal for the Liouville twist at w = 0.75 + 3i, p0 = 2, 3, 5 (moduli 2.07, 4.11, 1.72: not zero). f_eps is not the
zero function: f_eps(0.3 + 0.8i) = -8.70e-4 - 1.19e-4 i (30 modes). Added line: if g = a y^w + b y^(1-w) + f_eps were
Gamma-invariant, T_{p0} g - tau^eps(p0) g = c (a y^w + b y^(1-w)), c != 0, would be Gamma-invariant, which forces
a = b = 0 (a y^w + b y^(1-w) is invariant under z -> -1/z only if it is 0, for w not in {0, 1/2, 1}: at fixed y the functions
1 - t^(-w) and 1 - t^(w-1) of t = abs(z)^2 are linearly independent); then (iii). **Holds.**
Section 6: T_p acts on the coefficients a(n) through abs(n), so there are two scalars; z -> -conj(z) normalises
Gamma, the odd part is a Gamma-invariant function with zero constant term and a non-real Laplace eigenvalue, hence 0
(for Im w != 0, Re w != 1/2). **Holds in that range.**

## 5. Corrected device statement

As written in `engine/nodes/nodes-19.json` (id `hecke-correspondence-recurrence`, status closed). In one paragraph:
the device reads Gamma-invariance, the joint Hecke eigen-relation, the Laplace equation, growth and truncated mass
of one function on PSL_2(Z)\H. At a resonance the truncated mass is Y^(2 sigma - 1)/(2 sigma - 1); the recurrence
inequality holds with m counted with Gamma-multiplicity and has P-exponent -1 for every sigma; the off-resonance
Eisenstein series (control EIS-w) satisfies every input, for every Re w' in (1/2, 1); the limit measures m_sigma are
N-invariant, A-conformal with factor e^(-(2 sigma - 1) s) and Hecke eigen-measures for every sigma > 1/2, so the
hypotheses of measure rigidity fail at sigma = 3/4 as well. U, THIN and sign twists fail at Gamma-invariance.
DH: not run. Not proved: that m_sigma is the limit of abs(E(z, sigma + it))^2 dmu.

## 6. Weakest points of this pass

1. The Maass-Selberg formula and the Hecke eigen-relation of E were used as classical facts (the first referee
   tested Maass-Selberg numerically; not repeated).
2. The counter-case of section 2 uses f = y^w on the ball; the exponentially small terms were bounded, not computed.
3. Statement 6 of the lane (the limit measure) was not examined; it stays argued and measured.
