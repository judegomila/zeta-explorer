# Generates platt_multieval_probe.c: the UNPATCHED FLINT 3.6.0 platt_multieval.c plus a WRAP_PROBE block that prints,
# for k = 0, 10, ..., the max |entry| and max radius of the DFT table rows over q <= N/2 and over q > N/2 (the wrapped bins).
# Run in a directory containing a pristine copy of src/acb_dirichlet/platt_multieval.c.
PROBE = r'''#ifdef WRAP_PROBE
    {
        slong kk, q; mag_t mm, rr, mx, rx, m0, r0; mag_init(mm); mag_init(rr); mag_init(mx); mag_init(rx); mag_init(m0); mag_init(r0);
        for (kk = 0; kk < K; kk += 10)
        {
            mag_zero(mx); mag_zero(rx); mag_zero(m0); mag_zero(r0);
            for (q = 0; q < N; q++)
            {
                acb_get_mag(mm, table + N*kk + q); mag_set(rr, arb_radref(acb_realref(table + N*kk + q)));
                if (q > N/2) { if (mag_cmp(mm, mx) > 0) mag_set(mx, mm); if (mag_cmp(rr, rx) > 0) mag_set(rx, rr); }
                else { if (mag_cmp(mm, m0) > 0) mag_set(m0, mm); if (mag_cmp(rr, r0) > 0) mag_set(r0, rr); }
            }
            flint_printf("WRAP_PROBE k=%wd  q<=N/2: max|entry| ", kk); mag_printd(m0, 4); flint_printf("  max rad "); mag_printd(r0, 4);
            flint_printf("   q>N/2: max|entry| "); mag_printd(mx, 4); flint_printf("  max rad "); mag_printd(rx, 4); flint_printf("\n");
        }
    }
#endif
'''
KEY = '    do_convolutions(out_a, table, S_table, N, K, prec);'
src = open('platt_multieval.c').read()
assert src.count(KEY) == 1
open('platt_multieval_probe.c', 'w').write(src.replace(KEY, PROBE + KEY))
print('wrote platt_multieval_probe.c')
