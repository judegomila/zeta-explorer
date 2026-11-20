# Corrected sentences of round 18 (register)

Written 2026-11-20 by lane `c20-repair-owed-record-r19-statement-o-v5` (campaign round 20, repair lane B). Source:
`push/c19-referee-r18-independent-sources/RESULT.md` section 3 (23 sentences to use, from the second referees of round-18 lanes 1, 2, 3, 4, 6,
the source search for Turan's theorem and the referee of W5c), with the corrections E1 to E5 of that lane's own referee
(`REFEREE.md`; the count 23 is confirmed there). Nothing here is a statement about zeros of zeta. No verdict of any lane
changes. The sentences are quoted from the source without change; labels are those of the source files.

Where the false or superseded sentence stands in a round-18 lane file, that file is not edited by this lane (the previous
record lane entered notes for display (A), Proposition D (c) and the parity clause); the sentence below is the one to quote,
and the last column names the place where the campaign record carries it. Paths are relative to `tmp/research-2026-11-16/`.

| # | lane | place | sentence to use | where the record carries it |
|---|---|---|---|---|
| 1 | U4 | Lemma GL (b) | "The inequalities hold for all g >= 0 and all non-negative cosine polynomials if and only if for every atom n the sequence k -> Re Lambda_k(n), extended evenly, is positive definite: Re Lambda_k(n) = integral of cos(k theta) d mu_n, mu_n >= 0." | row G44 (already in the row in substance, from the first referee's E1; unchanged) |
| 2 | U4 | map row and R1 line | "positive definiteness of k -> Re Lambda_k(n) atom by atom; no relation between primes is read." | row G44 (already present; unchanged); STRATEGY item 56 |
| 3 | U4 | Lemma V summaries | "a simple zero at distance delta from Re s = 1 can exceed the pole term in the 3-4-1 mechanism only if the mean log-length of the test is below log 2/delta (log(m a_1/a_0)/delta for order m)." | row G44 (sentence replaced by this lane) |
| 4 | U4 | Theorem T application (first referee) | "for the triple sigma + ikt, a lower bound with B locally bounded in (sigma, t) on a strip holds if and only if the strip is zero-free." | row G44 (added by this lane) |
| 5 | tz bridge | display (A) and step (b) | "-2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>, for a_1 = 1 and a_P != 0. D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta), with no further constant." | row P58 (first display already present, from the first referee's E1; the second display added to the row after the referee of this register, E8); correction notes of the previous record lane in the lane's RESULT.md |
| 6 | tz bridge | tail | "(u - 2 log abs(a_P))/(pi T) norm(h)^2 (1 + o(1)); the mean of Re beta is log abs(a_P)/u." | row P58 (tail completed and the mean added by this lane) |
| 7 | tz bridge | share of right zeros | "31 to 33 percent at P = 12 and 37 to 41 percent at P = 20 with certified complete lists (heights to 2400); 27 to 35 percent at P <= 8 (first referee)." | row P58 (added by this lane) |
| 8 | tz bridge | DH row | "holds for every Dirichlet series with a_1 = 1 and a_P != 0, with the constant -u." | row P58, defeated-by cell (sentence completed by this lane) |
| 9 | tz bridge | check status | "ball arithmetic at P = 12 and 20 with complete certified zero lists; float64 at P = 3 to 8." | row P58, status cell (added by this lane) |
| 10 | tz server | margins | "On 96 Fourier modes zeta's smallest eigenvalue has median 0.22 to 0.26 Lg at theta = 0.55 and 0.012 to 0.025 Lg at 0.85; on 192 modes with the same centres (8 windows, 1e6 to 1e12) it is 0.28 to 1.0 times the 96-mode value (median 0.75). The margin is a property of the window space and decreases with the number of modes." | row P58 (added by this lane) |
| 11 | tz server | Form C | "zeta fails Form C at M = 0 and M = 1 in 600 of 600 cells with a reflected atom on 96 modes (certified by the lane); in a 30-cell sample rerun with independent code the smallest eigenvalue is negative at 48, 96 and 192 modes in every cell, between -1.42 and -0.19 times Lg, and more negative with more modes." | row P58 (added by this lane) |
| 12 | tz server | deviation (iii) | "At (1e10, 0.75) the boundary integer 31622777 is prime and is included (`xtheta` rounds to the nearest integer at every boundary). In Form D its weight is below 1e-7; in Form C it enters with weight log n/sqrt n = 3.1e-3 and changes lam_min by up to 1.4e-3 (6e-5 relative). No sign changes." | row P58 (short form added by this lane); full sentence here |
| 13 | tz server | row (1e6, 0.85) of the Form C table | "40 of 40 at 96 modes; at 192 modes one of two sampled windows is negative at M = 0." | row P58 (added by this lane) |
| 14 | tz server | chains (first referee) | "on 96 modes, in a typical window, N(theta) at theta = 0.55 does not distinguish a chain from zeta at M = 0 or M = 1; the distinction appears as m grows and for theta >= 0.75." | row P58 (already present in substance: stops cell and defeated-by cell; unchanged) |
| 15 | D10 | odd number of real zeros | "b = (u - 1) g is the model of M_0 times (-Theta) for odd degree; the model of M_0 Theta is b = u (u - 1) g. One real zero a: b = (u - 1)(u + a): (1, 0) at a = 1/4, (0, 1) at a = 3/4; b = u (u - 1)(u + a): (1, 2) at a = 1/4, (2, 1) at a = 3/4, 11/20, 9/10." The sentence that c17's parity clause fails in the model is withdrawn until rerun with this b. | row D10 (parity paragraph of the previous record lane; the instances for b = (u - 1)(u + a) added by this lane) |
| 16 | D10 | Theorem Q | "computer-assisted; conclusion confirmed by a second implementation at 29 fresh interior points, factorisation at 12 fresh points; the grid computation itself was not repeated." | row D10 (added by this lane) |
| 17 | exact relation | poles | "a pole of order 4 at s = 1/2, and at every point 1/2 + 2 pi i k/log q where zeta does not vanish." | control row HQ2 (already present; unchanged) |
| 18 | exact relation | zeros | "for every eps > 0 the factor has no zero on the line; its zeros are at distance (2/log q) Re asinh((eps^(1/4)/2) e^(i pi/4)) from it, inside the open strip when that distance is below 1/2." | control row HQ2 (added by this lane); `engine/curated/controls.json`, code HQ2 |
| 19 | exact relation | headline (first referee) | "HQ2 is a twin with zeta's functional equation that is multiplicative in the ordinary sense. ZQ, NR-q and the Proposition W twin leave the class at integrality or support, before multiplicativity of integer coefficients is defined." | row X1 (already present; unchanged) |
| 20 | exact relation | Proposition D (c) (first referee) | "(a), (b) PROVED; non-closedness of INT and MULT in T_strip is CLASSICAL on the right half-strip with a target non-vanishing on the whole half-strip, and OPEN inside the functional-equation class." | row X1 (already present; unchanged); correction note of the previous record lane in the lane's RESULT.md |
| 21 | exact relation | Lemma Q consequence | "equal numbers of zeros and poles of R on the u-sphere; it places neither." | row X1 (already present; unchanged) |
| 22 | sources | Corollary T' and row Q31 | "relative to Turan's second main theorem in the form of Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3 (factor 2 and constant 8e as printed there, proof read by a referee; Montgomery's Ten Lectures, chapter 5, not opened)." | row Q31, three places (stops cell, status cell, source note; replaced by this lane) |
| 23 | W5c | the sentence at the end of `REFEREE-W5c-and-TURAN-SOURCE.md` | "(W5c) Pairs x_j +- ib with equal offset b and abscissae separated by at least D (all abscissae carrying a pair, with multiplicity one). For every h in L^2 of an interval of length u (centred without loss, f being translation invariant), sum_j -[f(z_j) + f(conj z_j)] <= 4 pi C(u, D) sinh^2(ub/2) norm(h)^2 with C(u, D) = (2 e^2/pi) max(2/D, u/2); hence the family passes the complete band-u device with tolerance M against any on-line set when 4 pi C(u, D) sinh^2(ub/2) <= 2M, in particular for ub <= 1 and b <= 0.499 sqrt(M) u^(-3/2)/sqrt(max(1, 4/(uD))). One band, equal offsets." | row Q31 (replaced by this lane); one referee on W5c |

Notes.

- Count by this lane: 8 sentences were already in the map in substance, not word for word, and their text is unchanged (1, 2, 5, 14, 17, 19, 20, 21;
  for 5 the second display was added afterwards); 15 were added or
  completed by `push/c20-repair-owed-record-r19-statement-o-v5/apply_map.py` (3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 18, 22, 23;
  of these 8 and 15 complete a sentence that was present in part).
- Scope of 'two referee files' (referee of the source lane, E5): for the D10 lane the second referee confirmed Theorem Q through
  its conclusion at fresh points; for the tz paper lane only Theorem A was re-derived; for the tz server lane only zeta cells were
  rerun. The map status cells of rows P58 and D10 say so.
- Sentence 23 is not quoted in section 3 of the source; its text is taken verbatim from the end of `REFEREE-W5c-and-TURAN-SOURCE.md`, as section 3 directs.
  In sentence 15 the last sentence stands outside the quotation in the source, as here (corrected after the referee of this register, E8).
- Corrections E2 and E4 of that referee concern two sentences inside the REFEREE2 files (rank n(n-1)/2 only when no root lies on the
  imaginary axis; the sign at 3^2 comes from (-1)^(k+1), both a and b being positive); they are in map section 7.
- Turan: the cited text is a draft (Montgomery-Vaughan, Multiplicative Number Theory III, Theorem K.3, Corollaries K.4, K.5). The label
  of Corollary T' stays 'PROVED relative to' a cited theorem; Turan's own text and Montgomery's Ten Lectures were not opened.
