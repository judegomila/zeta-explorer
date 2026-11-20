#!/usr/bin/env python3
"""Rigorous symmetric-zero cages and polygon winding certificates for xi.

The certificate proposes rational geometry; verification recomputes all analytic
enclosures with python-flint/Arb and all polygon winding arithmetic with Fraction.
Numeric zero locations are used by generation only, never by verification.
"""
from __future__ import annotations

import argparse
from fractions import Fraction as Q
import gzip
import hashlib
import json
from pathlib import Path
import sys
import time

HERE = Path(__file__).resolve().parent
if (HERE / "vendor").exists():
    sys.path.insert(0, str(HERE / "vendor"))
import flint
from flint import acb, acb_series, arb, ctx, fmpq

PREC = 160
ctx.prec = PREC
ctx.cap = 3
PI = arb.pi()
LOG_PI = PI.log()
I = acb(0, 1)


def aq(q):
    q = Q(q)
    return arb(fmpq(q.numerator, q.denominator))


def cq(p):
    return acb(aq(p[0]), aq(p[1]))


def qs(q):
    return str(Q(q))


def pjson(p):
    return [qs(p[0]), qs(p[1])]


def parse_point(p):
    if not isinstance(p, list) or len(p) != 2:
        raise ValueError("A point must have two rational coordinates")
    out = tuple(Q(x) for x in p)
    for x in out:
        if x.denominator & (x.denominator - 1):
            raise ValueError("Certificate geometry and image vertices must be dyadic")
    return out


def exact_mid(x):
    m, e = x.mid().man_exp()
    return Q(int(m)) * (Q(2) ** int(e))


def image_point(v):
    return (exact_mid(v.real), exact_mid(v.imag))


def scaled_xi(z):
    """G(z)=exp(pi*z/4)*xi(1/2+i*z), preserving zeros and real symmetry.

    Use Gamma(1+s/2) and deflated zeta so s=0,1 are removable without
    multiplying an infinite enclosure by zero. Our boxes stay Re(s)>-2.
    """
    s = aq(Q(1, 2)) + I * z
    if isinstance(s, acb_series):
        zd = s.zeta(deflate=True)
    else:
        zd = acb_series([s], prec=1).zeta(deflate=True)[0]
    return (1 + s / 2).gamma() * (-s * LOG_PI / 2 + PI * z / 4).exp() * (1 + (s - 1) * zd)


def off_axis_control(z):
    # Four simple zeros +/-3 +/- i/8, in two conjugation-invariant cages.
    return ((z - 3) ** 2 + aq(Q(1, 64))) * ((z + 3) ** 2 + aq(Q(1, 64)))


def xi_quartet(z):
    # Deliberate analytic perturbation, not the actual xi function.
    eta2 = aq(Q(1, 16))
    q = (((z - 200) ** 2 + eta2) * ((z + 200) ** 2 + eta2)
         / aq((Q(200 * 200) + Q(1, 16)) ** 2))
    return scaled_xi(z) * q


FUNCS = {"scaled_xi": scaled_xi, "off_axis_control": off_axis_control,
         "xi_quartet": xi_quartet}


def write_payload(path, payload):
    """Write JSON bytes unchanged, or deterministic gzip selected by suffix."""
    path = Path(path)
    if path.suffix == ".gz":
        path.write_bytes(gzip.compress(payload, compresslevel=9, mtime=0))
    else:
        path.write_bytes(payload)


def read_payload(path):
    """Read JSON or .json.gz while preserving exact uncompressed bytes."""
    path = Path(path)
    artifact = path.read_bytes()
    payload = gzip.decompress(artifact) if path.suffix == ".gz" else artifact
    return payload, artifact


def edge_box(a, b):
    return acb(arb(aq((a[0] + b[0]) / 2), aq(abs(a[0] - b[0]) / 2)),
               arb(aq((a[1] + b[1]) / 2), aq(abs(a[1] - b[1]) / 2)))


def enclose_edge(fun, a, b, method):
    box = edge_box(a, b)
    if method == "direct":
        return fun(box)
    if method == "centered_derivative":
        m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        delta = acb(arb(0, aq(abs(a[0] - b[0]) / 2)),
                    arb(0, aq(abs(a[1] - b[1]) / 2)))
        derivative = fun(acb_series([box, 1], prec=2))[1]
        # Integral Taylor formula: derivative over the entire convex edge.
        return fun(cq(m)) + delta * derivative
    raise ValueError("Unsupported edge enclosure method")


def hull(v, p, q):
    return acb(v.real.union(aq(p[0])).union(aq(q[0])),
               v.imag.union(aq(p[1])).union(aq(q[1])))


def winding(poly):
    n = 0
    for p, q in zip(poly, poly[1:] + poly[:1]):
        det = p[0] * q[1] - q[0] * p[1]
        if p[1] <= 0 < q[1] and det > 0:
            n += 1
        elif q[1] <= 0 < p[1] and det < 0:
            n -= 1
    return n


def rectangle_corners(rect):
    xmin, xmax, ymin, ymax = [Q(x) for x in rect]
    assert xmin < xmax and ymin < ymax
    return [(xmin, ymin), (xmax, ymin), (xmax, ymax), (xmin, ymax)]


def validate_rectangle_path(nodes, rect):
    xmin, xmax, ymin, ymax = [Q(x) for x in rect]
    if not nodes or nodes[0] != (xmin, ymin):
        raise ValueError("Boundary does not start at lower left corner")
    sides = []
    for a, b in zip(nodes, nodes[1:] + nodes[:1]):
        if a == b:
            raise ValueError("Repeated boundary vertex")
        if a[1] == b[1] == ymin and xmin <= a[0] < b[0] <= xmax:
            side = 0
        elif a[0] == b[0] == xmax and ymin <= a[1] < b[1] <= ymax:
            side = 1
        elif a[1] == b[1] == ymax and xmax >= a[0] > b[0] >= xmin:
            side = 2
        elif a[0] == b[0] == xmin and ymax >= a[1] > b[1] >= ymin:
            side = 3
        else:
            raise ValueError("An edge does not follow the rectangle counterclockwise")
        sides.append(side)
    if sides[0] != 0 or sides[-1] != 3 or set(sides) != {0, 1, 2, 3}:
        raise ValueError("Missing rectangle side")
    if any(b < a or b > a + 1 for a, b in zip(sides, sides[1:])):
        raise ValueError("Rectangle sides occur out of order")


def generate_boundary(name, rect, label):
    fun = FUNCS[name]
    points = {}
    accepted = []
    calls = 0
    def proposed_image(p):
        if p not in points:
            points[p] = image_point(fun(cq(p)))
        return points[p]
    def split(a, b, depth=0):
        nonlocal calls
        if depth > 30:
            raise RuntimeError(f"Enclosure failed to separate boundary from zero: {a}, {b}")
        # Avoid very large analytic input balls; do not decide from samples.
        if max(abs(a[0] - b[0]), abs(a[1] - b[1])) <= Q(1, 4):
            p, q = proposed_image(a), proposed_image(b)
            for method in ["direct", "centered_derivative"]:
                calls += 1
                v = enclose_edge(fun, a, b, method)
                if v.is_finite() and not hull(v, p, q).contains(0):
                    accepted.append((a, p, method))
                    return
        m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        split(a, m, depth + 1)
        split(m, b, depth + 1)
    corners = rectangle_corners(rect)
    started = time.perf_counter()
    for a, b in zip(corners, corners[1:] + corners[:1]):
        split(a, b)
    nodes = [x[0] for x in accepted]
    poly = [x[1] for x in accepted]
    validate_rectangle_path(nodes, rect)
    result = {
        "label": label, "function": name, "rectangle": [qs(x) for x in rect],
        "nodes": [pjson(x) for x in nodes], "image_polygon": [pjson(x) for x in poly],
        "methods": [x[2] for x in accepted], "claimed_winding": winding(poly),
        "generation": {"segments": len(accepted), "enclosure_attempts": calls,
                       "seconds": round(time.perf_counter() - started, 3)},
    }
    print(f"Generated {label}: winding={result['claimed_winding']}, segments={len(accepted)}, seconds={result['generation']['seconds']}", flush=True)
    return result


def verify_boundary(cert):
    name = cert["function"]
    if name not in FUNCS:
        raise ValueError("Unknown function")
    nodes = [parse_point(p) for p in cert["nodes"]]
    poly = [parse_point(p) for p in cert["image_polygon"]]
    methods = cert["methods"]
    if not (len(nodes) == len(poly) == len(methods)):
        raise ValueError("Boundary arrays have different lengths")
    validate_rectangle_path(nodes, cert["rectangle"])
    for j, (a, b) in enumerate(zip(nodes, nodes[1:] + nodes[:1])):
        v = enclose_edge(FUNCS[name], a, b, methods[j])
        if not v.is_finite() or hull(v, poly[j], poly[(j + 1) % len(poly)]).contains(0):
            raise ValueError(f"Edge {j} does not certify a homotopy avoiding zero")
    count = winding(poly)
    if count != cert["claimed_winding"]:
        raise ValueError("Winding claim disagrees with exact rational calculation")
    return count


def cage_quantities(center, radius):
    z = cq((center, Q(0)))
    pt = scaled_xi(acb_series([z, 1], prec=2))
    square = acb(arb(aq(center), aq(radius)), arb(0, aq(radius)))
    jets = scaled_xi(acb_series([square, 1], prec=3))
    f0_upper = pt[0].abs_upper()
    f1_lower = pt[1].abs_lower()
    f2_upper = (2 * jets[2]).abs_upper()
    lhs = f0_upper + aq(radius * radius / 2) * f2_upper
    rhs = aq(radius) * f1_lower
    return lhs, rhs, f0_upper, f1_lower, f2_upper


def generate_cage(n):
    # Proposal only. No verifier call to zeta_zero / zeta_zeros is made.
    proposed_height = acb.zeta_zero(n).imag
    center = Q(round(float(proposed_height) * (2 ** 40)), 2 ** 40)
    for k in range(6, 25):
        radius = Q(1, 2 ** k)
        lhs, rhs, f0, f1, f2 = cage_quantities(center, radius)
        if lhs < rhs:
            return {"label": f"candidate_{n}", "function": "scaled_xi",
                    "center": qs(center), "radius": qs(radius),
                    "claimed_winding": 1,
                    "display_only": {"center_decimal": float(center),
                        "radius_decimal": float(radius), "lhs_upper": str(lhs.upper()),
                        "rhs_lower": str(rhs.lower()), "f0_upper": str(f0),
                        "f1_lower": str(f1), "f2_upper": str(f2)}}
    raise RuntimeError(f"No Rouche cage verified for candidate {n}")


def verify_cage(cage):
    if cage["function"] != "scaled_xi" or cage["claimed_winding"] != 1:
        raise ValueError("Unsupported cage claim")
    center, radius = Q(cage["center"]), Q(cage["radius"])
    parse_point([qs(center), qs(radius)])
    if radius <= 0:
        raise ValueError("Nonpositive radius")
    lhs, rhs, *_ = cage_quantities(center, radius)
    if not lhs < rhs:
        raise ValueError("Rouche inequality has not been proved")
    return center, radius


def verify_cover(band, cages):
    xmin, xmax, ymin, ymax = [Q(x) for x in band["rectangle"]]
    if band["function"] != "scaled_xi":
        raise ValueError("A zeta cover requires the scaled xi function")
    pairs = sorted(verify_cage(c) for c in cages)
    for c, r in pairs:
        if not (xmin < c - r and c + r < xmax and ymin < -r and r < ymax):
            raise ValueError("A cage is not strictly inside its band")
    for (c1, r1), (c2, r2) in zip(pairs, pairs[1:]):
        if not c1 + r1 < c2 - r2:
            raise ValueError("Cages are not disjoint")
    count = verify_boundary(band)
    if count != len(pairs):
        raise ValueError("Cage counts do not exhaust the band winding")
    return count


def generate(output):
    started = time.perf_counter()
    low_cages = [generate_cage(n) for n in range(1, 51)]
    print("Generated 50 independent symmetric Rouche cages", flush=True)
    low_band = generate_boundary("scaled_xi", [0, 144, Q(-1, 2), Q(1, 2)], "positive_height_0_to_144")
    pair_cages = [generate_cage(n) for n in [6709, 6710]]
    pair_band = generate_boundary("scaled_xi", [Q(56040, 8), Q(56041, 8), Q(-1, 2), Q(1, 2)], "close_pair_7005_to_7005_125")
    neg = generate_boundary("off_axis_control", [Q(11, 4), Q(13, 4), Q(-1, 4), Q(1, 4)], "off_axis_pair_control")
    all_neg = generate_boundary("off_axis_control", [-4, 4, Q(-1, 2), Q(1, 2)], "off_axis_quartet_control")
    perturbation_rect = [Q(1599, 8), Q(1601, 8), Q(-3, 8), Q(3, 8)]
    original = generate_boundary("scaled_xi", perturbation_rect, "original_xi_near_200")
    perturbed = generate_boundary("xi_quartet", perturbation_rect, "xi_with_inserted_off_axis_pair")
    data = {"schema": "xi-topology-certificates-v1", "precision_bits": PREC,
            "python_flint_version": flint.__version__,
            "flint_version": flint.__FLINT_VERSION__,
            "function_identity": "G(z)=exp(pi*z/4)*xi(1/2+i*z)",
            "covers": [{"band": low_band, "cages": low_cages},
                       {"band": pair_band, "cages": pair_cages}],
            "negative_controls": [neg, all_neg],
            "perturbation_control": {"original": original, "modified": perturbed,
                                     "claimed_count_difference": 2},
            "generation_seconds": round(time.perf_counter() - started, 3),
            "scope": "Bounded regions only. This is not a proof of RH or a new zero-free strip."}
    write_payload(output, (json.dumps(data, indent=2) + "\n").encode("utf-8"))
    print(f"Wrote {output} ({output.stat().st_size} bytes)", flush=True)


def verify(path, report_path=None):
    started = time.perf_counter()
    payload, artifact = read_payload(path)
    data = json.loads(payload)
    if data["schema"] != "xi-topology-certificates-v1":
        raise ValueError("Unsupported certificate schema")
    if data["precision_bits"] != PREC:
        raise ValueError("Unexpected analytic precision")
    covers = []
    for cover in data["covers"]:
        count = verify_cover(cover["band"], cover["cages"])
        entry = {"label": cover["band"]["label"], "rectangle": cover["band"]["rectangle"],
                 "certified_total_zeros": count, "certified_real_simple_zeros": count,
                 "certified_other_zeros": 0, "boundary_segments": len(cover["band"]["nodes"])}
        covers.append(entry)
        print("Verified", json.dumps(entry), flush=True)
    controls = []
    for control in data["negative_controls"]:
        count = verify_boundary(control)
        expected = 2 if control["label"] == "off_axis_pair_control" else 4
        if count != expected:
            raise ValueError("Negative control count failed")
        unit_claim_rejected = False
        try:
            verify_boundary({**control, "claimed_winding": 1})
        except ValueError as exc:
            unit_claim_rejected = "Winding claim disagrees" in str(exc)
        if not unit_claim_rejected:
            raise ValueError("The verifier accepted a deliberately false unit-winding claim")
        controls.append({"label": control["label"], "certified_winding": count,
                         "unit_cage_claim_rejected": unit_claim_rejected})
        print("Verified negative control", controls[-1], flush=True)
    perturbation = data["perturbation_control"]
    original, modified = perturbation["original"], perturbation["modified"]
    if (original["function"] != "scaled_xi" or modified["function"] != "xi_quartet"
            or original["rectangle"] != modified["rectangle"]):
        raise ValueError("Malformed perturbation comparison")
    before, after = verify_boundary(original), verify_boundary(modified)
    if after - before != 2 or perturbation["claimed_count_difference"] != 2:
        raise ValueError("Inserted quartet control did not add two zeros in this band")
    perturbation_report = {"rectangle": original["rectangle"], "original_count": before,
                           "modified_count": after, "certified_difference": after - before,
                           "inserted_pair": ["200+i/4", "200-i/4"]}
    print("Verified analytic perturbation", perturbation_report, flush=True)
    report = {"verified": True, "certificate_sha256": hashlib.sha256(payload).hexdigest(),
              "artifact_filename": path.name,
              "artifact_sha256": hashlib.sha256(artifact).hexdigest(),
              "certificate_encoding": "gzip" if path.suffix == ".gz" else "json",
              "python_flint_version": flint.__version__, "precision_bits": PREC,
              "flint_version": flint.__FLINT_VERSION__,
              "covers": covers, "negative_controls": controls,
              "perturbation_control": perturbation_report,
              "verification_seconds": round(time.perf_counter() - started, 3),
              "limitations": ["Finite bands only; no all-height theorem.",
                  "No claim of polynomial certificate size or generation time.",
                  "Trusted numerical base: python-flint / FLINT / Arb and Python exact integer arithmetic.",
                  "The verifier does not use precomputed zero indices or locations as evidence."]}
    if report_path:
        report_path.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2), flush=True)
    return report


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("mode", choices=["generate", "verify"])
    ap.add_argument("--certificate", type=Path, default=HERE / "certificates.json.gz")
    ap.add_argument("--report", type=Path, default=HERE / "verification_report.json")
    args = ap.parse_args()
    if args.mode == "generate":
        generate(args.certificate)
    else:
        verify(args.certificate, args.report)


if __name__ == "__main__":
    main()
