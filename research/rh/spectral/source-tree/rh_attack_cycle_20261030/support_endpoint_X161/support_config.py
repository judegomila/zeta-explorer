#!/usr/bin/env python3
"""Exact fixed support configuration; never approximate X or share stale phases."""
from pathlib import Path
from fractions import Fraction as Q
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
X=Q(161,10)
N=2048
J=16384
L=36
BITS=1000
TOLERANCE_BITS=950
MIN_CACHE_BITS=900
CACHE_DIGITS=350
PRIME_ENVELOPE=Q(3805113,1000000)
PRIME_RECEIPT=ROOT/'rh_attack_cycle_20261030/support_endpoint_next_feasibility/X161_POWER7_FEASIBILITY.json'
PRIME_ENUMERATOR=ROOT/'rh_attack_cycle_20261030/support_endpoint_next_feasibility/X161_power7.py'
ACTUAL_HEAD_SOURCE=ROOT/'rh_attack_cycle_20261030/support_endpoint_continuity/generic_actual_head_pilot.py'
assert Q(16)<X<Q(17)
