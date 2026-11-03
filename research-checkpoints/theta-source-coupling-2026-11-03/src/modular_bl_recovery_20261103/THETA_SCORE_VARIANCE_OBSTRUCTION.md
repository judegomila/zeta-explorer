# Actual-theta obstruction to paying mixture variance from source curvature alone

Status: independent analytic audit PASS. This is an exact N=1 obstruction to a proposed all-degree estimate, not an all-degree theorem or a failure of the complete weighted log-concavity statement.

For the complete even theta profile set v=-ψ'/ψ and q=v'(0)=-ψ''(0)/ψ(0). In the exact N=1 metric for a>0, write β(a)=s₁(a)/s₀(a)>0 and α(a)=β(a)+a². Up to an h-independent factor the density is

 ρ(h)=h e^(-2ah) ψ(h)² [α+v(h)²].                                    (1)

The two positive components α and v² define mixing weights p=α/(α+v²), 1-p=v²/(α+v²) for h>0 where v>0. Their log-score variance equals

 V = p(1-p)[0-2v'/v]² = 4α(v')²/(α+v²)².                            (2)

The common profile factor ψ² contributes negative log-curvature -2v'. A tempting dimension-free payment candidate is V≤2v' pointwise for every degree and shift. At h↓0 the true theta is even, so v→0 and v'→q, giving

 V/(2v') → 2q/α.                                                       (3)

The independently certified interval evidence in MIDPOINT_MPFI_CERTIFICATE.md gives q>17 and β(a)→β₀<13 as a↓0. Therefore α(a)<13+o(1), and the ratio in (3) exceeds 34/13 for all sufficiently small positive a and h near zero. Thus V≤2v' is false for the actual theta at degree 1, with positive old pivots. More generally a bound V≤C·2v' valid uniformly as a,h↓0 needs C≥2q/β₀>34/13.

This does not contradict the independently established strict log-concavity of the full N=1 density: the separate component log-curvatures also contribute, and the common h factor contributes -1/h². Nor does this contradict a different correlated signed, integrated, or matrix inequality. The obstruction merely prevents paying the score variance by the profile's negative curvature in isolation. Although the witness is finite-degree, it defeats the stated uniform all-degree candidate.
