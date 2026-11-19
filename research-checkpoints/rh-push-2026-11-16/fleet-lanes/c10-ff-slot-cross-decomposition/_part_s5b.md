
((4, 1, 3), (4, 1, 5) (window edges) are in `short_tables.md`. (6, 2, 6) was stopped after its first vector
(39 minutes estimated): `one`, ratio 0.925; not used.)

- Targets a, b / c4 at N >= 4: ratio 0.975 to 0.997, cr -0.025 to +0.003; class U cr -0.030 to +0.038, class r
  -0.033 to +0.012. No target excess; the targets are slightly on the negative side (as THETA in the screen:
  cr -0.065 to +0.012). At N = 3 (7 or 13 marks, 343 or 2197 rows) a is at 1.165 (q = 7) and 1.015 (q = 13).
- Liouville-twisted vector: ratio 4.5 to 9.6, cr +3.4 to +8.7, sd 0.87 to 1.27: the excess is in the cross term.
  The screen has the same sign and place (cr +0.09 to +0.44 at Z = 16000). The size differs by the number of marks:
  the coherent term is quadratic and the diagonal linear in the mark weights, the model has 7 to 21 equal marks,
  the screen 5 or 6 with a sin^2 profile.
- Squared-signal law at this geometry: at (6, 2, 5) the Liouville-twisted cross is 8.66; times q^(-N) = 8.5e-6
  this predicts 7e-5 for a target, and the measured cross of a is +0.003 with class ranges of 0.01. Consistent;
  the term is below the resolution of the exact computation as well.

So the model and the screen agree at the same geometry. The model result of c9 is a statement about long marks.

### 5.3 Size of the same term in the screen (float; `zw_predict.py`, `logs/zw_predict_Z*.log`)

In Z[omega] the dual vector of a row vector tau t is m(c) = mu(c) G(c) t(c) w(c) q_c^(-1/2) (c9 Lemma 0), G(c) =
conj(chi_c(4)) Gamma(c) with Gamma unimodular and a function of c modulo 4. Sixth-power frequencies see the vector
through its sums over the residue classes modulo 4, twisted by chi_c(unit):

- ALIGNED (dual vector 1): frequencies k = eps l^6;
- LIOU (dual vector G): the factor conj(chi_c(4)) moves the coherent frequencies to 4k = eps l^6, k = 16 eps l'^6,
  a set of density (1/256)^(1/6) = 0.397 of the former, with the same class sums up to unimodular factors.
  Check against the screen [MEASURED there]: LIOU cross / ALIGNED cross at X = N is 0.565, 0.468, 0.425, 0.438 at
  Z = 2000, 4000, 8000, 16000;
- THETA (dual vector mu G): the same frequencies as LIOU, class sums of mu(c) Gamma(c) conj(chi_c(eps)) w(c) q_c^(-1/2).

Computed with the screen's column weights (same table and weight code): A(vec) = sum over the six units and the
12 residue classes of the squared class sums.

| Z | P | live columns | A(THETA)/A(ALIGNED) | A(U)/A(ALIGNED) | random phases, 8 seeds | square-root level | largest ALIGNED cr in the window (c9) | predicted THETA coherent cross | screen: THETA cr; RAND1 cr; U cr (c9) |
|---|---|---|---|---|---|---|---|---|---|
| 2000 | 12.6 | 36197 | 1.66e-2 | 1.50e-2 | 1.45e-2 .. 2.03e-2 | 1.55e-2 | 0.048 | 3.2e-4 | -0.020 .. -0.001; +0.001 .. +0.009; -0.008 .. +0.006 |
| 4000 | 16 | 72933 | 6.54e-3 | 6.62e-3 | 4.18e-3 .. 6.88e-3 | 6.04e-3 | 0.118 | 3.1e-4 | -0.006 .. +0.012; -0.005 .. +0.001; -0.004 .. +0.009 |
| 8000 | 20 | 145509 | 1.73e-3 | 2.19e-3 | 1.49e-3 .. 2.66e-3 | 2.23e-3 | 0.216 | 1.5e-4 | -0.065 .. -0.004; -0.004 .. +0.015; -0.019 .. -0.001 |
| 16000 | 25 | 371888 | 8.31e-4 | 7.29e-4 | 6.13e-4 .. 8.86e-4 | 7.58e-4 | 0.439 | 1.5e-4 | -0.020 .. -0.003; -0.008 .. +0.005; -0.016 .. +0.002 |

Predicted THETA coherent cross = 0.397 x A(THETA)/A(ALIGNED) x (largest ALIGNED cr). Reading:

- The class sums of the THETA dual vector are at the level of a random-phase vector at every size (the model law:
  squared Moebius-type sum with square-root cancellation).
- **Predicted size of the model's term in the screen: 1.5e-4 to 3.2e-4 of the diagonal.** The screen resolves
  about 0.01 to 0.02 (range of the cross term of its random-phase and U vectors). The term is 30 to 70 times below
  the resolution at the sizes run. The measured THETA ratio (at most 1.007, with a deficit near the lower edge)
  carries no information about it.
- **At what size would it be visible [ARGUED].** Visible = 0.05 (five times the resolution) needs
  ALIGNED cr >= 0.05/(0.397 A(THETA)/A(ALIGNED)): 7.6 at Z = 2000 and 152 at Z = 16000, against 0.048 and 0.439
  measured. If the ALIGNED cross grows like K^(1/6), K = N^2/X (Theorem A of `c8-liou-row-bound-theorem`; the
  screen's slopes are -0.07 to -0.13 against -1/6), K must grow by the factor 158^6 = 1.6e13 at Z = 2000
  (to K about 1.6e18) and 346^6 = 1.7e15 at Z = 16000 (to K about 3.5e23). With at least 400 rows this is
  N = (K X)^(1/2) >= 2.5e10 columns and P >= 1.3e7 = Z^2.2 at Z = 2000, and N >= 1.2e13 at Z = 16000. The largest
  screen had 3.7e5 live columns and P = 25. With the measured slopes the size is larger. More slot primes at
  larger P raise the ALIGNED cross at fixed K (by a factor not measured); K scales with its sixth power.
- **At the screen's geometry it is never visible [ARGUED].** With P = Z^(1/3) the window has K <= Z P^3 = Z^2, so the
  ALIGNED cross is at most of order Z^(1/3), while the squared ratio falls like 1/(number of columns of a block),
  about 1/Z: the predicted term is of order Z^(-2/3). The four computed values (3.2e-4, 3.1e-4, 1.5e-4, 1.5e-4) do
  not rise. In model variables: the squared signal of a Weil target exceeds the diagonal only for dual length
  above 3N (c8, c9), which needs lam > 2N + d/2, P > Z^2 Q^(1/2).
- **Term in which model and number field differ:** none found. Differences of bookkeeping only: (i) with long
  marks every column has one marked prime and the phase average of the cross term is 0; with short marks it is
  0.28 to 0.44 of the diagonal in the model and 0.05 to 0.07 in the screen; (ii) the model's sharp degree classes
  give the staircase in the residue of the dual length modulo 6, the screen's smooth weights average it;
  (iii) all primes of one degree against 5 or 6 weighted slot primes.

