#!/usr/bin/env python3
"""b145-B-consume: exact rational comparison over one or more certified height sets (multi-height consumer).

usage: b145-B-consume.py [--q0 Q] [--parts 128] [--base] TAG1:PLAN1.json [TAG2:PLAN2.json ...]
Each TAG reads tmp/research-2026-11-16/push/b-route-p-recert/mb/gen-archive/TAG/TABLES.json (or TABLES_BASE.json with --base). Output: exact U (Fraction),
float, last cell, and which height set / kernel was used how often.
"""
import sys, json, argparse, importlib.util
from fractions import Fraction as F
from collections import Counter
from pathlib import Path

HERE = Path('tmp')
spec = importlib.util.spec_from_file_location('b145lib', HERE / 'b145-B-lib.py'); L = importlib.util.module_from_spec(spec)
spec.loader.exec_module(L)


def load_sets(items, base=False):
    sets = []
    for it in items:
        tag, plan = it.split(':', 1)
        rows = json.load(open(plan))['rows']
        hts = [None] * 608
        for r in rows: hts[r['time_index']] = F(r['height'])
        tabs = L.load_tables(Path('tmp/research-2026-11-16/push/b-route-p-recert/mb/gen-archive') / tag / ('TABLES_BASE.json' if base else 'TABLES.json'))
        sets.append((hts, tabs))
    return sets


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--q0', default=str(L.Q0_RAYMOND)); ap.add_argument('--parts', type=int, default=128)
    ap.add_argument('--base', action='store_true'); ap.add_argument('--nostart', action='store_true'); ap.add_argument('items', nargs='+')
    a = ap.parse_args()
    sets = load_sets(a.items, a.base)
    U, last, info = L.integrate_multi(sets, F(a.q0), a.parts, history=True, start_check=not a.nostart)
    use = Counter((lab[0], lab[1]) for _, _, lab, _ in info['hist'])
    print(json.dumps({'items': a.items, 'base': a.base, 'q0': a.q0, 'parts': a.parts, 'U': str(U), 'U_float': float(U) if U else None,
                      'last_cell': last, 'set_kernel_use_per_cell': {str(k): v for k, v in use.most_common()}}))
