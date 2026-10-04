#include <stdio.h>
#include <flint/acb.h>
#include <flint/acb_dirichlet.h>
int main(int argc, char **argv)
{   /* Z(t) at decimal t (exact rational num/den given as two integers) */
    acb_t t, z; acb_init(t); acb_init(z); arb_t d; arb_init(d);
    arb_set_str(acb_realref(t), argv[1], 256); arb_set_str(d, argv[2], 256); arb_div(acb_realref(t), acb_realref(t), d, 256);
    acb_dirichlet_hardy_z(z, t, NULL, NULL, 1, 128);
    arb_printn(acb_realref(t), 25, 0); printf("  Z = "); arb_printn(acb_realref(z), 10, 0); printf("\n");
    return 0;
}
