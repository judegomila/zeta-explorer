# Corrected even2 midpoint arithmetic certificate

PASS, independent6000-cell160-bit replay 2026-11-03. Accepted source SHA25654a8dc03d3f9db09b5575a90631ec9c4db9344bdd6d10422582c6a77440e973f, saved in even2_corrected_replay/check.py.

The initial source assigned the two regression coordinates in reverse. That initial even2 result is INVALID for the actual target, not a valid failed enclosure and not an accepted certificate. The author discovered the error before acceptance; independent review confirmed it. Initial source/output remain under next_core_replay with explicit STATUS.md. The contemporaneous odd1 branch is unaffected. Earlier symmetric coefficient-upper-bound diagnostics are unaffected because they bounded both coordinates identically.

Correct coordinates in basis[p0,p2] are b=-lead(g11*g02-g01*g12)/det and a=-lead(g00*g12-g01*g02)/det. The physical x=t² conversion is c1=-551/8+2a/33 and c0=6419/16-47a/66+b. The corrected source differs from the initial checker exactly by the aa/bb assignment. It reads only G00,G01,G11,G02,G12 and verifies the old determinant positive. G22 and any target reserve are not used. It also verifies c0>0,c1<0, so the squared operator coefficients are nonnegative directly; no unknown next norm is needed for the tail sign.

The midpoint second derivative, grouped derivative-order integration, and spatial/arithmetic tail calculations were independently checked as in ODD1_MIDPOINT_AUDIT.md. For K8 the live comparison64pi>200 ensures the most restrictive degree threshold, with other components below64pi. Therefore all k>=64 arithmetic terms are positive for this operator and may be dropped in a lower bound.

Corrected independent replay gives contact lower11757.119985332155870866569144027179396514660604, integration tail<1.782e-250, and optional absolute arithmetic tail<2.445e-13. Thus h2>4pi*11757>141084. The earlier12577.616 figure is not retained as an actual-polynomial result.

Accepted scope: independent arithmetic reproving of an already-known finite rung from old-contact data, with the implementation error repaired and invalid outputs clearly separated. No new ladder extension, regenerated source moment enclosure, or growing-degree cancellation law.
