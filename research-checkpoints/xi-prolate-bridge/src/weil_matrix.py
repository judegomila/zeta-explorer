#!/usr/bin/env python3
"""Source-derived finite Weil matrix (diagnostic arbitrary precision path).

Binding source: CCM, arXiv:2511.22755v1, (2.6), (2.9)--(2.10),
(3.13)--(3.16), (4.1)--(4.4).  No zero table or stored matrix is used.
"""
from __future__ import annotations

import json
from fractions import Fraction
from pathlib import Path
import mpmath as mp


def parse_decimal(s: str) -> mp.mpf:
    if not isinstance(s, str):
        raise TypeError("decimal parameters must be strings (binary64 is forbidden)")
    try:
        Fraction(s)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal parameter") from exc
    return mp.mpf(s)


def decimal_square_floor(s: str) -> int:
    """Return floor(s^2) from the exact decimal text, without mp rounding."""
    if not isinstance(s, str):
        raise TypeError("decimal parameters must be strings (binary64 is forbidden)")
    try:
        value = Fraction(s)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal parameter") from exc
    square = value * value
    return square.numerator // square.denominator


def decimal_square_ceil(s: str) -> int:
    """Return ceil(s^2) from the exact decimal text, without mp rounding."""
    if not isinstance(s, str):
        raise TypeError("decimal parameters must be strings (binary64 is forbidden)")
    try:
        value = Fraction(s)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal parameter") from exc
    square = value * value
    return -(-square.numerator // square.denominator)


def require_source_normalization(label: str) -> None:
    if label != "source_limit_h":
        raise ValueError("prolate normalization must be fixed by h_lambda -> h; unit norm is rejected")


def q_kernel(n: int, m: int, x: mp.mpf, L: mp.mpf) -> mp.mpf:
    if n == m:
        return 2 * (1-x/L) * mp.cos(2*mp.pi*n*x/L)
    return (mp.sin(2*mp.pi*m*x/L)-mp.sin(2*mp.pi*n*x/L))/(mp.pi*(n-m))


def von_mangoldt_terms(bound: int) -> list[tuple[int, mp.mpf]]:
    """All and only prime powers 1 < n <= bound, represented once."""
    out = []
    for n in range(2, bound+1):
        p = None
        t = n
        d = 2
        while d*d <= t:
            if t % d == 0:
                p = d
                while t % d == 0:
                    t //= d
                break
            d += 1
        if p is None:
            p = n
            t = 1
        if t == 1:
            # Ensure n has no prime divisor other than p.
            z = n
            while z % p == 0:
                z //= p
            if z == 1:
                out.append((n, mp.log(p)))
    return out


def blocks_direct(lambda_text: str, N: int, dps: int):
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam <= 1 or N < 0:
        raise ValueError("require lambda>1 and N>=0")
    L = 2*mp.log(lam)
    # Exact integer cutoff from the decimal source parameter, not mp rounding.
    bound = decimal_square_floor(lambda_text)
    modes = list(range(-N, N+1))
    pole = mp.matrix(len(modes)); arch = mp.matrix(len(modes)); prime = mp.matrix(len(modes))
    terms = von_mangoldt_terms(bound)
    for i,n in enumerate(modes):
        for j,m in enumerate(modes):
            w_pole = mp.quad(lambda x: q_kernel(n,m,x,L)*(mp.e**(x/2)+mp.e**(-x/2)), [0,L])
            omega0 = q_kernel(n,m,mp.mpf('0'),L)
            wR = (mp.euler+mp.log(4*mp.pi))*omega0/2
            # (3.15), with the removable x=0 singularity evaluated by a split.
            eps = mp.power(10, -(dps//2))
            f = lambda x: (mp.e**(x/2)*q_kernel(n,m,x,L)-q_kernel(n,m,mp.mpf('0'),L))/(mp.e**x-mp.e**(-x))
            wR += mp.quad(f, [eps, L]) + f(eps)*eps
            # F is zero beyond exp(L), but the subtraction in (3.15) remains.
            wR -= omega0/2*mp.log((mp.e**L+1)/(mp.e**L-1))
            wp = mp.fsum(vk/mp.sqrt(k)*q_kernel(n,m,mp.log(k),L) for k,vk in terms)
            pole[i,j], arch[i,j], prime[i,j] = w_pole, wR, wp
    return modes, terms, pole, arch, prime, pole-arch-prime


def blocks_split(lambda_text: str, N: int, dps: int):
    """Independent assembly: closed pole (4.2), arch (4.4), prime (4.3)."""
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text); L=2*mp.log(lam); bound=decimal_square_floor(lambda_text)
    modes=list(range(-N,N+1)); terms=von_mangoldt_terms(bound)
    pole=mp.matrix(len(modes)); arch=mp.matrix(len(modes)); prime=mp.matrix(len(modes))
    for i,n in enumerate(modes):
        for j,m in enumerate(modes):
            pole[i,j] = 32*L*mp.sinh(L/4)**2*(L**2-16*mp.pi**2*m*n)/((L**2+16*mp.pi**2*m*m)*(L**2+16*mp.pi**2*n*n))
            w0=q_kernel(n,m,mp.mpf('0'),L)
            constant=w0/2*(mp.euler+mp.log(4*mp.pi*(mp.e**L-1)/(mp.e**L+1)))
            eps=mp.power(10, -(dps//2))
            f=lambda x: (mp.e**(x/2)*q_kernel(n,m,x,L)-w0)/(mp.e**x-mp.e**(-x))
            arch[i,j]=constant+mp.quad(f,[eps,L])+f(eps)*eps
            prime[i,j]=mp.fsum(vk/mp.sqrt(k)*q_kernel(n,m,mp.log(k),L) for k,vk in terms)
    return modes,terms,pole,arch,prime,pole-arch-prime


def inversion(N: int):
    d=2*N+1; J=mp.matrix(d)
    for i in range(d): J[i,d-1-i]=1
    return J


def max_abs(A):
    return max(abs(A[i,j]) for i in range(A.rows) for j in range(A.cols))


def serialize_matrix(A, digits: int):
    return [[mp.nstr(A[i,j], digits) for j in range(A.cols)] for i in range(A.rows)]


def pilot(lambda_text: str, N: int, dps: int) -> dict:
    a=blocks_direct(lambda_text,N,dps); b=blocks_split(lambda_text,N,dps)
    Q=a[-1]; J=inversion(N)
    return {"status":"FINITE_DIAGNOSTIC_ONLY", "lambda":lambda_text, "N":N, "dps":dps,
            "prime_power_terms":[{"n":n,"Lambda":mp.nstr(v,dps)} for n,v in a[1]],
            "path_disagreement_max_abs":mp.nstr(max_abs(Q-b[-1]),dps),
            "hermitian_defect_max_abs":mp.nstr(max_abs(Q-Q.T),dps),
            "inversion_commutator_max_abs":mp.nstr(max_abs(Q*J-J*Q),dps),
            "Q":serialize_matrix(Q,dps)}


if __name__ == "__main__":
    import argparse
    p=argparse.ArgumentParser(); p.add_argument("--lambda",dest="lam",required=True); p.add_argument("--N",type=int,required=True); p.add_argument("--dps",type=int,default=50); p.add_argument("--output",type=Path)
    a=p.parse_args(); result=pilot(a.lam,a.N,a.dps); text=json.dumps(result,indent=2)+"\n"
    if a.output: a.output.write_text(text)
    print(text,end="")
