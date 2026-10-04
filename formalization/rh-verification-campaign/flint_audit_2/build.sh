#!/bin/bash
set -e
CF="-O2 -include rename.h -I/opt/homebrew/include -I/opt/homebrew/include/flint -I."
for v in fix orig; do
  if [ $v = fix ]; then PM=platt_multieval_fix.c; D=-DWRAP_FIX; else PM=platt_multieval.c; D=; fi
  clang $CF $D -c $PM -o pm_$v.o
  clang $CF -c platt_multieval_threaded.c -o pmt_$v.o
  clang $CF -c platt_local_hardy_z_zeros.c -o plh_$v.o
  clang $CF -c chain2.c -o chain2_$v.o
  clang -o chain2_$v chain2_$v.o pm_$v.o pmt_$v.o plh_$v.o -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm
done
