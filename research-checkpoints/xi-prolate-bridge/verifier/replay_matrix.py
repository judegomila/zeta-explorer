#!/usr/bin/env python3
"""Verifier: reconstruct both source formula paths; never trusts producer Q."""
import argparse, json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; sys.path.insert(0,str(ROOT/'src'))
from weil_matrix import pilot
p=argparse.ArgumentParser(); p.add_argument('input',type=Path); p.add_argument('--output',type=Path)
a=p.parse_args(); supplied=json.loads(a.input.read_text())
result=pilot(supplied['lambda'],int(supplied['N']),int(supplied['dps']))
result['producer_matrix_ignored']=True
result['shared_arithmetic_library_limitation']='Both paths use mpmath 1.4.1; results are arbitrary precision diagnostics, not interval/ball enclosures.'
text=json.dumps(result,indent=2)+'\n'
if a.output: a.output.write_text(text)
print(text,end='')
