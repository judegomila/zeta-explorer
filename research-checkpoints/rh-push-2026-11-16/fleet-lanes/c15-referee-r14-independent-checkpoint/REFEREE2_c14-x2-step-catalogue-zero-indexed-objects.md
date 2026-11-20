# REFEREE2: c14-x2-step-catalogue-zero-indexed-objects

Independent referee, 2026-11-19; verdicts formed before the lane's REFEREE.md was opened. Not a statement about
zeros of zeta beyond the classical fact zeta(1 + it) != 0.

## Verdict: HOLDS WITH SCOPE LINE

Scope line (exact): "Lemma T is proved for primitive even characters chi != 1 (for odd chi the gamma factor is
Gamma_R(s + l + 1) and the difference P - beta_0 is 2, with no forced vanishing at -l); consequence T1 speaks of
real w and needs a real minimising weight, which holds for r = r_0 x conj(r_0)~. The catalogue is twelve entries
read from one opened survey and from memory; 'the list is empty inside the strip' is a statement about those
twelve entries and three objects."

## Lemma T (PROVED): holds

(i) Euler factors agree: the eigenvalues of r on diag(p^(-lambda_i)) are p^(-l_mu). (ii) At s = 1 - l_mu0 the
minimising factor has a pole; every other factor is zeta at an argument of real part >= 1, finite and non-zero
unless it is again the pole (uses zeta(1 + it) != 0); absolute convergence iff Re(s + l_mu) > 1 for all mu.
(iii) Gamma_R(s + l_mu) has its rightmost pole at s = -l_mu; L(0, chi) = 0 for chi even primitive non-principal;
the other factors are entire. At p with chi(p) = 1 the inverse local factor vanishes at s = -l_mu0 + 2 pi i k/log p.
(iv) (1 - m) - (-m) = 1.
Check (`ref2_checks.json` item5), an identity independent of the lemma's wording: for lambda = (nu, -nu),
nu = 0.15 + 7i, r = std x conj(std)~, chi the real even character mod 5, s = 3:
sum_n abs(tau_nu(n))^2 chi(n) n^(-s) against prod_mu L(s + l_mu, chi) / L(2s, chi^2), weights l_mu = +-0.3, +-14i:
difference 3.7e-9 at 2,000 terms and 3.0e-12 at 20,000 terms (value 0.98792357762). L(0, chi) = 5e-35 for the
even character mod 5 and 0.5 for the odd character mod 4, which is why the scope line says "even".

## Proposition E (PROVED from classical inputs): holds

(a) Re u_0 = 1: xi(u_0 - 1) = xi(2 - u_0) = xi(conj u_0), so both constant-term coefficients vanish;
conj(u_0)/2 = 1 - u_0/2, so f is real by E*(z, s) = E*(z, 1 - s); unfolding against E*(z, s) for Re s > 1 gives
0, continuation to s = u_0/2 gives the integral of f^2 = 0; the first Fourier coefficient
2 y^(1/2) K_(u_0/2 - 1/2)(2 pi y) is not identically zero. This is the classical argument; every step checked.
(b) 0 < Re u_0 < 1: 1 < Re(2 - u_0) < 2, xi(2 - u_0) != 0. (c) as stated.
Check (item5, 20 and 40 digits): abs(xi(2 - rho)) = abs(xi(rho - 1)) = 1.4227e-5, 8.5768e-8, 4.3784e-9 at the first
three zeros, unchanged between the two precisions, while abs(xi(rho)) falls from 1e-25..1e-29 to 1e-46..1e-49;
abs(xi(1 + 2it)) = abs(xi(2it)) = 6.7608e-6 at t = 7.3.

## Source check of the recalled attributions (generic search terms only)

| entry | what was opened | outcome |
|---|---|---|
| E12 (Iwaniec 1987, Duke 1988) | Duke, Invent. Math. 92 (1988), pages 73 to 74 (PDF read) | Iwaniec's bound as quoted there: holomorphic cusp forms of weight k = 1/2 + l on Gamma_0(N), 4 | N, "for k >= 5/2 and n square-free a(n) << n^(k/2 - 2/7 + eps)"; "the exponent k/2 - 1/4 cannot be reduced if F(z) comes from the subspace spanned by theta functions when k = 3/2"; Duke's Theorem 5 is the analogue for non-holomorphic forms of weight 1/2. The lane's entry is consistent. Scope: Iwaniec's own statement is for k >= 5/2; the weight-3/2 case with theta-orthogonality is not stated on the pages read |
| E1 (Rankin 1939, Selberg 1940) | two seminar abstracts on the Rankin-Selberg problem | "the classical Rankin-Selberg method gives an error X^(3/5)" for the sum of squared normalised coefficients: consistent. Primaries not opened |
| E7 (Iwaniec-Sarnak) | secondary descriptions (introductions of later papers) | sup-norm bound with a power saving by amplification with Hecke operators: consistent; the lane states no exponent. Primary not opened |
| E8 (Rudnick-Sarnak; Bourgain-Lindenstrauss; Lindenstrauss; Soundararajan) | journal abstract (Annals 172, 2010) and survey descriptions | Soundararajan: no escape of mass for Hecke-Maass forms on the modular surface; Bourgain-Lindenstrauss: positive entropy of ergodic components: consistent. Proof steps not opened |
| E11 (Waldspurger; Kohnen-Zagier; Katok-Sarnak) | an abstract quoting Waldspurger's relation between c(D) and L(f, D, k); title of Kohnen-Zagier | relation confirmed in kind; the displayed formula and its constant were not seen |
| E10 (Jacquet-Shalika 1976; Sarnak 2004) | citation only (Invent. Math. 38 (1976) 1-16, through a 1980 note) | existence and subject confirmed; the argument is re-derived in Proposition E, so the entry does not depend on the source |
| E9 (Landau's lemma) | not searched | classical; unchanged |
| (Lemma A of the pair-design lane) Montgomery, Topics, Theorem 12.1 | two searches; book record only | not confirmed from a text; recalled twice |

Result: 1 of 7 opened in a primary-level text (E12), 4 confirmed at the level of abstracts or secondary
descriptions (E1, E7, E8, E11), 1 citation only (E10), 1 not searched (E9). No attribution was found to name a
wrong statement. The step attributions (which step uses the eigen-relation, which the functional equation) for
E7, E8, E11, E12 remain recalled: no proof was opened.

## Other points

- T4 (isobaric sums with cuspidal data) is ARGUED; the sentence "the non-Borel cell left open by c13 is closed for
  GL_n at the level of E1 to E6" must carry ARGUED.
- Section 5, O2 column: read through the shadow E(z, rho); the direct metaplectic treatment is in
  c14-theta-orthogonal-metaplectic-eigenobject (Lemma E there), which supports the O2 rows for E1, E2, E5 only.
- Row E4, "Hermitian for at most one prime": two primes would give p^(i gamma/2), q^(i gamma/2) both real, so
  gamma log p and gamma log q in 2 pi Z, log p/log q rational. Holds.

## Label restrictions

1. Lemma T: "chi even"; T1: "real minimising weight".
2. T4 and the closure of the non-Borel GL_n cell: ARGUED.
3. Catalogue: E12 "Iwaniec: k >= 5/2 (opened through Duke 1988); weight 3/2 recalled"; E1, E7, E8, E11 "confirmed
   at abstract level"; E9, E10 unchanged.
4. "The list is empty inside the strip": "among the twelve entries and three objects".

## Comparison with the lane's REFEREE.md (read afterwards)

Its corrections 4 (T1: "real w") and 5 (T4 argued) are the same as mine. Its corrections 1 to 3 I had not found;
I checked each on paper after reading them and agree:
1. POLE1 is defined as "rightmost pole at 1, simple", but for a torus object with all Re l_mu = 0 the weight 0 has
   multiplicity at least 2 (for std x conj(std)~ on (nu, -nu) with Re nu = 0 the weights are 0, 0, +-2i Im nu), so
   the pole at 1 is double. T3 must read "the position part of POLE1 is equivalent to the exponent-0 conclusion".
2. List L-c: by the lane's own hypothesis codes E2, E5, E6, E7, E11, E12 also need L2 or CUSP, which the shadow of
   O2 fails at beta = 1/2 as well (two non-zero constant-term coefficients). L-c is {E4}.
3. Row E9 / O1: at w = beta the product has two zeros (xi at rho and at conj rho) against the pole of
   xi(w + 1 - beta): a simple zero, not a double zero.
These three are added to the label restrictions (items 5 to 7 of the consolidated list for this lane). None
changes the verdict "no device". An independent pass that missed three of five corrections is a weaker pass on
this item than on the others; the catalogue table (section 5 of RESULT.md) was read once and not re-derived row
by row.
