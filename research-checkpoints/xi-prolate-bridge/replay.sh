#!/bin/sh
set -eu
cd "$(dirname "$0")"

test "$(shasum -a 256 vendor/CCM-ZST-2511.22755v1.pdf | awk '{print $1}')" = "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
test "$(shasum -a 256 vendor/CCM-PROLATE-2310.18423v2.pdf | awk '{print $1}')" = "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e"
test "$(shasum -a 256 vendor/KRD-PSWF-2006.00427v2.pdf | awk '{print $1}')" = "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
test "$(shasum -a 256 vendor/BBK-DPSWF-1905.08354v1.pdf | awk '{print $1}')" = "928759f7eebeeb59883ae2de305ebe8062f412c2ad0d275bb9ad4320c897ff6b"
test "$(shasum -a 256 vendor/FKS-PNT-2204.02588v3.pdf | awk '{print $1}')" = "15eff02042f2c1ab4878d029ce52a0abd6c95d66995b183a2dbc689ce9af49a4"
test "$(shasum -a 256 vendor/SLEPIAN-PSWF-IV-1964.pdf | awk '{print $1}')" = "86efb6b69f405a046914f19c07161329b3f455a93a58467cc8107cfa4a135351"
test "$(shasum -a 256 vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz | awk '{print $1}')" = "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
test "$(gzip -dc vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz | shasum -a 256 | awk '{print $1}')" = "b459dd2a485b061edb1dc94e5313830acf6e12b2af07098e3f8642993e676907"
test "$(shasum -a 256 vendor/MTY-ZFR-2212.06867v1.pdf | awk '{print $1}')" = "127c32eb86d0aea264cc5b1ba96cc83243ef6b763451591e1560edaca1767300"
test "$(shasum -a 256 vendor/HSW-ZC-2107.06506v1.pdf | awk '{print $1}')" = "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf"
test "$(shasum -a 256 vendor/PT-RH-VERIFY-2004.09765v1.pdf | awk '{print $1}')" = "3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885"

python3 -m unittest discover -s tests -v

mkdir -p artifacts/weak_residual_duality
python3 src/weak_residual_duality.py --dps 80 \
  --output artifacts/weak_residual_duality/counterexample_producer_dps80.json
python3 verifier/weak_residual_duality_replay.py \
  artifacts/weak_residual_duality/counterexample_producer_dps80.json \
  --output artifacts/weak_residual_duality/counterexample_verifier.json

mkdir -p artifacts/quotient_exterior_preconditioner
python3 src/quotient_exterior_preconditioner.py --dps 80 \
  --output artifacts/quotient_exterior_preconditioner/canonical_producer_dps80.json
python3 verifier/quotient_exterior_preconditioner_replay.py \
  --artifact artifacts/quotient_exterior_preconditioner/canonical_producer_dps80.json \
  --output artifacts/quotient_exterior_preconditioner/canonical_verifier_dps80.json
python3 src/quotient_exterior_preconditioner.py --dps 160 \
  --output artifacts/quotient_exterior_preconditioner/canonical_producer_dps160.json
python3 verifier/quotient_exterior_preconditioner_replay.py \
  --artifact artifacts/quotient_exterior_preconditioner/canonical_producer_dps160.json \
  --output artifacts/quotient_exterior_preconditioner/canonical_verifier_dps160.json

mkdir -p artifacts/physical_map_conditioning
python3 src/physical_map_conditioning.py --lambda 5/2 --dps 80 \
  --output artifacts/physical_map_conditioning/lambda5over2_producer_dps80.json
python3 verifier/physical_map_conditioning_replay.py \
  artifacts/physical_map_conditioning/lambda5over2_producer_dps80.json \
  --output artifacts/physical_map_conditioning/lambda5over2_verifier.json

P0_FLINT_PREFIX="$(brew --prefix flint)"
P0_GMP_PREFIX="$(brew --prefix gmp)"
P0_MPFR_PREFIX="$(brew --prefix mpfr)"
P0_BUILD_DIR="$(mktemp -d)"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" src/p0_matrix_arb.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_matrix_arb"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/p0_matrix_arb_replay.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/p0_matrix_arb_replay"
clang -O2 -std=c11 -Wall -Wextra -Werror \
  -I"$P0_FLINT_PREFIX/include" -I"$P0_GMP_PREFIX/include" \
  -I"$P0_MPFR_PREFIX/include" verifier/projection_constant_arb.c \
  -L"$P0_FLINT_PREFIX/lib" -L"$P0_GMP_PREFIX/lib" -L"$P0_MPFR_PREFIX/lib" \
  -Wl,-rpath,"$P0_FLINT_PREFIX/lib" -Wl,-rpath,"$P0_GMP_PREFIX/lib" \
  -Wl,-rpath,"$P0_MPFR_PREFIX/lib" -lflint -lmpfr -lgmp -lm \
  -o "$P0_BUILD_DIR/projection_constant_arb"

mkdir -p artifacts/projection_rate
"$P0_BUILD_DIR/projection_constant_arb" --prec 256 \
  > artifacts/projection_rate/C_K_256bits.txt

mkdir -p artifacts/p0_ball_pilots/lambda2_N2
for P0_BITS in 256 512; do
  "$P0_BUILD_DIR/p0_matrix_arb" --lambda 2 --N 2 --prec "$P0_BITS" \
    --output "artifacts/p0_ball_pilots/lambda2_N2/producer_${P0_BITS}bits.txt" >/dev/null
  "$P0_BUILD_DIR/p0_matrix_arb_replay" --lambda 2 --N 2 --prec "$P0_BITS" \
    --producer "artifacts/p0_ball_pilots/lambda2_N2/producer_${P0_BITS}bits.txt" \
    --output "artifacts/p0_ball_pilots/lambda2_N2/verifier_${P0_BITS}bits.txt" >/dev/null
done

mkdir -p artifacts/p0_pilots/lambda2_N2
python3 src/p0_diagnostic.py --lambda 2 --N 2 --dps 40 --prolate-basis-size 30 \
  --output artifacts/p0_pilots/lambda2_N2/producer_dps40.json >/dev/null
python3 verifier/independent_replay.py artifacts/p0_pilots/lambda2_N2/producer_dps40.json \
  --output artifacts/p0_pilots/lambda2_N2/verifier_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 2 --dps 80 --prolate-basis-size 40 \
  --output artifacts/p0_pilots/lambda2_N2/producer_dps80.json >/dev/null
python3 verifier/independent_replay.py artifacts/p0_pilots/lambda2_N2/producer_dps80.json \
  --output artifacts/p0_pilots/lambda2_N2/verifier_dps80.json >/dev/null

mkdir -p artifacts/p0_schedule/raw
python3 src/p0_diagnostic.py --lambda 1.5 --N 3 --dps 35 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda1p5_N3_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 3 --dps 35 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda2_N3_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 4 --dps 35 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda2_N4_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.5 --N 7 --dps 30 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda2p5_N7_dps30.json >/dev/null
python3 src/p0_diagnostic.py --lambda 3 --N 9 --dps 35 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda3_N9_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.5 --N 6 --dps 30 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda1p5_N6_dps30.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 8 --dps 30 --prolate-basis-size 30 \
  --output artifacts/p0_schedule/raw/lambda2_N8_dps30.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.5 --N 14 --dps 40 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 3 --N 18 --dps 45 --prolate-basis-size 50 \
  --output artifacts/p0_schedule/raw/lambda3_N18_dps45.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.75 --N 8 --dps 35 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda1p75_N8_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.75 --N 8 --dps 70 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda1p75_N8_dps70.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 12 --dps 40 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda2p25_N12_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 12 --dps 80 --prolate-basis-size 45 \
  --output artifacts/p0_schedule/raw/lambda2p25_N12_dps80.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 16 --dps 45 --prolate-basis-size 55 \
  --output artifacts/p0_schedule/raw/lambda2p75_N16_dps45.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 16 --dps 90 --prolate-basis-size 55 \
  --output artifacts/p0_schedule/raw/lambda2p75_N16_dps90.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 24 --dps 50 --prolate-basis-size 60 \
  --output artifacts/p0_schedule/raw/lambda2p75_N24_dps50.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 24 --dps 80 --prolate-basis-size 60 \
  --output artifacts/p0_schedule/raw/lambda2p75_N24_dps80.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 24 --dps 50 --prolate-basis-size 80 \
  --output artifacts/p0_schedule/raw/lambda2p75_N24_dps50_basis80.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.75 --N 32 --dps 50 --prolate-basis-size 60 \
  --output artifacts/p0_schedule/raw/lambda2p75_N32_dps50.json >/dev/null
python3 src/p0_diagnostic.py --lambda 1.75 --N 12 --dps 35 --prolate-basis-size 35 \
  --output artifacts/p0_schedule/raw/lambda1p75_N12_dps35.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2 --N 12 --dps 40 --prolate-basis-size 40 \
  --output artifacts/p0_schedule/raw/lambda2_N12_dps40.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 18 --dps 45 --prolate-basis-size 50 \
  --output artifacts/p0_schedule/raw/lambda2p25_N18_dps45.json >/dev/null
python3 src/p0_diagnostic.py --lambda 2.25 --N 18 --dps 70 --prolate-basis-size 70 \
  --output artifacts/p0_schedule/raw/lambda2p25_N18_dps70.json >/dev/null
mkdir -p artifacts/p0_schedule/verifier
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json \
  --output artifacts/p0_schedule/verifier/lambda2p5_N14_dps40.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda3_N18_dps45.json \
  --output artifacts/p0_schedule/verifier/lambda3_N18_dps45.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda1p75_N8_dps35.json \
  --output artifacts/p0_schedule/verifier/lambda1p75_N8_dps35.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p25_N12_dps40.json \
  --output artifacts/p0_schedule/verifier/lambda2p25_N12_dps40.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p75_N16_dps45.json \
  --output artifacts/p0_schedule/verifier/lambda2p75_N16_dps45.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p75_N24_dps50.json \
  --output artifacts/p0_schedule/verifier/lambda2p75_N24_dps50.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p75_N32_dps50.json \
  --output artifacts/p0_schedule/verifier/lambda2p75_N32_dps50.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda1p75_N12_dps35.json \
  --output artifacts/p0_schedule/verifier/lambda1p75_N12_dps35.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2_N12_dps40.json \
  --output artifacts/p0_schedule/verifier/lambda2_N12_dps40.json >/dev/null
python3 verifier/independent_replay.py \
  artifacts/p0_schedule/raw/lambda2p25_N18_dps45.json \
  --output artifacts/p0_schedule/verifier/lambda2p25_N18_dps45.json >/dev/null

python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p5_N3_dps35.json \
  artifacts/p0_schedule/raw/lambda2_N4_dps35.json \
  artifacts/p0_schedule/raw/lambda2p5_N7_dps30.json \
  artifacts/p0_schedule/raw/lambda3_N9_dps35.json \
  --output artifacts/p0_schedule/N_ceil_lambda2_summary.json >/dev/null
python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p5_N6_dps30.json \
  artifacts/p0_schedule/raw/lambda2_N8_dps30.json \
  artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json \
  artifacts/p0_schedule/raw/lambda3_N18_dps45.json \
  --multiplier 2 --output artifacts/p0_schedule/N_2ceil_lambda2_summary.json >/dev/null
python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p75_N8_dps35.json \
  artifacts/p0_schedule/raw/lambda2_N8_dps30.json \
  artifacts/p0_schedule/raw/lambda2p25_N12_dps40.json \
  artifacts/p0_schedule/raw/lambda2p75_N16_dps45.json \
  --multiplier 2 \
  --output artifacts/p0_schedule/N_2ceil_lambda2_refined_summary.json >/dev/null
python3 src/schedule_analysis.py \
  artifacts/p0_schedule/raw/lambda1p75_N12_dps35.json \
  artifacts/p0_schedule/raw/lambda2_N12_dps40.json \
  artifacts/p0_schedule/raw/lambda2p25_N18_dps45.json \
  artifacts/p0_schedule/raw/lambda2p75_N24_dps50.json \
  --multiplier 3 \
  --output artifacts/p0_schedule/N_3ceil_lambda2_summary.json >/dev/null

mkdir -p artifacts/prolate_window_probe
python3 src/prolate_window_probe.py --lambda 2 --N 8 --dps 30 \
  --prolate-basis-size 30 \
  --output artifacts/prolate_window_probe/lambda2_N8_dps30.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2_N8_dps30.json --dps 50 \
  --output artifacts/prolate_window_probe/lambda2_N8_dps30_verifier.json >/dev/null
python3 src/prolate_window_probe.py --lambda 1.75 --N 8 --dps 30 \
  --prolate-basis-size 30 \
  --output artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps30.json >/dev/null
python3 src/prolate_window_probe.py --lambda 1.75 --N 8 --dps 60 \
  --prolate-basis-size 30 \
  --output artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps60.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 35 \
  --prolate-basis-size 40 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 70 \
  --prolate-basis-size 40 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps70.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps30.json --dps 50 \
  --output artifacts/prolate_window_probe/lambda1p75_N8_two_window_dps30_verifier.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35.json --dps 60 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_two_window_dps35_verifier.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 35 \
  --prolate-basis-size 40 --even-labels 8,12,16,20 \
  --odd-labels 6,10,14,18 --skip-direct-projection-error \
  --skip-quadrature-crosscheck \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps35.json >/dev/null
python3 src/prolate_window_probe.py --lambda 2.25 --N 12 --dps 60 \
  --prolate-basis-size 40 --even-labels 8,12,16,20 \
  --odd-labels 6,10,14,18 --skip-direct-projection-error \
  --skip-quadrature-crosscheck \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps60.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps35.json --dps 60 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps35_verifier.json >/dev/null
python3 verifier/anisotropic_schur_replay.py \
  artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps60.json --dps 80 \
  --output artifacts/prolate_window_probe/lambda2p25_N12_shannon4_dps60_verifier.json >/dev/null

mkdir -p artifacts/chebyshev_rewrite
python3 verifier/chebyshev_rewrite_replay.py --lambda 2 --N 2 --dps 80 \
  --output artifacts/chebyshev_rewrite/lambda2_N2_dps80.json >/dev/null
python3 verifier/chebyshev_rewrite_replay.py --lambda 2 --N 2 --dps 160 \
  --output artifacts/chebyshev_rewrite/lambda2_N2_dps160.json >/dev/null

mkdir -p artifacts/transition_window
python3 src/transition_window_bound.py --lambda 2 --dps 80 \
  --output artifacts/transition_window/lambda2_dps80.json >/dev/null

mkdir -p artifacts/prufer_same_parity_gap
python3 src/prufer_same_parity_gap.py --dps 80 \
  --output artifacts/prufer_same_parity_gap/canonical_producer_dps80.json >/dev/null
python3 verifier/prufer_same_parity_gap_replay.py \
  --artifact artifacts/prufer_same_parity_gap/canonical_producer_dps80.json \
  --dps 80 \
  --output artifacts/prufer_same_parity_gap/canonical_verifier_dps80.json >/dev/null
python3 src/prufer_same_parity_gap.py --dps 160 \
  --output artifacts/prufer_same_parity_gap/canonical_producer_dps160.json >/dev/null
python3 verifier/prufer_same_parity_gap_replay.py \
  --artifact artifacts/prufer_same_parity_gap/canonical_producer_dps160.json \
  --dps 160 \
  --output artifacts/prufer_same_parity_gap/canonical_verifier_dps160.json >/dev/null

mkdir -p artifacts/prolate_tail
python3 src/prolate_tail_envelope.py --lambda 2 --N 12 --dps 80 \
  --output artifacts/prolate_tail/lambda2_N12_producer_dps80.json >/dev/null
python3 verifier/prolate_tail_envelope_replay.py \
  artifacts/prolate_tail/lambda2_N12_producer_dps80.json --dps 160 \
  --output artifacts/prolate_tail/lambda2_N12_verifier_dps160.json >/dev/null
python3 src/prolate_tail_envelope.py --lambda 2 --N 12 --dps 160 \
  --output artifacts/prolate_tail/lambda2_N12_producer_dps160.json >/dev/null
python3 verifier/prolate_tail_envelope_replay.py \
  artifacts/prolate_tail/lambda2_N12_producer_dps160.json --dps 200 \
  --output artifacts/prolate_tail/lambda2_N12_verifier_dps200.json >/dev/null

mkdir -p artifacts/defect_relative_projection
python3 src/defect_relative_projection.py --j 2 --dps 80 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/defect_relative_projection_replay.py \
  artifacts/defect_relative_projection/lambda2p5_j2_producer_dps80.json \
  --dps 100 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_replay_dps100.json >/dev/null
python3 src/defect_relative_projection.py --j 2 --dps 160 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/defect_relative_projection_replay.py \
  artifacts/defect_relative_projection/lambda2p5_j2_producer_dps160.json \
  --dps 200 \
  --output artifacts/defect_relative_projection/lambda2p5_j2_replay_dps200.json >/dev/null

mkdir -p artifacts/chebyshev_hankel
python3 src/chebyshev_hankel_bound.py --dps 80 \
  --output artifacts/chebyshev_hankel/moments_producer_dps80.json >/dev/null
python3 verifier/chebyshev_hankel_bound_replay.py \
  artifacts/chebyshev_hankel/moments_producer_dps80.json --dps 160 \
  --output artifacts/chebyshev_hankel/moments_verifier_dps160.json >/dev/null
python3 src/chebyshev_hankel_bound.py --dps 160 \
  --output artifacts/chebyshev_hankel/moments_producer_dps160.json >/dev/null
python3 verifier/chebyshev_hankel_bound_replay.py \
  artifacts/chebyshev_hankel/moments_producer_dps160.json --dps 200 \
  --output artifacts/chebyshev_hankel/moments_verifier_dps200.json >/dev/null

mkdir -p artifacts/near_hankel_geometry
python3 verifier/near_hankel_geometry_replay.py --dps 50 \
  --output artifacts/near_hankel_geometry/replay_dps50.json >/dev/null
python3 verifier/near_hankel_geometry_replay.py --dps 100 \
  --output artifacts/near_hankel_geometry/replay_dps100.json >/dev/null

mkdir -p artifacts/high_fourier_coercivity
python3 src/high_fourier_coercivity.py --lambda 2.5 --target-floor 1 \
  --shift 0 --dps 80 \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps80.json >/dev/null
python3 verifier/high_fourier_coercivity_replay.py \
  --input artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps80.json \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_replay_dps80.json >/dev/null
python3 src/high_fourier_coercivity.py --lambda 2.5 --target-floor 1 \
  --shift 0 --dps 160 \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps160.json >/dev/null
python3 verifier/high_fourier_coercivity_replay.py \
  --input artifacts/high_fourier_coercivity/lambda2p5_target1_producer_dps160.json \
  --output artifacts/high_fourier_coercivity/lambda2p5_target1_replay_dps160.json >/dev/null

mkdir -p artifacts/compact_projection_weil
python3 src/compact_projection_weil_bound.py --j 2 --dps 80 \
  --output artifacts/compact_projection_weil/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/compact_projection_weil_bound_replay.py \
  --input artifacts/compact_projection_weil/lambda2p5_j2_producer_dps80.json \
  --output artifacts/compact_projection_weil/lambda2p5_j2_replay_dps80.json >/dev/null
python3 src/compact_projection_weil_bound.py --j 2 --dps 160 \
  --output artifacts/compact_projection_weil/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/compact_projection_weil_bound_replay.py \
  --input artifacts/compact_projection_weil/lambda2p5_j2_producer_dps160.json \
  --output artifacts/compact_projection_weil/lambda2p5_j2_replay_dps160.json >/dev/null

mkdir -p artifacts/outer_projection_weil
python3 src/outer_projection_weil_bound.py --j 2 --dps 80 \
  --output artifacts/outer_projection_weil/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/outer_projection_weil_bound_replay.py \
  --input artifacts/outer_projection_weil/lambda2p5_j2_producer_dps80.json \
  --output artifacts/outer_projection_weil/lambda2p5_j2_replay_dps80.json >/dev/null
python3 src/outer_projection_weil_bound.py --j 2 --dps 160 \
  --output artifacts/outer_projection_weil/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/outer_projection_weil_bound_replay.py \
  --input artifacts/outer_projection_weil/lambda2p5_j2_producer_dps160.json \
  --output artifacts/outer_projection_weil/lambda2p5_j2_replay_dps160.json >/dev/null

for P0_SOURCE_DPS in 80 160; do
  python3 src/zero_sampling_source_lock.py \
    --lock ZERO_SAMPLING_SOURCE_LOCK.json --dps "$P0_SOURCE_DPS" >/dev/null
  for P0_SOURCE_INDEX in 0 34 64; do
    python3 verifier/zero_sampling_source_replay.py \
      ZERO_SAMPLING_SOURCE_LOCK.json --dps "$P0_SOURCE_DPS" \
      --index "$P0_SOURCE_INDEX" --q 1 >/dev/null
  done
done

mkdir -p artifacts/outer_outer_weighted_translation
python3 src/outer_outer_weighted_translation.py --lambda-decimal 2.5 --dps 80 \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps80.json >/dev/null
python3 verifier/outer_outer_weighted_translation_replay.py \
  artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps80.json \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_replay_dps80.json >/dev/null
python3 src/outer_outer_weighted_translation.py --lambda-decimal 2.5 --dps 160 \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps160.json >/dev/null
python3 verifier/outer_outer_weighted_translation_replay.py \
  artifacts/outer_outer_weighted_translation/lambda2p5_producer_dps160.json \
  --output artifacts/outer_outer_weighted_translation/lambda2p5_replay_dps160.json >/dev/null

mkdir -p artifacts/outer_outer_spectral_theorem
python3 src/outer_outer_spectral_theorem.py --lambda-decimal 2.5 --dps 80 \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps80.json >/dev/null
python3 verifier/outer_outer_spectral_theorem_replay.py \
  artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps80.json \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_replay_dps80.json >/dev/null
python3 src/outer_outer_spectral_theorem.py --lambda-decimal 2.5 --dps 160 \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps160.json >/dev/null
python3 verifier/outer_outer_spectral_theorem_replay.py \
  artifacts/outer_outer_spectral_theorem/lambda2p5_producer_dps160.json \
  --output artifacts/outer_outer_spectral_theorem/lambda2p5_replay_dps160.json >/dev/null

mkdir -p artifacts/compact_absolute_sampling
python3 src/compact_absolute_sampling.py --j 2 --dps 80 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps80.json >/dev/null
python3 verifier/compact_absolute_sampling_replay.py \
  artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps80.json \
  --dps 120 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_replay_dps120.json >/dev/null
python3 src/compact_absolute_sampling.py --j 2 --dps 160 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps160.json >/dev/null
python3 verifier/compact_absolute_sampling_replay.py \
  artifacts/compact_absolute_sampling/lambda2p5_j2_producer_dps160.json \
  --dps 220 \
  --output artifacts/compact_absolute_sampling/lambda2p5_j2_replay_dps220.json >/dev/null

mkdir -p artifacts/full_exterior_sampling_fallback
python3 src/full_exterior_sampling_fallback.py \
  --lambda-numerator 5 --lambda-denominator 2 --N 24 --dps 80 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps80.json >/dev/null
python3 verifier/full_exterior_sampling_fallback_replay.py \
  artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps80.json \
  --dps 120 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_verifier_dps80.json >/dev/null
python3 src/full_exterior_sampling_fallback.py \
  --lambda-numerator 5 --lambda-denominator 2 --N 24 --dps 160 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps160.json >/dev/null
python3 verifier/full_exterior_sampling_fallback_replay.py \
  artifacts/full_exterior_sampling_fallback/lambda5over2_N24_producer_dps160.json \
  --dps 200 \
  --output artifacts/full_exterior_sampling_fallback/lambda5over2_N24_verifier_dps160.json >/dev/null

mkdir -p artifacts/hybrid_outer_sampling_odd_shift
python3 src/hybrid_outer_sampling_odd_shift.py \
  --lambda-decimal 2.5 --dps 80 \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps80.json >/dev/null
python3 verifier/hybrid_outer_sampling_odd_shift_replay.py \
  artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps80.json \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_verifier_dps80.json >/dev/null
python3 src/hybrid_outer_sampling_odd_shift.py \
  --lambda-decimal 2.5 --dps 160 \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps160.json >/dev/null
python3 verifier/hybrid_outer_sampling_odd_shift_replay.py \
  artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_producer_dps160.json \
  --output artifacts/hybrid_outer_sampling_odd_shift/lambda5over2_verifier_dps160.json >/dev/null

mkdir -p artifacts/projected_state_norm_lower_bound
python3 src/projected_state_norm_lower_bound.py \
  --lambda-decimal 4 --N 4096 --delta-upper-decimal 0.00001 --dps 80 \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps80.json >/dev/null
python3 verifier/projected_state_norm_lower_bound_replay.py \
  artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps80.json \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_verifier_dps80.json >/dev/null
python3 src/projected_state_norm_lower_bound.py \
  --lambda-decimal 4 --N 4096 --delta-upper-decimal 0.00001 --dps 160 \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps160.json >/dev/null
python3 verifier/projected_state_norm_lower_bound_replay.py \
  artifacts/projected_state_norm_lower_bound/lambda4_N4096_producer_dps160.json \
  --output artifacts/projected_state_norm_lower_bound/lambda4_N4096_verifier_dps160.json >/dev/null

mkdir -p artifacts/leading_prolate_oscillation
python3 src/leading_prolate_oscillation.py --lambda-numerator 5 \
  --output artifacts/leading_prolate_oscillation/lambda5over2_producer.json >/dev/null
python3 verifier/leading_prolate_oscillation_replay.py \
  artifacts/leading_prolate_oscillation/lambda5over2_producer.json \
  --output artifacts/leading_prolate_oscillation/lambda5over2_verifier.json >/dev/null
python3 src/leading_prolate_oscillation.py --lambda-numerator 7 \
  --output artifacts/leading_prolate_oscillation/lambda7over2_producer.json >/dev/null
python3 verifier/leading_prolate_oscillation_replay.py \
  artifacts/leading_prolate_oscillation/lambda7over2_producer.json \
  --output artifacts/leading_prolate_oscillation/lambda7over2_verifier.json >/dev/null

mkdir -p artifacts/transition_prolate_outer
for P0_TRANSITION_P in 5 7; do
  for P0_TRANSITION_DPS in 80 160; do
    python3 src/transition_prolate_outer.py \
      --lambda-numerator "$P0_TRANSITION_P" --dps "$P0_TRANSITION_DPS" \
      --output "artifacts/transition_prolate_outer/p${P0_TRANSITION_P}_d${P0_TRANSITION_DPS}_producer.json" >/dev/null
    python3 verifier/transition_prolate_outer_replay.py \
      "artifacts/transition_prolate_outer/p${P0_TRANSITION_P}_d${P0_TRANSITION_DPS}_producer.json" \
      --output "artifacts/transition_prolate_outer/p${P0_TRANSITION_P}_d${P0_TRANSITION_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/growing_transition_sampling
for P0_GROWING_DPS in 80 160; do
  python3 src/growing_transition_sampling.py \
    --lambda-numerator 5 --modal-rows 8 --dps "$P0_GROWING_DPS" \
    --output "artifacts/growing_transition_sampling/p5_q8_d${P0_GROWING_DPS}_producer.json" >/dev/null
  python3 verifier/growing_transition_sampling_replay.py \
    "artifacts/growing_transition_sampling/p5_q8_d${P0_GROWING_DPS}_producer.json" \
    --output "artifacts/growing_transition_sampling/p5_q8_d${P0_GROWING_DPS}_replay.json" >/dev/null
  python3 src/growing_transition_sampling.py \
    --lambda-numerator 7 --modal-rows 14 --dps "$P0_GROWING_DPS" \
    --output "artifacts/growing_transition_sampling/p7_q14_d${P0_GROWING_DPS}_producer.json" >/dev/null
  python3 verifier/growing_transition_sampling_replay.py \
    "artifacts/growing_transition_sampling/p7_q14_d${P0_GROWING_DPS}_producer.json" \
    --output "artifacts/growing_transition_sampling/p7_q14_d${P0_GROWING_DPS}_replay.json" >/dev/null
done

mkdir -p artifacts/block_quotient_action
for P0_BLOCK_ACTION_P in 5 7; do
  for P0_BLOCK_ACTION_DPS in 80 160; do
    python3 src/block_quotient_action.py \
      --lambda-numerator "$P0_BLOCK_ACTION_P" --dps "$P0_BLOCK_ACTION_DPS" \
      --output "artifacts/block_quotient_action/p${P0_BLOCK_ACTION_P}_d${P0_BLOCK_ACTION_DPS}_producer.json" >/dev/null
    python3 verifier/block_quotient_action_replay.py \
      "artifacts/block_quotient_action/p${P0_BLOCK_ACTION_P}_d${P0_BLOCK_ACTION_DPS}_producer.json" \
      --output "artifacts/block_quotient_action/p${P0_BLOCK_ACTION_P}_d${P0_BLOCK_ACTION_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/compressed_multiplier_trace
for P0_COMPRESSED_P in 5 7; do
  for P0_COMPRESSED_DPS in 80 160; do
    python3 src/compressed_multiplier_trace.py \
      --lambda-numerator "$P0_COMPRESSED_P" --dps "$P0_COMPRESSED_DPS" \
      --output "artifacts/compressed_multiplier_trace/p${P0_COMPRESSED_P}_d${P0_COMPRESSED_DPS}_producer.json" >/dev/null
    python3 verifier/compressed_multiplier_trace_replay.py \
      "artifacts/compressed_multiplier_trace/p${P0_COMPRESSED_P}_d${P0_COMPRESSED_DPS}_producer.json" \
      --output "artifacts/compressed_multiplier_trace/p${P0_COMPRESSED_P}_d${P0_COMPRESSED_DPS}_replay.json" >/dev/null
  done
done

mkdir -p artifacts/signed_quotient_capture
for P0_SIGNED_CAPTURE_P in 5 7; do
  for P0_SIGNED_CAPTURE_DPS in 80 160; do
    python3 src/signed_quotient_capture.py \
      --lambda-numerator "$P0_SIGNED_CAPTURE_P" --dps "$P0_SIGNED_CAPTURE_DPS" \
      --output "artifacts/signed_quotient_capture/p${P0_SIGNED_CAPTURE_P}_d${P0_SIGNED_CAPTURE_DPS}_producer.json" >/dev/null
    python3 verifier/signed_quotient_capture_replay.py \
      "artifacts/signed_quotient_capture/p${P0_SIGNED_CAPTURE_P}_d${P0_SIGNED_CAPTURE_DPS}_producer.json" \
      --output "artifacts/signed_quotient_capture/p${P0_SIGNED_CAPTURE_P}_d${P0_SIGNED_CAPTURE_DPS}_replay.json" >/dev/null
  done
done

python3 src/write_artifact_manifest.py
