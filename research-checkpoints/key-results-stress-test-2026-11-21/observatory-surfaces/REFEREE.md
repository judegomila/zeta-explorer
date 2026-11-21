# observatory-surfaces: referee pass on the first reviewer's verdict (2026-11-20)

Scripts and outputs: `referee/m1.py`, `m2.py`, `m2exit.py`, `dh.py` and `.out` files. All run locally through
`scripts/memcap.sh 8` with the `.venv-arb` python. Total compute about 4 min 15 s. Nothing written in either repo
outside this folder.

## Outcome

The first verdict stands in substance: scores unchanged (arbitrariness 4, importance 1), verification
"confirmed-weaker-statement", label "visualisation". One numerical statement in its robustness text is wrong and
is corrected below. Two wording points are tightened.

## What I ran (my own code, no code path shared with the repository or the first reviewer)

1. M1 by the classical route instead of discs (`m1.py`, 3 s). Arb `zeta_nzeros(2000)` = 1517; zero 1517 at
   1999.5457641762676, zero 1518 at 2000.4345153024322. Hardy Z evaluated in Arb ball arithmetic (100 bits) at
   1518 points (t = 1, the 1516 midpoints of consecutive zeros, t = 2000): every sign determined, 1517 certified
   sign changes. With N(2000) = 1517 this gives all zeros with 0 < Im s < 2000 on the line and simple. Smallest
   gap below 2000: 0.0975025 after zero 1496 (matches the first reviewer's "smallest radius 0.039" disc).
   Shared dependency with the repo certificate: Arb's zeta. Method otherwise different.
2. M2 by direct evaluation (`m2.py`, mpmath 30 digits, own Phi series; floating point, not rigorous).
   F_0 = xi to 3.4e-31 relative. |xi(c)| = 1.093e-18 (claimed <= 2e-18). |xi'(c)| = 0.00138271908921626
   (claimed >= 0.0013827; the margin of that constant is 1.4e-6 relative). L_3 = 0.00774195284358408 (doc value
   to all digits). Perturbation integral = 2.89656970e-4 (claimed < 2.9e-4). True boundary minimum of |F_0| on 96
   nodes = 3.93430e-4 (first reviewer: 3.934e-4; Taylor floor 3.5532e-4). Threshold where the bound stops closing:
   delta = 0.0613234 (first reviewer: 0.0613). Winding number on the circle = 1.0 at tau = -1, -0.2, -0.05,
   -0.025, 0.025, 0.05, 0.2. Root heights at tau = -0.2, +0.2: 14.19273210018439, 14.07680614422444 (doc table).
3. New measurement: the true sup over the circle of |F_tau - F_0| at tau = +0.05 is 2.523e-5 and at -0.05 is
   2.531e-5. The certificate's bound is 2.897e-4, i.e. 11.5 times the true value.
4. Exit times (`m2exit.py`): the first zero leaves the fixed disc at tau = +1.21331 (height 13.7847) and at
   tau = -1.20224 (height 14.4847). Winding on the circle at tau = 2, 5, -3 is 0.
5. Davenport-Heilbronn control (`dh.py`, own implementation by Hurwitz zeta): off-line zero
   0.808517182456637 + 85.699348485377592 i, on-line zero 5.094159844571095. Agrees with the first reviewer to
   all digits they print and with the value in Spira's table (0.808517 + 85.699348 i).
6. By hand: A corresponds to s -> 1 - conj(s) under w = (s-1)/s, and has no fixed point on the curve (on
   |w| = 1, eta = +- w sqrt(2 cos 2theta + r^2 + r^-2) and A sends eta to -eta). M6 is the statement that the
   k-th Laurent coefficient of a holomorphic function on an annulus scales as rho^k; it holds for k > 0 as decay
   and for k < 0 as growth, for any holomorphic F. M3 follows from z^2 = (5 - 12u +- sqrt(96u^2 - 80u + 9))/2
   with discriminant root u = (10 - sqrt 46)/24 = 0.1340696.
7. Public clone: fetched; origin/main is now 91cfca3c5. `git diff 7ab2fcae origin/main -- observatory` is empty,
   so the first reviewer's inspected content is current.

## Faults found in the first verdict

F1 (error). Robustness text: "The zero itself stays in the disc at least for -1 <= tau <= 2 (heights 14.4256 to
   13.5596)". False for tau > 1.2133: 13.5596 is 0.575 from the centre, outside radius 0.35, and the winding
   number on the circle at tau = 2 is 0. Correct statement: the zero is in the disc for -1.2022 < tau < 1.2133.
   The conclusion drawn from it (the certified window 0.05 reflects the bound, not the zero) survives: the
   certified window is about 1/24 of the true one, and the bound is 11.5 times the true perturbation.
F2 (independence). Replay items (1) and (2) of the first verdict re-ran the repository's own scripts. That is a
   reproducibility check, not independent verification. Their items (3)-(7) were independent. Item 1 above adds
   a second independent route for M1 and item 2 an independent (non-rigorous) check of every constant in M2
   except B = sup |xi''| <= 0.0021, which I checked only indirectly (true minimum above the Taylor floor).
F3 (wording). One-line: "the displays and checks apply equally to functions that violate the Riemann
   hypothesis" is loose. Accurate form: applied to a function with off-line zeros the same disc test passes at
   each simple on-line zero and fails at off-line pairs; it gives information only about the zeros tested.
F4 (wording). M6 "decays" holds for modes k > 0 in the stated orientation; modes k < 0 grow by the reciprocal
   factor. It is the Laurent expansion and should not be called a transport law of zeta.
F5 (minor). M1 is obtainable from an Arb library call plus 1518 sign evaluations in 3 s; the 226-line disc
   certificate (5 min) adds per-zero discs for the display, not information.
F6 (minor, citation). Broughan-Barnett, The holomorphic flow of the Riemann zeta function, is Math. Comp. 73
   (2004) 987-1004. Add Platt, Isolating some non-trivial zeros of zeta, Math. Comp. 86 (2017), the method
   implemented in Arb.

## Scores

Arbitrariness 4, unchanged. Argument for 5: every certified number (2000, 0.35, 0.05, 0.13, 1/50) is a chosen
parameter and the 0.05 window is 1/24 of what the zero does. Argument for 3: the involution formulas and the
symmetry f o A = conj f are canonical. The canonical parts are classical and carry no claim, so 4.
Importance 1, unchanged. An expert would shrug: M1 is a library call nine orders below Platt-Trudgian; M2 is
one zero, |tau| <= 0.05, and the de Bruijn-Newman constant is not affected; M3 is a quartic with closed-form
roots; M4, M6, M7 are classical; M5 and the controls show no method is ruled in or out. Not a restatement of RH
and not an equivalence; it constrains nothing.

## Literature (4 web queries of my own, standard mode; brief)

Found: Platt, Math. Comp. 86 (2017) (rigorous zero isolation, implemented in Arb); Platt-Trudgian
arXiv:2004.09765; Rodgers-Tao arXiv:1801.05914; Klein bottle as torus modulo a free orientation-reversing
involution (e.g. arXiv:0811.1717); generic certified zero tracking with a parameter (Guillemot-Lairez,
arXiv:2401.17973). Not found: xi pulled back to an elliptic double cover with Klein quotient in the refereed
literature (one unreviewed preprints.org manuscript links a Moebius/Klein-surface structure to xi; not read);
a published interval certificate of the local statement M2. Ten queries in total between the two passes; "not
found" means not found in a short search.
