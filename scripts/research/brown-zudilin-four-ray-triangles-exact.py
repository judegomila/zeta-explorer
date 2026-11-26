#!/usr/bin/env python3
"""Exact Brown--Zudilin four-ray triangular-block certificate.

For

    T_n = {(v1,v2,v3,0,v5): v1+v3<n, v2+v5<n},

this script certifies the n=2,3,4,5 moment determinants and primitive Schur
forms.  It imports the formal HPL/MZV evaluator from the five-ray certificate;
there is no numerical reconstruction or PSLQ step.  Exact Q-linear algebra is
performed by python-flint.

The moment set is T_(2n-1).  The exact integrand is invariant under

    tau(v1,v2,v3,0,v5) = (v2,v1,v5,0,v3),

because tau exchanges the two normalized 3F2 factors.  Thus n=4 needs only
405 evaluations for its 783 nonzero moments, and n=5 needs 1034 for 2024.
Embedded SHA-256 digests and
modular residues make any arithmetic regression fail loudly.

Requirements: SymPy 1.14 and python-flint 0.9.  The default n=2,3,4 audit
takes about 25 seconds.  Use ``--max-n 5`` for the larger certificate and
``--cache PATH`` to reuse an exact gzip-JSON moment cache; the cache never
bypasses determinant/hash assertions.
"""

from __future__ import annotations

import argparse
import functools
import gzip
import hashlib
import importlib.util
import json
import math
from pathlib import Path
import time

from flint import fmpq, fmpq_mat, nmod_mat


HERE = Path(__file__).resolve().parent
PRIMES = (1_000_000_007, 1_000_000_009, 1_000_000_021)
CAPACITY = 2 * math.log(2 * math.e)

# (det hash, Schur hash, row-delta hash, direct-L hash, primitive-c hash,
#  modular determinant residues)
EXPECTED = {
    2: (
        "baf6c8f4a6f53ee6dc2a89e49afc1bb23d3daed2c3d2a7319c6d95be2d6fb66e",
        "acc444d83e1de04ad8001541c9864544fe2e423d49d3172b29323055e98f3531",
        "3a51d5e2b87c5e871b3c002888064aa7ac269c85fbcd89b952f20fa3346e2b35",
        "fa9da6ff3c8c341fe1c0c6768d601be4da4d08b6ca403dab0dff6b2a49a48746",
        "33af8fc37875aab8b7b8d2cf40b0b8a018879782256a254969835ff0fbb02204",
        (231_413_314, 351_117_004, 154_736_369),
    ),
    3: (
        "63c16b2873729d4042122060ac1d4e9fbd646028e32374bf9e54c96b30fd67f2",
        "b8015724a19ea0d4c59ddfd1502ccae1b724a29592535785cd9f0462bb49dcfa",
        "d11ec40950100daa68f571b9a957850f776e14d745ef3bb94742daa2a4d245b8",
        "19ee407c036020d283cac041f61e166f184bcc2223a3880504cdd2a46dd87261",
        "0ce1986ea9037b4c9bf1bc497d5f41225a85504fbadad7b32cbbf9c33203bd23",
        (239_128_737, 830_968_919, 117_550_105),
    ),
    4: (
        "a775891e3ae273cd1b84f3a6de8a85011b435111b77cf7f9e875561d7cafd513",
        "bf9138f7ecf31b2e6009d7a7e2b7e33706c9de7fdb5458aefb65f5b7fe1ea056",
        "0046de183d473058c3fe5bff708e8278c16ad72af215a342dc9402d1977ea33d",
        "fa927dbb74b1295c732d24faba9f47a91e94280c85018a03a26e38cbb3c0f9d6",
        "476f2829b3984c796ec53bbd851293b31cb2ad28abed1167a30ff5deebc69c0d",
        (280_782_739, 723_415_606, 3_018_075),
    ),
    5: (
        "ba19f385f087ce09be2bdd60c963dbdb34fe92ad5fd2ed50dbe936b957934fa7",
        "f4f794bfa5c058f184ed19345af97e992eee15e1c4c1cb0fa24a46cde4ba8386",
        "c73b909da2b9b86d99f9b1b41f336fec750ae6a32f20e169be46990e168cd754",
        "843de4dd8f0c1f4ebf5f50d060539f5bff56f6699a81b2267d4be7c563ed00de",
        "299f90f51f4da44b29c2a5dd7a912c1b997297357ac39ca3c6bc691df53bdb8e",
        (558_746_125, 998_424_881, 52_768_308),
    ),
}


def certificate_path():
    candidates = (
        HERE / "brown_zudilin_five_ray_moments_exact.py",
        HERE / "brown-zudilin-five-ray-moments-exact.py",
    )
    for path in candidates:
        if path.exists():
            return path
    raise FileNotFoundError("cannot locate the five-ray exact moment evaluator")


def load_moment_certificate():
    path = certificate_path()
    spec = importlib.util.spec_from_file_location("brown_zudilin_moments", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    # Only 28 distinct factors occur at n=4 on each side, versus 783 products.
    module.x_hyper = functools.lru_cache(maxsize=None)(module.x_hyper)
    return module


def triangle(n):
    return [(a, b) for a in range(n) for b in range(n - a)]


def four_ray(left, right):
    """Encode left=(v1,v3), right=(v2,v5)."""
    return (left[0], right[0], left[1], 0, right[1])


def split(v):
    return (v[0], v[2]), (v[1], v[4])


def tau(v):
    left, right = split(v)
    return four_ray(right, left)


def add(left, right):
    return tuple(a + b for a, b in zip(left, right))


def block_indices(n):
    pairs = triangle(n)
    return [four_ray(left, right) for left in pairs for right in pairs]


def required_moment_indices(n):
    pairs = triangle(2 * n - 1)
    return [four_ray(left, right) for left in pairs for right in pairs]


def cache_key(v):
    return ",".join(map(str, v))


def parse_cache_key(encoded):
    return tuple(map(int, encoded.split(",")))


def load_cache(path):
    if path is None or not path.exists():
        return {}
    with gzip.open(path, "rt", encoding="utf-8") as handle:
        payload = json.load(handle)
    moments = {}
    for encoded, fraction in payload.items():
        numerator, denominator = fraction.split("/")
        moments[parse_cache_key(encoded)] = fmpq(int(numerator), int(denominator))
    return moments


def save_cache(path, moments):
    if path is None:
        return
    payload = {
        cache_key(v): f"{value.p}/{value.q}" for v, value in sorted(moments.items())
    }
    with gzip.open(path, "wt", encoding="utf-8", compresslevel=6) as handle:
        json.dump(payload, handle, separators=(",", ":"), sort_keys=True)


def compute_moments(max_n, cache_path=None):
    zero = (0, 0, 0, 0, 0)
    required = [v for v in required_moment_indices(max_n) if v != zero]
    representatives = sorted({min(v, tau(v)) for v in required})
    moments = load_cache(cache_path)
    missing = [v for v in representatives if v not in moments]
    started = time.perf_counter()
    if missing:
        evaluator = load_moment_certificate()
        for count, v in enumerate(missing, 1):
            value = evaluator.projected_rational_moment(v)
            rational = fmpq(int(value.p), int(value.q))
            moments[v] = rational
            moments[tau(v)] = rational
            if cache_path is not None and count % 50 == 0:
                save_cache(cache_path, moments)
        save_cache(cache_path, moments)
    seconds = time.perf_counter() - started
    assert all(v in moments for v in required)
    print(
        f"exact moments through n={max_n}: nonzero={len(required)}, "
        f"symmetry representatives={len(representatives)}, "
        f"new={len(missing)}, seconds={seconds:.3f}"
    )
    return moments


def build_tail(n, moments):
    zero = (0, 0, 0, 0, 0)
    full = block_indices(n)
    tail = [v for v in full if v != zero]
    matrix = fmpq_mat([[moments[add(a, b)] for b in tail] for a in tail])
    vector = fmpq_mat([[moments[v]] for v in tail])
    return full, tail, matrix, vector


def rational_hash(value):
    return hashlib.sha256(f"{value.p}/{value.q}".encode("ascii")).hexdigest()


def integer_hash(value):
    return hashlib.sha256(str(value).encode("ascii")).hexdigest()


def log_integer(value):
    return math.log(abs(int(value)))


def log_rational(numerator, denominator=1):
    return log_integer(numerator) - log_integer(denominator)


def normalizations(full, moments, determinant, schur):
    """Return row/column delta, direct L, and primitive multiplier c."""
    zero = (0, 0, 0, 0, 0)

    def coefficient(left, right):
        if left == zero and right == zero:
            return fmpq(1)
        return moments[add(left, right)]

    row_lcms = []
    for left in full:
        row_lcm = 1
        for right in full:
            row_lcm = math.lcm(row_lcm, int(coefficient(left, right).q))
        row_lcms.append(row_lcm)

    column_gcds = []
    for right in full:
        column_gcd = 0
        for row, left in enumerate(full):
            value = coefficient(left, right)
            integer = abs(int(value.p) * (row_lcms[row] // int(value.q)))
            column_gcd = math.gcd(column_gcd, integer)
        assert column_gcd
        column_gcds.append(column_gcd)

    delta_num = math.prod(row_lcms)
    delta_den = math.prod(column_gcds)
    common = math.gcd(delta_num, delta_den)
    delta_num, delta_den = delta_num // common, delta_den // common

    # det(M)=det(R)*zeta(5)-det(R)*s.  L is the least positive integer
    # clearing the two coefficient denominators before content removal.
    constant = -determinant * schur
    direct_lcm = math.lcm(int(determinant.q), int(constant.q))
    zeta_integer = int(determinant.p) * (direct_lcm // int(determinant.q))
    constant_integer = int(constant.p) * (direct_lcm // int(constant.q))
    content = math.gcd(abs(zeta_integer), abs(constant_integer))
    primitive_num, primitive_den = direct_lcm, content
    common = math.gcd(primitive_num, primitive_den)
    primitive_num //= common
    primitive_den //= common

    # Cross-check the closed Schur formula c=bq/|a| for det(R)=a/b, s=p/q.
    formula_num = int(determinant.q) * int(schur.q)
    formula_den = abs(int(determinant.p))
    common = math.gcd(formula_num, formula_den)
    formula_num, formula_den = formula_num // common, formula_den // common
    assert (primitive_num, primitive_den) == (formula_num, formula_den)
    return (
        (delta_num, delta_den),
        direct_lcm,
        content,
        (primitive_num, primitive_den),
    )


def modular_determinant(matrix, prime):
    rows = []
    for row in matrix.tolist():
        reduced = []
        for value in row:
            numerator, denominator = int(value.p), int(value.q)
            assert denominator % prime
            reduced.append(
                (numerator % prime) * pow(denominator % prime, -1, prime) % prime
            )
        rows.append(reduced)
    return int(nmod_mat(rows, prime).det())


def audit(n, moments):
    full, tail, matrix, vector = build_tail(n, moments)
    N = len(full)
    e_degree = n * n * (n - 1) * (n + 1) * (n + 1) // 3
    assert N == (n * (n + 1) // 2) ** 2
    assert e_degree == sum(sum(v) for v in full)

    determinant = matrix.det()
    assert determinant
    schur = (vector.transpose() * matrix.solve(vector))[0, 0]
    residues = tuple(modular_determinant(matrix, prime) for prime in PRIMES)

    # Since zeta(5) is larger than its first twenty positive terms, this exact
    # rational comparison proves the full determinant is nonzero.
    zeta5_lower = sum((fmpq(1, k**5) for k in range(1, 21)), fmpq(0))
    assert schur < zeta5_lower

    delta, direct_lcm, content, primitive = normalizations(
        full, moments, determinant, schur
    )
    delta_num, delta_den = delta
    primitive_num, primitive_den = primitive

    hashes = (
        rational_hash(determinant),
        rational_hash(schur),
        rational_hash(fmpq(delta_num, delta_den)),
        integer_hash(direct_lcm),
        rational_hash(fmpq(primitive_num, primitive_den)),
        residues,
    )
    assert hashes == EXPECTED[n]

    row_rate = log_rational(delta_num, delta_den) / e_degree
    direct_rate = log_integer(direct_lcm) / e_degree
    primitive_rate = log_rational(primitive_num, primitive_den) / e_degree
    tail_decay_rate = -log_rational(int(determinant.p), int(determinant.q)) / e_degree
    q_rate = log_integer(int(schur.q)) / e_degree
    assert abs(primitive_rate - tail_decay_rate - q_rate) < 1e-12
    assert primitive_rate < CAPACITY

    print()
    print(f"T_{n}: N={N}, tail={len(tail)}, e={e_degree}")
    print(
        f"det(R): sign={1 if determinant > 0 else -1}, "
        f"num_bits={abs(int(determinant.p)).bit_length()}, "
        f"den_bits={int(determinant.q).bit_length()}, "
        f"sha256={hashes[0]}"
    )
    print(f"det(R) mod {PRIMES}: {residues}")
    print(f"Schur p/q={schur}")
    print(
        "full determinant: nonzero because "
        f"Schur < sum_(k=1)^20 k^-5 = {zeta5_lower} < zeta(5)"
    )
    print(
        f"row/column delta: num_bits={delta_num.bit_length()}, "
        f"den_bits={delta_den.bit_length()}, rate={row_rate:.15g}"
    )
    print(
        f"direct determinant L: bits={direct_lcm.bit_length()}, "
        f"rate={direct_rate:.15g}"
    )
    print(
        f"primitive content: bits={content.bit_length()}; "
        f"c num_bits={primitive_num.bit_length()}, "
        f"den_bits={primitive_den.bit_length()}, rate={primitive_rate:.15g}"
    )
    print(
        "primitive decomposition: "
        f"-log|det(R)|/e={tail_decay_rate:.15g}, "
        f"log(q)/e={q_rate:.15g}"
    )
    print(
        f"capacity B=2*log(2*e)={CAPACITY:.15g}; "
        f"finite primitive margin={CAPACITY-primitive_rate:.15g}"
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument(
        "--n",
        type=int,
        choices=(2, 3, 4, 5),
        help="audit one block",
    )
    selection.add_argument(
        "--max-n",
        type=int,
        choices=(2, 3, 4, 5),
        help="audit every block from n=2 through this value",
    )
    parser.add_argument(
        "--cache",
        type=Path,
        help="optional gzip-JSON exact-moment cache (read and update)",
    )
    args = parser.parse_args()
    if args.n:
        selected = (args.n,)
    else:
        selected = tuple(range(2, (args.max_n or 4) + 1))
    moments = compute_moments(max(selected), args.cache)
    for n in selected:
        audit(n, moments)


if __name__ == "__main__":
    main()
