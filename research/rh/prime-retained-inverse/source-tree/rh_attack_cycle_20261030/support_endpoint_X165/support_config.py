#!/usr/bin/env python3
"""One exact fresh support; no phase/moment cache from any older endpoint."""
from pathlib import Path
from fractions import Fraction as Q
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
X=Q(33,2)
N=2048
J=16384
L=36
BITS=1000
PRIME_ENVELOPE=Q(477513,125000) # 3.820104, outward rational envelope
PRIME_RECEIPT=HERE/'X165_POWER8_TARGETED.json'
PRIME_ENUMERATOR=HERE/'X165_power8_targeted.py'
ACTUAL_HEAD_SOURCE=ROOT/'rh_attack_cycle_20261030/support_endpoint_continuity/generic_actual_head_pilot.py'
assert Q(16)<X<Q(17)
