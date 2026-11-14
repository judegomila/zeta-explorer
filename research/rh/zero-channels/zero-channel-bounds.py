#!/usr/bin/env python3
"""Exact polynomial channels, an Arb theta interval certificate, and a numerical audit.

The certificate and its verifier use fractions.Fraction only. Decimal square
roots merely suggest rational centerlines; the verifier does not trust them.
mpmath is required only for the optional, uncertified theta-kernel audit.
python-flint is required by --with-arb for the actual-theta disk certificate;
its whole-boundary and whole-time proof includes both explicit infinite tails.

Examples:
  python3 scripts/experiments/zero-channel-bounds.py
  python3 scripts/experiments/zero-channel-bounds.py --certificate-only --self-test
  python3 scripts/experiments/zero-channel-bounds.py --verify-existing report.json
  python3 scripts/experiments/zero-channel-bounds.py --theta-data compact.json --output report.json
  python3 scripts/experiments/zero-channel-bounds.py --with-arb --self-test
"""
from __future__ import annotations

import argparse
import copy
from datetime import datetime, timezone
from decimal import Decimal, localcontext
from fractions import Fraction as Q
from hashlib import sha256
from math import comb
from pathlib import Path
import json
import sys


ROOT = Path(__file__).resolve().parents[2]
SCHEMA = "zeta-observatory/zero-channel-bounds/1"
POLYNOMIAL = "P_u(z)=z^4+(12u-5)z^2+12u^2-10u+4"
RADIUS_S = Q(1, 100)
U_END = Q(13, 100)
CELL_COUNT = 130


def qtext(value):
    value = Q(value)
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def trim(p):
    p = list(p)
    while len(p) > 1 and p[-1] == 0:
        p.pop()
    return p


def add(*polys):
    out = [Q(0)] * max(map(len, polys))
    for p in polys:
        for k, value in enumerate(p):
            out[k] += value
    return trim(out)


def scale(p, value):
    return trim([Q(value) * a for a in p])


def mul(p, q):
    out = [Q(0)] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            out[i+j] += a*b
    return trim(out)


def bernstein_range(p):
    """Exact enclosure of a rational polynomial on the whole interval [0,1]."""
    p = trim(p)
    n = len(p)-1
    b = [sum((p[j]*Q(comb(k, j), comb(n, j)) for j in range(k+1)), Q(0))
         for k in range(n+1)]
    return min(b), max(b)


def abs_upper(bounds):
    return max(abs(bounds[0]), abs(bounds[1]))


def abs_lower(bounds):
    lo, hi = bounds
    return Q(0) if lo <= 0 <= hi else min(abs(lo), abs(hi))


def quartic_cell_bounds(u0, u1, c0, c1, radius_s):
    """All parameters are rational; c0,c1 are z-coordinate centers.

    Set u=u0+(u1-u0)w and c=c0+(c1-c0)w for 0<=w<=1.
    Bernstein convex-hull bounds retain cancellation in P_u(c(u)).
    P''_u(c+h)=P''_u(c)+24*c*h+12*h^2 bounds the full complex disk.
    Finally Fs=-2i Pz and Fss=-4 Pzz convert to the renderer's s chart.
    """
    u, c = [u0, u1-u0], [c0, c1-c0]
    c2, c3 = mul(c, c), mul(mul(c, c), c)
    a = add(scale(u, 12), [Q(-5)])
    value = add(mul(c2, c2), mul(a, c2), scale(mul(u, u), 12), scale(u, -10), [Q(4)])
    first = add(scale(c3, 4), scale(mul(a, c), 2))
    second = add(scale(c2, 12), scale(u, 24), [Q(-10)])
    rz = 2*radius_s
    E = abs_upper(bernstein_range(value))
    A = 2*abs_lower(bernstein_range(first))
    Bz = abs_upper(bernstein_range(second)) + 24*max(abs(c0), abs(c1))*rz + 12*rz*rz
    B = 4*Bz
    margin = A*radius_s - E - B*radius_s*radius_s/2
    return E, A, B, margin


def suggested_centers(u):
    """Proposal only: 18-decimal rational centers subsequently proved safe."""
    with localcontext() as ctx:
        ctx.prec = 60
        d = Decimal(u.numerator)/Decimal(u.denominator)
        discriminant = (96*d*d-80*d+9).sqrt()
        inner = ((5-12*d-discriminant)/2).sqrt()
        outer = ((5-12*d+discriminant)/2).sqrt()
        quantum = Decimal("0.000000000000000001")
        inner, outer = Q(str(inner.quantize(quantum))), Q(str(outer.quantize(quantum)))
    return [inner, -inner, outer, -outer]


def build_quartic_certificate():
    knots = [(U_END*Q(k, CELL_COUNT), suggested_centers(U_END*Q(k, CELL_COUNT)))
             for k in range(CELL_COUNT+1)]
    intervals = []
    global_margin = None
    global_clearance = None
    for (u0, centers0), (u1, centers1) in zip(knots, knots[1:]):
        branches = []
        for branch, (c0, c1) in enumerate(zip(centers0, centers1)):
            E, A, B, margin = quartic_cell_bounds(u0, u1, c0, c1, RADIUS_S)
            assert A > 0 and margin > 0, (branch, u0, u1, margin)
            global_margin = margin if global_margin is None else min(global_margin, margin)
            exact = {"tauMin": qtext(-u1), "tauMax": qtext(-u0),
                     "centerStartT": qtext(c1/2), "centerEndT": qtext(c0/2),
                     "radius": qtext(RADIUS_S), "E": qtext(E), "A": qtext(A),
                     "B": qtext(B), "margin": qtext(margin)}
            branches.append({"branch": branch, "centerStart": {"sigma": .5, "t": float(c1/2)},
                             "centerEnd": {"sigma": .5, "t": float(c0/2)},
                             "radius": float(RADIUS_S), "E": float(E), "A": float(A),
                             "B": float(B), "margin": float(margin), "certified": True,
                             "exact": exact})
        cell_clearance = None
        for centers in [centers0, centers1]:
            ordered = sorted(centers)
            clearance = min((b-a)/2-2*RADIUS_S for a, b in zip(ordered, ordered[1:]))
            global_clearance = clearance if global_clearance is None else min(global_clearance, clearance)
            cell_clearance = clearance if cell_clearance is None else min(cell_clearance, clearance)
        intervals.append({"tauMin": float(-u1), "tauMax": float(-u0), "branches": branches,
                          "minClearance": float(cell_clearance), "minClearanceExact": qtext(cell_clearance),
                          "certificateId": f"quartic-affine-rational-v1:u={qtext(u0)}..{qtext(u1)}"})
    certificate = {
        "certified": True, "certificateId": "quartic-affine-rational-v1", "claim": "Four disjoint moving disks each contain exactly one simple zero for every tau in [-13/100,0].",
        "proofKind": "Exact rational Bernstein bounds and Taylor–Rouche on every full time cell and full complex disk",
        "arithmetic": "Python arbitrary-size integers and fractions.Fraction; no floating-point decisions",
        "polynomial": POLYNOMIAL, "chart": "F_tau(s)=P_{-tau}(-2i(s-1/2))",
        "tauMin": -.13, "tauMax": 0, "radius": float(RADIUS_S), "cellCount": CELL_COUNT,
        "branchOrder": ["inner positive", "inner negative", "outer positive", "outer negative"],
        "centerInterpolation": "piecewise affine in tau; centerStart at tauMin, centerEnd at tauMax",
        "minMargin": float(global_margin), "minMarginExact": qtext(global_margin),
        "minClearance": float(global_clearance), "minClearanceExact": qtext(global_clearance),
        "displayScope": "Numeric fields are rounded displays of the rational strings. Certification applies to the recorded affine centers and radius, not arbitrary root-centered or resized disks.",
        "coverage": "All four polynomial zeros, since the four disjoint disks each have count one and P has degree four.",
        "endpointScope": "Stops at tau=-.13, before the exact collision tau=-(10-sqrt(46))/24. No extension through collision is claimed.",
        "intervals": intervals,
    }
    verify_quartic_certificate(certificate)
    return certificate


def verify_quartic_certificate(cert):
    """Recompute every full-cell bound and adjacency from exact strings.

    This intentionally does not trust cached floating-point metrics, proposed
    root positions, declared certified flags, or the center generation method.
    """
    if cert.get("polynomial") != POLYNOMIAL:
        raise ValueError("Wrong polynomial family")
    intervals = cert.get("intervals", [])
    if not intervals:
        raise ValueError("No certified intervals")
    all_margins, all_clearances = [], []
    previous_end = Q(0)
    previous_centers = None
    for index, cell in enumerate(intervals):
        branches = cell.get("branches", [])
        if [b.get("branch") for b in branches] != [0, 1, 2, 3]:
            raise ValueError("Need four uniquely identified branches")
        x0 = branches[0]["exact"]
        tau_lo, tau_hi = Q(x0["tauMin"]), Q(x0["tauMax"])
        if not tau_lo < tau_hi or tau_hi != previous_end:
            raise ValueError("Gap or overlap in parameter coverage")
        starts, ends, radii = [], [], []
        for branch in branches:
            x = branch["exact"]
            if Q(x["tauMin"]) != tau_lo or Q(x["tauMax"]) != tau_hi:
                raise ValueError("Mismatched branch interval")
            start, end, radius = Q(x["centerStartT"]), Q(x["centerEndT"]), Q(x["radius"])
            if radius <= 0 or branch["centerStart"]["sigma"] != .5 or branch["centerEnd"]["sigma"] != .5:
                raise ValueError("Invalid disk or symmetry center")
            E, A, B, _ = quartic_cell_bounds(-tau_hi, -tau_lo, 2*end, 2*start, radius)
            e, a, b = Q(x["E"]), Q(x["A"]), Q(x["B"])
            if e < E or a > A or b < B or min(e, b) < 0 or a <= 0:
                raise ValueError("Recorded derivative/residual bounds do not enclose the whole cell")
            margin = a*radius-e-b*radius*radius/2
            if margin <= 0 or Q(x["margin"]) != margin:
                raise ValueError("Taylor–Rouche strict inequality failed")
            # Display metadata must not make a visibly different disk green.
            for field, exact_value in [("E", e), ("A", a), ("B", b), ("margin", margin), ("radius", radius)]:
                if branch[field] != float(exact_value):
                    raise ValueError("Rounded display metadata disagrees with exact certificate")
            if branch["centerStart"]["t"] != float(start) or branch["centerEnd"]["t"] != float(end):
                raise ValueError("Displayed center disagrees with exact certificate")
            starts.append(start); ends.append(end); radii.append(radius); all_margins.append(margin)
        if previous_centers is not None and ends != previous_centers:
            raise ValueError("Discontinuous centerline")
        # For affine real centers, separation on a cell is bounded by endpoint
        # separation if the ordering agrees. Check every pair, not just neighbours.
        cell_clearances = []
        for i in range(4):
            for j in range(i+1, 4):
                d0, d1 = starts[j]-starts[i], ends[j]-ends[i]
                if d0*d1 <= 0:
                    raise ValueError("Centerlines cross")
                clearance = min(abs(d0), abs(d1))-radii[i]-radii[j]
                if clearance <= 0:
                    raise ValueError("Certified channels overlap")
                all_clearances.append(clearance)
                cell_clearances.append(clearance)
        if Q(cell["minClearanceExact"]) != min(cell_clearances) or cell["minClearance"] != float(min(cell_clearances)):
            raise ValueError("Incorrect per-cell disjointness bound")
        if cell["tauMin"] != float(tau_lo) or cell["tauMax"] != float(tau_hi):
            raise ValueError("Displayed parameter interval disagrees with exact certificate")
        previous_end, previous_centers = tau_lo, starts
    if previous_end != -U_END:
        raise ValueError("Certificate does not cover the declared full interval")
    if Q(cert["minMarginExact"]) != min(all_margins) or Q(cert["minClearanceExact"]) != min(all_clearances):
        raise ValueError("Incorrect global minima")
    return {"valid": True, "cells": len(intervals), "branchCells": len(all_margins),
            "tauMin": float(-U_END), "tauMax": 0, "minMargin": float(min(all_margins)),
            "minClearance": float(min(all_clearances)), "arithmetic": "exact rational"}


def certificate_self_tests(cert):
    tests = [{"name": "valid certificate is accepted", "passed": verify_quartic_certificate(cert)["valid"]}]
    cases = []
    bad = copy.deepcopy(cert); bad["intervals"][0]["branches"][0]["exact"]["A"] = "999999"; cases.append(("inflated derivative floor is rejected", bad))
    bad = copy.deepcopy(cert); bad["intervals"].pop(0); cases.append(("missing time cell is rejected", bad))
    bad = copy.deepcopy(cert); bad["intervals"][0]["branches"][0]["centerStart"]["t"] += .1; cases.append(("mismatched displayed center is rejected", bad))
    bad = copy.deepcopy(cert); bad["intervals"][0]["branches"][0]["exact"]["margin"] = "0"; cases.append(("forged margin is rejected", bad))
    for name, bad in cases:
        try:
            verify_quartic_certificate(bad)
        except (ValueError, KeyError):
            tests.append({"name": name, "passed": True})
        else:
            raise AssertionError(name)
    return tests


def theta_candidate_audit(path):
    import mpmath as mp
    mp.mp.dps = 50
    data_bytes = path.read_bytes()
    data = json.loads(data_bytes)
    frames = [frame for run in data["runs"] for frame in run["frames"]]
    if not frames or any(len(f["roots"]) != 3 for f in frames):
        raise ValueError("Theta audit expects the saved three-branch comparison")
    if any(abs(f["tau"]) > .2 or any(r["sigma"] != .5 for r in f["roots"]) for f in frames):
        raise ValueError("Theta data lie outside the stated parameter/center domain")
    def phi(u):
        return mp.fsum((2*mp.pi**2*n**4*mp.exp(9*u)-3*mp.pi*n*n*mp.exp(5*u))*mp.exp(-mp.pi*n*n*mp.exp(4*u)) for n in range(1, 13))
    radius_bound, tau_bound = mp.mpf(".01"), mp.mpf(".2")
    curvature = 32*mp.quad(lambda u: u*u*mp.exp(tau_bound*u*u)*phi(u)*mp.cosh(2*radius_bound*u), [0, mp.mpf(".125"), mp.mpf(".25"), mp.mpf(".5"), 1, mp.mpf("1.5")])
    radii = [.01, .0001, .00001]
    branches = []
    for k, radius in enumerate(radii):
        roots = [frame["roots"][k] for frame in frames]
        A = min(r["derivativeAbs"] for r in roots)
        E = max(r["residual"]*r["derivativeAbs"] for r in roots)
        gap = A*radius-E-float(curvature)*radius*radius/2
        branches.append({"branch": k, "radius": radius, "minSampledDerivative": A,
                         "maxSampledFunctionResidual": E, "candidateMargin": gap,
                         "nominalStrictInequality": gap > 0, "certified": False})
    return {
        "certified": False, "status": "sampled candidate, not a certificate", "frameCount": len(frames),
        "rootRecordCount": 3*len(frames), "tauMin": min(f["tau"] for f in frames), "tauMax": max(f["tau"] for f in frames),
        "radii": radii, "momentBoundEstimate": float(curvature), "momentBoundEstimateDigits": mp.nstr(curvature, 42),
        "curvatureFormula": "B=32 integral_0^infinity u^2 exp(.2 u^2) Phi(u) cosh(.02 u) du; valid for |tau|<=.2 and |Re(s)-1/2|<=.01",
        "method": {"arithmetic": "mpmath floating point", "digits": mp.mp.dps, "thetaTerms": 12, "cutoff": 1.5, "mpmathVersion": mp.__version__},
        "branches": branches,
        "minSampledTrackedGap": min(f["roots"][j+1]["t"]-f["roots"][j]["t"] for f in frames for j in range(2)),
        "scope": "Tests the Taylor–Rouche inequality numerically at the saved centers only. Kernel truncation, quadrature, raw residuals and between-frame time values are not enclosed. Does not rule out other zeros.",
        "inputSha256": sha256(data_bytes).hexdigest(),
        "inputProvenance": data.get("provenance", {}),
        "evaluatedSourceSha256": data.get("evaluatedSourceSha256", {}),
    }


def build_theta_witness():
    """A genuine actual-theta fixed-disk certificate, using Arb and explicit tails.

    The constants emitted as claims are rational, rounded outward. Arb only
    verifies those fixed rational claims, so re-verification does not depend on
    matching any formatted floating-point midpoint or quadrature transcript.
    """
    import flint
    from flint import acb, acb_series, arb, ctx
    ctx.dps = 50
    N, L, boundary_nodes = 12, arb("1.5"), 128
    radius, delta = arb(".35"), arb(".05")
    center = acb(arb(".5"), arb("14.134725141734693"))
    pi = arb.pi()
    claims = {"tauMin": "-1/20", "tauMax": "1/20", "centerSigma": "1/2",
              "centerT": "14134725141734693/1000000000000000", "radius": "7/20",
              "E": "1/500000000000000000", "A": "13827/10000000", "B": "21/10000",
              "perturbationUpper": "29/100000"}
    ref_floor = Q(claims["A"])*Q(claims["radius"])-Q(claims["E"])-Q(claims["B"])*Q(claims["radius"])**2/2
    gap = ref_floor-Q(claims["perturbationUpper"])
    claims["referenceModulusLower"], claims["margin"] = qtext(ref_floor), qtext(gap)

    def ball_of_rational(value):
        value = Q(value)
        return arb(value.numerator)/arb(value.denominator)

    def xi_jet(z, length):
        s = acb_series([z, 1], length)
        return s*(s-1)/2*((-s/2)*pi.log()).exp()*(s/2).gamma()*s.zeta()

    def phi_partial(z):
        e4, e5, e9 = (4*z).exp(), (5*z).exp(), (9*z).exp()
        return sum((2*pi*pi*n**4*e9-3*pi*n*n*e5)*(-pi*n*n*e4).exp() for n in range(1, N+1))

    def moment_tails(m, heat_delta, front_factor):
        """Enclose omitted n>N on [0,L] and ALL n on [L,infinity].

        Phi_n(u)<=2*pi^2*n^4*e^(9u-pi*n^2*e^(4u)). On [0,L]
        that exponential decreases for omitted n; the n series is geometric.
        On [L,infinity], g(u)=m log u+delta*u^2+(9+2r)u-pi*e^(4u)
        has decreasing derivative g'(u)<=-K<0. All comparisons below are Arb
        enclosures of strict elementary inequalities, not numerical samples.
        """
        M, C = N+1, 2*front_factor*pi*pi
        qn = 16*(-pi*(2*M+1)).exp()
        qtail = 16*(-3*pi*(4*L).exp()).exp()
        K = 4*pi*(4*L).exp()-m/L-2*heat_delta*L-(9+2*radius)
        if not (4*pi*M*M > 9 and qn < 1 and qtail < 1 and K > 0 and 16*pi*(4*L).exp() > 2*heat_delta):
            raise ValueError("Analytic theta-tail hypotheses were not verified")
        finite_tail = C*L**(m+1)*(heat_delta*L*L+2*radius*L).exp()*M**4*(-pi*M*M).exp()/(1-qn)
        infinite_tail = C*L**m*(heat_delta*L*L+(9+2*radius)*L-pi*(4*L).exp()).exp()/(K*(1-qtail))
        return finite_tail.upper(), infinite_tail.upper()

    jet0 = xi_jet(center, 2)
    value_upper, derivative_lower = abs(jet0[0]).upper(), abs(jet0[1]).lower()
    if not (value_upper < ball_of_rational(claims["E"]) and derivative_lower > ball_of_rational(claims["A"])):
        raise ValueError("Initial xi center bounds did not certify the proposed rational constants")

    second_node_upper = arb(0)
    max_node_index = None
    for k in range(boundary_nodes):
        z = center+radius*(acb(0, 1)*2*pi*k/boundary_nodes).exp()
        value = abs(2*xi_jet(z, 3)[2]).upper()
        if value > second_node_upper:
            second_node_upper, max_node_index = value, k
    # The integrands are entire in the quadrature variable. Therefore it is
    # correct to ignore acb.integral's analytic flag; there are no branch cuts.
    integration_options = {"abs_tol": arb("1e-32"), "rel_tol": arb("1e-32"), "eval_limit": 100000, "depth_limit": 30}
    third_integral = acb.integral(lambda z, _: 64*z**3*phi_partial(z)*(2*radius*z).cosh(), 0, L, **integration_options)
    perturb_integral = acb.integral(lambda z, _: 8*phi_partial(z)*((delta*z*z).exp()-1)*(2*radius*z).cosh(), 0, L, **integration_options)
    if not (third_integral.is_finite() and perturb_integral.is_finite() and third_integral.imag.contains(0) and perturb_integral.imag.contains(0)):
        raise ValueError("Rigorous quadrature did not return finite real integral enclosures")
    third_missing, third_tail = moment_tails(3, arb(0), 64)
    perturb_missing, perturb_tail = moment_tails(0, delta, 8)
    third_upper = (third_integral.real.upper()+third_missing+third_tail).upper()
    perturb_upper = (perturb_integral.real.upper()+perturb_missing+perturb_tail).upper()
    chord_upper = (2*radius*(pi/(2*boundary_nodes)).sin()).upper()
    second_disk_upper = (second_node_upper+third_upper*chord_upper).upper()
    if not (second_disk_upper < ball_of_rational(claims["B"]) and perturb_upper < ball_of_rational(claims["perturbationUpper"]) and gap > 0):
        raise ValueError("The whole-disk or whole-time Rouché inequality was not certified")

    def exact_upper(value):
        return str(value.upper().fmpq())

    return {
        "certified": True, "certificateType": "rouche-reference", "certificateId": "theta-first-disk-arb-v1",
        "branch": 0, "center": {"sigma": .5, "t": 14.134725141734693}, "radius": .35,
        "tauMin": -.05, "tauMax": .05,
        "referenceModulusLower": float(ref_floor), "perturbationUpper": float(Q(claims["perturbationUpper"])), "margin": float(gap),
        "initialTaylor": {"E": float(Q(claims["E"])), "A": float(Q(claims["A"])), "B": float(Q(claims["B"]))},
        "exact": claims,
        "claim": "The actual entire theta family has exactly one simple zero in this fixed reflection-symmetric disk for every real tau in [-1/20,1/20]; this zero lies on the critical line.",
        "proof": "Arb xi value/derivative bounds, a whole-disk xi second-derivative bound from 128 contour nodes plus a rigorous third-derivative moment, Taylor–Rouche for initial count one, and a rigorous whole-time theta perturbation bound. Explicit n and integration tails are included.",
        "scope": "One fixed disk around the first tracked zero. It does not certify the other tracked branches, resized or root-centered disks, all heights, or all tau. No RH conclusion is asserted.",
        "method": {"backend": "python-flint / Arb", "pythonFlintVersion": flint.__version__, "decimalDigits": ctx.dps, "boundaryNodes": boundary_nodes, "thetaTerms": N, "integrationCutoff": 1.5,
                   "rounding": "Outward ball arithmetic; final claims are fixed rational constants", "tailsIncluded": True,
                   "tailMethod": "Positive-term envelope, geometric n tail, and decreasing log-derivative integration tail"},
        "validatedNumerics": {
            "initialXiValue": str(jet0[0]), "initialXiDerivative": str(jet0[1]),
            "centerValueUpperExact": exact_upper(value_upper), "centerDerivativeLowerExact": str(derivative_lower.fmpq()),
            "maxSecondDerivativeNode": max_node_index, "secondDerivativeNodeUpper": str(second_node_upper),
            "thirdMomentIntegral": str(third_integral), "thirdMomentUpperExact": exact_upper(third_upper),
            "thirdMomentMissingTermsUpper": str(third_missing), "thirdMomentIntegrationTailUpper": str(third_tail),
            "nearestNodeChordUpper": str(chord_upper), "wholeDiskSecondDerivativeUpper": str(second_disk_upper),
            "perturbationIntegral": str(perturb_integral), "perturbationUpperExact": exact_upper(perturb_upper),
            "perturbationMissingTermsUpper": str(perturb_missing), "perturbationIntegrationTailUpper": str(perturb_tail),
        },
    }


def verify_theta_witness(witness):
    fresh = build_theta_witness()
    # Re-evaluate rather than trusting a quadrature transcript or proof flag.
    for key in ["certificateType", "certificateId", "branch", "center", "radius", "tauMin", "tauMax", "referenceModulusLower", "perturbationUpper", "margin", "initialTaylor", "exact"]:
        if witness.get(key) != fresh[key]:
            raise ValueError(f"Actual-theta claim differs from the independently verified claim: {key}")
    if witness.get("certified") is not True or witness.get("method", {}).get("tailsIncluded") is not True:
        raise ValueError("Missing actual-theta certificate or tail statement")
    return {"valid": True, "certificateId": fresh["certificateId"], "tauMin": -.05, "tauMax": .05,
            "radius": .35, "margin": fresh["margin"], "arithmetic": "Arb ball arithmetic plus rational final bounds"}


def theta_witness_self_tests(witness):
    verify_theta_witness(witness)
    bad = copy.deepcopy(witness)
    bad["tauMin"], bad["exact"]["tauMin"] = -.2, "-1/5"
    try:
        verify_theta_witness(bad)
    except ValueError:
        return [{"name": "expanded uncertified theta interval is rejected", "passed": True}]
    raise AssertionError("Expanded theta interval was accepted")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--theta-data", type=Path, default=ROOT/"dist/experiments/zero-confinement-theta.json")
    parser.add_argument("--output", type=Path, default=ROOT/"dist/experiments/zero-channel-bounds.json")
    parser.add_argument("--certificate-only", action="store_true", help="Skip the numerical theta audit; standard library only unless --with-arb is also supplied")
    parser.add_argument("--with-arb", action="store_true", help="Also generate/reverify the actual-theta interval witness; requires python-flint")
    parser.add_argument("--verify-existing", type=Path, help="Verify a saved certificate with exact rational arithmetic; no mpmath needed")
    parser.add_argument("--self-test", action="store_true", help="Also reject intentionally corrupted certificates")
    args = parser.parse_args()
    if args.verify_existing:
        data = json.loads(args.verify_existing.read_text())
        cert = data["exactQuarticCertificate"] if "exactQuarticCertificate" in data else data
        report = verify_quartic_certificate(cert)
        if args.with_arb:
            report["thetaWitness"] = verify_theta_witness(data["thetaCertifiedWitness"])
        if args.self_test:
            report["selfTests"] = certificate_self_tests(cert)
            if args.with_arb:
                report["selfTests"].extend(theta_witness_self_tests(data["thetaCertifiedWitness"]))
        print(json.dumps(report, indent=2)); return
    cert = build_quartic_certificate()
    data = {"schema": SCHEMA, "generatedAt": datetime.now(timezone.utc).isoformat(),
            "claimStatus": {"quartic": "certified exact rational finite-model result", "theta": "one local actual-theta interval witness certified" if args.with_arb else "numerical candidate only", "globalRH": "not established"},
            "theoremConditions": {"singleDisk": "E+B*r^2/2 < A*r with rigorous |F(c)|<=E, |Fs(c)|>=A>0, sup_disk|Fss|<=B",
                                  "linePinning": "Reflection symmetry plus one zero counting multiplicity in a reflection-symmetric disk",
                                  "branchAssignment": "Continuous pairwise-disjoint disks with zero-free boundaries",
                                  "movingStep": "integral sup_|w|=1 |tauPrime*Fss/4+(centerPrime+radiusPrime*w)*Fs| d(lambda) < initial boundary modulus floor",
                                  "scope": "Uniform bounds over full parameter intervals and full disk boundaries are required; finite samples are insufficient"},
            "exactQuarticCertificate": cert,
            "thetaCertifiedWitness": build_theta_witness() if args.with_arb else None,
            "thetaCandidateAudit": None if args.certificate_only else theta_candidate_audit(args.theta_data),
            "generatorSha256": sha256(Path(__file__).read_bytes()).hexdigest()}
    if args.self_test:
        data["selfTests"] = certificate_self_tests(cert)
        if args.with_arb:
            data["selfTests"].extend(theta_witness_self_tests(data["thetaCertifiedWitness"]))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, separators=(",", ":"))+"\n")
    summary = {"output": str(args.output), "quartic": verify_quartic_certificate(cert),
               "thetaWitness": None if data["thetaCertifiedWitness"] is None else {k:data["thetaCertifiedWitness"][k] for k in ["certified","tauMin","tauMax","radius","margin"]},
               "theta": None if data["thetaCandidateAudit"] is None else {k:data["thetaCandidateAudit"][k] for k in ["certified","frameCount","momentBoundEstimate","branches"]}}
    if args.self_test:
        summary["selfTests"] = data["selfTests"]
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
