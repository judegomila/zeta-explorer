#!/bin/sh
# retry a stalled chunk: centre the grid ON the stall point (offset 0..), optional higher prec
# usage: retry.sh <t_stall_floor> <n_next> <prec> <offset> <log>
./chain $(( $1 - 780 + $4 )) $(( $1 + 200 )) $2 1 $3 $5
