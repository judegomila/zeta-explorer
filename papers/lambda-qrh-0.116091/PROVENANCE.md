# Provenance

Generated 2026-10-19 16:19 (local time) with `shasum -a 256` by `papers/lambda-qrh-0.116091/tools/make_provenance.py`, on branch `editorial-redesign` at commit `c7f535516cc96880b9469b0854fb177df9b7be3a`. Paths are relative to the repository root unless they start with `/`.

To re-check one group, copy its block into a file and run `shasum -a 256 -c FILE` from the repository root.

Git status is given per group. Paths under `/tmp/` are outside the repository, and most files under `tmp/` are untracked (the local copies of Raymond's deposit are tracked); for untracked files the hashes here are the only record of the state used. The Lean package `qrh-lambda` was edited by another process shortly before this file was generated (dependencies moved out of `/tmp`, inputs vendored; commit `6c1ef30d4`); the hashes are a snapshot.

External pins recorded elsewhere and not re-hashed here:

* openai/math: lean/ directory of commit `adc7f1241b42e322a6451854ab7e4b4c146bf78a`; built `Nonvanishing.olean` sha256 `adeff7db7211767b3a3437958cecce7229185c998c8ac909a7013ec75d499fdc` (`formalization/external/openai-math-qrh-verification.md`).
* LeanCert: commit `7f91b6eb3567437f6cfac03ed279706603ee22f4` (checkout `formalization/lean/raymond-core/.lake/packages/leancert`).
* Mathlib: commit `d13f23b723b8a846827a245b89c10fc7d3f11612`; Lean toolchain `leanprover/lean4:v4.34.1`.
* Platt–Trudgian arXiv:2004.09765v1 PDF as fetched on 2026-10-09: sha256 `3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885` (equal to the hash in `dbn-lambda-01787854-candidate-audit/references/README.md`).
* Raymond's deposit: the local copies of `Analytic_Foundations.pdf`, `Correlated_Translated_Probes.pdf`, `Correlated_Translated_Probes.tex`, `README.md` and `Verification_Guide.pdf` match the deposit's `SHA256SUMS.txt` (checked 2026-10-09).
* Python: 3.13.15 with python-flint 0.8.0 (`tmp/routes-b1-r1-venv`, route-P consumer); 3.14.7 with python-flint 0.9.0 (`.venv-arb`, Raymond chain replay and verifiers).

## This package

Hashed after the last edit of each file. `PROVENANCE.md` itself is not listed.

Git status: 3 tracked, 10 tracked, modified.

```
0736fef12bc010bf714268147015b671a0b16c328fef62bbd31d287ed607528c  papers/lambda-qrh-0.116091/README.md
4c6501c6a809a16342369b07e981117de20b61bebb67249f8496e43a1e140446  papers/lambda-qrh-0.116091/PROOF_NOTE.md
22eca3e3e0d01b330426f1326ba010253f2e1a5456e3f01e2e0256dba271c5cb  papers/lambda-qrh-0.116091/PARAMETERS.md
686eda58c62a0eed16b8f99ed58e21f52a4bf77769c33006f58fcc750fa9236e  papers/lambda-qrh-0.116091/DEPENDENCIES.md
176e39199219b9916c1b0cb20205cf402619630b826083e683683cd6a4bfb621  papers/lambda-qrh-0.116091/LEAN.md
2ed0af9f70b4819df2815afdf6ed595b649fbf428828c49165a1327711548f2b  papers/lambda-qrh-0.116091/OPEN_REVIEW_QUESTIONS.md
38dd0d70964cf80342f8838dd100d0a17053dc7f15a133dc6181eab52d724c08  papers/lambda-qrh-0.116091/BIBLIOGRAPHY.md
b91b51a80f6c78735256b24af8d40bf6086a044e411f17748dea6681230ebef1  papers/lambda-qrh-0.116091/CITATION.md
314706042f15b7750173d73b6cc2dadd94f60eabe2fa49ec8022f63ed2b535f5  papers/lambda-qrh-0.116091/paper/main.tex
17136dd7fc2af55c4b681a6bf8f6a91a471ca7adf3b8ed3285f2931283dd58ec  papers/lambda-qrh-0.116091/paper/refs.bib
e4dc1810d9b7c75f0cc9331af8fd2d50c4b1b5740e4ac203dc940429c309b947  papers/lambda-qrh-0.116091/paper/main.pdf
e4dc1810d9b7c75f0cc9331af8fd2d50c4b1b5740e4ac203dc940429c309b947  papers/lambda-qrh-0.116091/lambda-qrh-0.116091-draft.pdf
50865447d5624fe1371b1a867150acb61de95ff096633f93e1bbc8a90f98c3e5  papers/lambda-qrh-0.116091/tools/make_provenance.py
```

## Project record modules and page

Source of the numbers in `PARAMETERS.md` and of the status statements.

Git status: 8 tracked, 2 tracked, modified.

```
cd5e122d020c2245a88b66ca8442691be925d3b4eef9e6967f1bd74680fa79f6  src/data/qrh-path-push-2026-10-08.js
3d59b38f04103d9ffd279dd91fff1a6bf7385b9abf029763effc2edcf5a2eaea  src/data/openai-math-integration-2026-10-08.js
c49b184b4e397836fd0f08c7d85ae87e6e93f90c5f059a5c07380d35f637854e  src/data/qrh-theta-and-improvement-2026-10-08.js
7ae43f4919d2ec627350bc0679bd39cb92d457c156b5511622b7715d7e963b85  src/data/beat-seven-eighths-2026-10-08.js
e00eb58257fe13db0cd315dfcd094c8c89e322f44f446e4deab376eddc9c526a  src/data/beat78-prop152-2026-10-09.js
52eebb227818558b7ae84a9799cdbe1096372f7d0172f6cfa4aacae7ebc2a146  src/data/lambda-levers-combined-2026-10-09.js
c22f592fd28e8e5d499d6f6c53aafae6c004a1b2a22db1da79d77996c0c29e9e  src/data/qrh-lambda-lean-2026-10-09.js
90cd9e596bc876a30720c32301ea52301283262e1f75a811cf388407e7cbc15c  src/data/r2-structured-floor-2026-10-02.js
8dad4d26ecc2812bca15a5b57e95988bd032bac5cc9ab65b951f4e4d3029d2d0  src/data/r5-synthesis-2026-10-05.js
1284ed1cce32f7b5dc40d64a7584b684720f1718ef1429bec74f4b00d3aef5a5  src/pages/LambdaQrhConditionalPage.jsx
```

## Internal write-ups

Internal reviews and notes cited in the package (unpublished).

Git status: 21 tracked.

```
37d282257fbc90e73ff4480518872c707f02cd93b179bf39b71cd53ed5ffcbc9  formalization/paper/lambda-qrh-note-draft.md
23ec946e8a101eebb98e7484d8fb6bcc29065d80f44064097e509f1552dc2f7a  formalization/paper/raymond-g0-review-a-2026-10-08.md
066c7ec26eb3504be8af7c75b051f728799ee5525dcbb9f1180ba9bb2eed47ea  formalization/paper/raymond-g0-review-b-2026-10-08.md
e6736f3d20092bd7266ff46c5167923b568dd5970b294bafcdd7f99747a0f86c  formalization/external/openai-math-qrh-verification.md
7aa599f32148d2dba535e3fb49d407efbb56a58d0eaf0a63011eaab309663f4d  formalization/paper/joint-pair-arbitrary-shift.md
91d072d667db06d7aa326114297b527e0a5e0cdf396bd6193ae35a885cb07d8b  formalization/paper/lemma-B-two-band.md
5f9d3b4f2b36b829f2bb620e8da93cea24097c33f340bbd75e9c97f87630f86e  formalization/paper/cg-monotonicity.md
7bd95ca051a3abd235a79168b96328c35bbd522f4f43a98499c745eac7953738  formalization/paper/outer-lemma-weak.md
a49aa52f38dd0d826cc278640d5a3f7080ec6702e35773c233830ff1c7a9b482  formalization/paper/wol-pd-lemmas.md
e3420255f9c20c7d4858e160fdd0c10391d3b9f7b3704bce0fdde1abd3164d9f  formalization/paper/beat78-synthesis.md
1d51ce3de414b34367fd37b1d2d3cc85195744fb07b137e7dfcc98b428b249f5  formalization/paper/beat78-amplifier.md
26aa393f57b666c655f3d21ac2aef03a30649677a86cae813beaecdc1d1e5226  formalization/paper/beat78-meansquare.md
025bbfec7eb97fd278df3d363aa62c0943131b6f3457b2dc45116f4ea1f944bc  formalization/paper/beat78-height.md
2b543ee6e7b47809c7c474e1ba34e858651d0dc5c759a193d4745e533950f558  formalization/paper/beat78-project.md
b0529f56222611f77f023ce4f5d4dc7c6a1a935c3ec2753173f116f014e09703  formalization/paper/beat78-prop152-subtract.md
23d65e89d9cc33d87086d01ab95e4540c758d378a9df4ba99237e3114e394c09  formalization/paper/beat78-prop152-holder.md
8e539d22b375f226f7de5e6ed1ae77131c8fc9c1d891c5fd113a19fc94133c1d  formalization/paper/beat78-prop152-restrict.md
fbd19fad76dc0eab5b95e35df6bf39117db0dd4f0454ee70e589af29bf8f2956  formalization/paper/qrh-improvement-attempt-a.md
8de905246fe0bb43e801cafb03a47803cee64168f956dc46f61c80ab373e785b  formalization/paper/qrh-improvement-attempt-b.md
14abb611058f017e4606bca5153292c29ce67ecf0a90b74a40c365169d780b07  formalization/paper/verify_qrh_improvement_a.py
7d1aa71df0bc694a07e296f86cfe5e7b5e7aecf63704647e60fc8245f664bb7e  formalization/paper/qrh_improvement_a_sensitivity.py
```

## Raymond's deposit (local copies)

Files of Zenodo 10.5281/zenodo.22867547 as read by the project; the `.txt` files are text extractions.

Git status: 8 tracked.

```
fe06339d12cfefe00b9da826ff812e31bb1be3cdaa698b78d4d85ad8b0ae53a9  tmp/raymond-22867547/Analytic_Foundations.pdf
a0f9ad3f1be62ffcebef63d73c60578bb3f90a61d58cd87a0bb818be5713e67f  tmp/raymond-22867547/Analytic_Foundations.txt
ad3e552b7429e685514cfa4ccfadebe9daf382c8000d95afb584932f0e226787  tmp/raymond-22867547/Correlated_Translated_Probes.pdf
c6f9e1b6751df3c864609ee179bbaf1395af7071e733b744c3c6e38752f4cfe3  tmp/raymond-22867547/Correlated_Translated_Probes.tex
7dbd281ddaa8877ad16dc2d5ce174c713e16902fbe3ef0c4904922bfef518e50  tmp/raymond-22867547/Correlated_Translated_Probes.txt
67ab846089a3c72523d1b3b7f90f10ac7fc0764a6932719ddb3bc4a2adb69dc2  tmp/raymond-22867547/README.md
e0222e073a2fb34f5967d9fd116576a491290065759968de4a52dc7c726c6c75  tmp/raymond-22867547/Verification_Guide.pdf
b0c37edfee4c744c4f5c0df2492f709149181e1b538139bd7ec665337e4ee0c0  tmp/raymond-22867547/Verification_Guide.txt
```

## Reference copies

Polymath arXiv:1904.12438v2 (same hash as recorded in the earlier package) and its text extraction; text extractions of the openai/math manuscripts at commit `adc7f1241` (outside the repository, in the local openai/math workspace).

Git status: 2 outside repository, 2 untracked.

```
60d0d2d381227d32f98535a5c43dedb86e333a9006d6819f0bdebdd734085603  tmp/b145-C-refA/polymath.pdf
bb59a51107d51c0b7d312381dfb6b05f22e2fa99f8f4de5da0dd66d6b1096062  tmp/b145-C-refA/polymath.txt
71bed075a774d53b01fdda1f3974fce9731fd9a5525824375ce81f1864fab324  /tmp/qrh-verify/paper.txt
0534ea4c56a217963af12216d6ca47d9293657fdeeb751a9bc2ece78399f1169  /tmp/qrh-verify/paper2.txt
```

## Scripts

Producers, consumers, verifiers and review scripts.

Git status: 33 untracked.

```
8fdf51df51fb0ed9ea1c020483181d7c35a8c50d49f652eed0848a9d7ffffca5  tmp/oai-lambda-raymond.py
a3d2741bac9487033f87c2e819ebb0a1d23c26796ff379095f6ec5ece2f7b03c  tmp/oai-lambda-routeP.py
1ee1fe41bd5c430088f69dbaceca7b6bd2d94069c76e9d7f92a313603a59c44b  tmp/oai-lambda-classical.py
f61492f0d297416fd1ed0692488b1bc2751b1746a0c67541e413ff880b195892  tmp/oai-lambda-ref-raymond.py
23db9dbbba44b86243172eb705ce4bdcb9bc22b8624f351203086cd64e1e6312  tmp/oai-lambda-ref-routeP-verify.py
9e85bf6662202fcb6bfda78c9f0b94ebacec4f21d997189a6cda8b060f97739f  tmp/s145-1-g1/pipeline.py
3c5638e7e8db39df5ec043e12ed1db26fc87a03fe1e3412bc1f629825c1b9485  tmp/s145-1-g1/code/assemble_joint.py
f731403d47868165f6a8ea0a69f410320b08daa813089497dca74145d409111b  tmp/s145-1-g1/code/certify_coupled_probe.py
0c36f35c6021f99e297cd6954e4d72d08ca04a6d531059ca84299de2819ed451  tmp/b145-B-ccp.py
cce765d0194fd648c76c80bf32869683d54bfa963006436798652c4eb52200f3  tmp/qrh-tune-consume.py
00277bf317432a619febbb4bac796eae6cdd387b6d1385944e721d9d4b4878c2  tmp/qrh-tune-verify.py
056811ca90429376173afff36d7783682c8e1d393599c7811f947f051f744538  tmp/qrh-tune-final.sh
b74cf70907488e98d8ed2352c904be2ed482c872774daf31b5891d028607fab0  tmp/qrh-tune-ladder.sh
3caedcca8f6655d53150cfb82b2c244fdcce44cabeae70278ca59062fd9de73b  tmp/qrh-tune-fast.py
29f6f2675cf06f10aa0967cb308d2d62caa4759352deb0392935c4fae32b5868  tmp/qrh-ref-verify.py
17237caf3a1d7d09d408f62513967b9052865c5619396cbedaac520efae85dfd  tmp/qrh-ref-kcert.py
dd8ecc2505f3af75e79b7e35039f18cf860475d268cc6ffdf7fefdd606c8c5a4  tmp/qrh-ref-tables.py
0d5071b03b42175cb12948b2ac9c5505e6da490355ff40dfbbe43aa513ed366e  tmp/qrh-ref-run.sh
f93c3c1f8cfe503a0e08e5304e5afa1002115115eec28f065a31b4e06c50d960  tmp/qrh-recheck-extract.py
f93e32566da5e10ea7f3bf0820fee391948e8818a0c5b573fb47cdd76c604cb3  tmp/qrh-recheck-premises.py
8d1bbd78d38b69e1116426db4137bed3cbd89954527b0fa34ade61aa2426469e  tmp/qrh-theta-curve-raymond.sh
e59b5a3443bd54ca4a24a17d674b539072be5e1e8b91e4fea04e5517e8220595  tmp/qrh-theta-curve-routeP.sh
767b3f2a68aa569ce8d92e2c752fd7038938c26e13a152a3d585a41a912ebfb5  tmp/g0a-review-checks.py
3b14c390367eb54e3f6a5a8adb5cffdfa293e6568bc929e34a69f098aa248629  tmp/g0a-review-entry.py
cec6218e624a5f742f2327ea4108cab919f10af79fca8fdf1a51685a64f59c07  tmp/g0a-review-wall-direct.py
db4bebf16d0cd7aef4ebbe901d89fb6bf256a15b9a27591ed772408175520c1d  tmp/g0a-review-wall-ideal.py
4a3ebd77be31489467605787254c0bd27cbdba848d4c4ae6321871286af15871  tmp/g0-review-b-2026-10-08/capcheck.py
f66536dc014db216138b06c3cd0112777079a814c27d667b3e04e6c89431a1de  tmp/g0-review-b-2026-10-08/entry.py
108ec08450fac2a89290af57b9a3a59b527fc88cec4d0a95c35474c808c85ac9  tmp/g0-review-b-2026-10-08/instr.py
f570222ae8db90165740e89b03db643d87f2c38f048585b527604938edfc81da  tmp/g0-review-b-2026-10-08/kerncert.py
609a6a44c6ff8cb94319412fcb22d7d59a735aa91375ffb91f9f7f6fa648329b  tmp/g0-review-b-2026-10-08/kerncert2.py
c0dd8d57a75d10c750bf76c615c34ef23de0f03142cb0e99db645eac078360d1  tmp/g0-review-b-2026-10-08/part2.py
bc75fddb5284af407dfc2b3c5f7d1ef8197f7ef22a4cf963392832900ec08852  tmp/g0-review-b-2026-10-08/replay.py
```

## Run inputs: tables, plans, kernels

Raymond's plan, X1 tables and wall certificate; kernel catalogue; the height tables, plans, route-3 tables and r2 certfile read by value (ii).

Git status: 23 untracked.

```
9a9e860d17193be6cadd35b5298fa279bc5f856ba6fe1fe7481ae75d2f720545  tmp/s145-1-g1/data/PLAN.json
93906be068cbf146136c3c3a4be058853cb75ae24a5683184d30d54936035b7d  tmp/s145-1-g1/out/X1/TABLES.json
5054fae89927753adff0b9f75d2b87e17973171d0211860b02440bfbd2e5418a  tmp/s145-1-g1/out/WALL_X1_B.json
6c984a8db796e1f2f710bb80552963437a7af4df7c8200413350aba2adf077e1  tmp/oai-lambda-out/KERNELS_raymond_backup.json
2e393f4a514e0afb0c70f35fb07f5c7e69604231b9b5ca4095ba4d2f7de597ad  tmp/qrh-tune-out/xkernels_final.json
ac68137cc80e1d116be7cc6ca27686ab88ee0575234d0fdca3a80b9a123aa744  tmp/qrh-tune-out/archive/QA_m0.88/TABLES.json
3fa87a2faaba9db6294bb3732da902e712211f02c12eada36394366bec82c69b  tmp/qrh-tune-out/archive/QB_m0.91/TABLES.json
a5153d233010754d444b7c556bdc3b14ab7f9675c787fa98e8038de64bc4eb34  tmp/qrh-tune-out/archive/QC_cliff/TABLES.json
ca6a07e2079e99ad907ab1595152015424e75596f958c4854791847aae335b2c  tmp/qrh-tune-out/plans/QA_m0.88.json
b3cee76ff886fdedb03aba80c547902e40c7919b70960ddefae1f855c8504035  tmp/qrh-tune-out/plans/QB_m0.91.json
fcd1a56c861af662f57f2c531903510db357b43276ed78bf6b025113167c8509  tmp/qrh-tune-out/plans/QC_cliff.json
d2c86b6d4ef4a5c76b930a9ad6e24b43d67bb97dea6272da274421176c965e95  tmp/routes-b3-9-out/archive/W4_single/TABLES.json
703b46b023a6ccd30a2a6660a48dfe7ea234fda1bffe0fbd23f4777cd9ee563a  tmp/routes-b3-9-out/plans/W4_single.json
976c51fe9af93d70cc04dd4518052013f06ab1b936cc371d27a92ebb34c6e5b3  tmp/routes-b3-9-out/archive/X1_P0_97/TABLES.json
94a482c23eca7cd793f7dc843e41b5acdf720d58599528df89c4ec1fa939479e  tmp/b145-B-out/plans/X1_mult_0_97b.json
c3f378ea3d89fdc78ca19b5ba638b0939a47e2144b441d05b6f7d6759ccde06a  tmp/routes-b3-9-out/archive/X1_m0.94_c200_600/TABLES.json
0b0392920bb077cd73cd0d0b6cf48bbb283d414b6b8eac2fd2ebbef002b9e72f  tmp/routes-b3-9-out/plans/X1_mult_0.94.json
b9aa939475b34b40f297ecdc7d4d40096a7b9e47acd2231b078d21404d49244f  tmp/routes-b3-9-out/archive/X1_m0.91_c200_600/TABLES.json
89409682cca6faecf18f1d338ceb559872522a0bffb9a8958f09422d14e23365  tmp/routes-b3-9-out/plans/X1_mult_0.91.json
726988cd0860f2516bb3d71d02ff207d04d1037eab76cbf16bf929d4bb15664c  tmp/routes-b2-r3-out/tab_P.json
b238c817434d660a70c514e34deb4edca2d5ec48716be5dd22a137dabfa509a9  tmp/routes-b3-combine-out/tab_X.json
af1e0543e0f8fc7c30d0bbc6ca582d5a67137b6042995b0997c4784ebffbebd5  tmp/routes-b3-combine-out/tab_X2.json
48f73e86871d37b67c35d0ccac6992595e573684812205e0c12810f94199d41d  tmp/routes-b4-rec-joint-out/collect6/merge/certfile_fullref.json
```

## Run outputs

Results of the runs and verifiers. The per-substep dump of value (ii) is kept compressed in the repository tree; the uncompressed copy used by the verifiers is in `/tmp`.

Git status: 28 untracked.

```
e2c685750e37492172764066b9c37fedd5945e2dcaef6089c5c9dcf52a0f6634  tmp/oai-lambda-out/summary.json
6d9b92912a5f4eee587f8c7fdb010ec7f39e571329826c4fdc3a6d3d9e509cd3  tmp/oai-lambda-out/raymond_X1.json
6cebcae8c1bcbd44484013fea0f74aae17f1926b49a9c728b7bbfcc1706297ce  tmp/oai-lambda-out/routeP_t78.json
7dc21bfc94c58d1e8e1fe78324405383d3dec4a71e00be4889052ba9331c8eba  tmp/oai-lambda-out/routeP_t1112.json
f172b7d5ce65f0e4a77a64882bfe5d4bb6461ec4325d0d73cc9602273215716b  tmp/oai-lambda-out/routeP_strip.json
37975fd87534e3608a8122f08367e079b27ad096afb97158502d26cad72e676d  tmp/oai-lambda-ref-out/raymond_X1.json
1d96fab0c9c776bde2460cec2a6eb9e2bfc5fc786cc797467e73819410dacb17  tmp/oai-lambda-ref-out/raymond_X1_rob.json
e91db0eaea5aa53a6236f076cc84efae9bf19a13b3f5a332c13a875c46a7612a  tmp/oai-lambda-ref-out/routeP_t78_verify.json
969565590f41a6f1c6af96e2e833abe5309933bf9662e7a02bde6f1d271e2dfd  tmp/oai-lambda-ref-out/routeP_t1112_verify.json
e6fb7552d5559857b0cb82841973745b5b0d5df72a239330f101f78cd57093ea  tmp/qrh-tune-out/summary.json
10f43e3065753dd7f3a42fa06ed6ac67edc2198e28bc084397eb71d4c3a0a430  tmp/qrh-tune-out/F2_final.json
547b0d39ef27eba07e9fdb968d541800f0be8883c8e427a89877850b4475167b  tmp/qrh-tune-out/F2_final_verify.json
87665a4c17b51bc1c39bf403dc50d21f80e86cc9328c9046da40321402f2279c  tmp/qrh-tune-out/F2_final.steps.jsonl.gz
f2efc8f57f1f3983d3bc74a333a204806dc04b49a1c3d877188dfd81391feb9d  tmp/qrh-tune-out/lever3_targets.json
706febcb4ebd4c1971bf3666fe160da2c9c735cb4c5da2129927367c4f12a7ed  tmp/qrh-ref-out/F2_refverify.json
8b0a021ebc361e30cdc32ed3ab490b22b7b5ea7345959100999c96522e2d0a0d  tmp/qrh-ref-out/F2_rerun_refverify.json
82cc057481c538598d5d846b5bad75d67343ce31b8f7b6db6cc9ca37ff954c0c  tmp/qrh-ref-out/F2_tuneverify.json
8b2e21f32e70e1158409bb567d2204fc96202c42b9aa8335ec4647e7e5e504c3  tmp/qrh-ref-out/kc_final_new79_p64.jsonl
ce8df8664e8d0d2d4de611f397740072a3eac007c1ed9def3f70d4cb676cce50  tmp/qrh-ref-out/kc_final_usedF2_p128.jsonl
747d36d3c378898d8ff22fa15abd391a17ba896c73a1818562ff7ef298fbbde9  tmp/qrh-recheck-out/premises.json
2958791758d6e6d879e6e18e45272974aeb4371e9cf873d5bc5c36b65da40d4e  tmp/qrh-recheck-out/used_cells.json
62b23e3125b8801b3e19deaed7285f150050509774aa7621c7f1278e2fade462  tmp/qrh-theta-curve-out/table.json
c1aeec9c87a8fc3a060cd7c1ec66b14b392920c85e09b7044b88f812bce8e85d  tmp/qrh-theta-curve-out/raymond_X1.json
bccf94398edc60036c21399948e0a61bc1d829d1f5807ddeba88a809c6c5db23  tmp/qrh-theta-curve-out/routeP_t85.json
a4533735d53ee8a486ed007db7d4f6b5e406d8efa8ea5150de6534def4c77024  tmp/qrh-theta-curve-out/routeP_t85_verify.json
56bbaced2ff3a610e41958d52e7a6930bc05fae5c4d2cb6175fef97f516fef1e  tmp/qrh-theta-curve-out/routeP_t80.json
d885200d42e2f724ad7ec247a656565983c7bf325a4ea12cde00adde16f8b3c9  tmp/qrh-theta-curve-out/routeP_t80_verify.json
f068bad3df7e7ce5c530718d1acb28aac0fc6644c8ed4b6a585822cd61786389  tmp/g0-review-b-2026-10-08/kerncert_out.json
```

## Checks re-run for this package (2026-10-09)

Outside the repository, in `/tmp/qrh-paper-check/`.

Git status: .

```
```

## Lean: raymond-core

All files outside `.lake/`.

Git status: 12 tracked, 1 untracked.

```
fde850d24186b6e99c8c0debd641fb3ab85198b109eb66f71a1fea02bd6ea1b3  formalization/lean/raymond-core/.gitignore
78fc70bcb250556d1f8c1c4e54c0b57ce05e390718480fe0859f1c3441eb53d5  formalization/lean/raymond-core/README.md
d3067dce603c1cc4544f34ea5b245b2a8ed78b0734d279a39607f1babf81db1d  formalization/lean/raymond-core/RaymondCore.lean
a13eac3a12cd86ef31fa214dd3f70cae654c8a4da5789575f77ad03f7145d7db  formalization/lean/raymond-core/axioms-output.txt
458b13897c61da22dcba21c8a166616a5d33279194f9408cfbeaf6e9094fa2c4  formalization/lean/raymond-core/lake-manifest.json
b86a9d8fd99c1bdb2bda576388dfb1e70d55b406a27f6bef2f79100942ebf12e  formalization/lean/raymond-core/lakefile.toml
d5edba4e4b8faad9c1baeadb265716d20d03be4d1a2647dc5e35b0c0325bea7b  formalization/lean/raymond-core/lean-toolchain
af421c1c08a7c6bab4b90339cf6a50eca1c2c49356016cccf178a4f8127a251d  formalization/lean/raymond-core/RaymondCore/CG.lean
7f012083215d7a58836e6e197073bb8f0246f6384a6c8a38dbe7a92cb8e802a8  formalization/lean/raymond-core/RaymondCore/LemmaR.lean
facbae8bdc743296d57b1a421ba6b1037d4b40c487e729b3eef96f1189c344a5  formalization/lean/raymond-core/RaymondCore/Substitution.lean
ce41a3416532d2d943aaebba19a699fce24531c824920b5cc9f10e75c265d3ca  formalization/lean/raymond-core/RaymondCoreOAI/Instance78.lean
2274d48a9521cbc87e7e3005cb0e49f1a6a12e5cb54d3c9c01b616097cdc3fd1  formalization/lean/raymond-core/scripts/AxiomsCheck.lean
a983165e221ceaa8ed0a06f3d68473a5f9803bec258a3f78896d2350eef82ef8  formalization/lean/raymond-core/scripts/check-instance78.sh
```

## Lean: qrh-lambda

All files outside `.lake/` (sources, chunk certificates, data, scripts, axiom outputs, build logs, exports, vendored inputs).

Git status: 94 tracked, 8 untracked.

```
fde850d24186b6e99c8c0debd641fb3ab85198b109eb66f71a1fea02bd6ea1b3  formalization/lean/qrh-lambda/.gitignore
ae25c4d5d818e2a34dc4f40e929534e4dadb101a8ed4c7f1c79967e3770c5fd1  formalization/lean/qrh-lambda/QrhLambda.lean
ff5bebc6691365054f88e904aab0419417443c80ba9ad5eec8923f6948068097  formalization/lean/qrh-lambda/README.md
4887d7211ac6b8cf08c710a9663d36963b10c29db2ba36b239da2008a3f626d5  formalization/lean/qrh-lambda/axioms-output.txt
1424a9101d51122f5075710a02269ee16d3b0673b888803ddd656a473c39b155  formalization/lean/qrh-lambda/lake-manifest.json
73280db2b5a6d677d6354881a511d5d1b88c2a5eec2b4d800e3c6c2824a14bea  formalization/lean/qrh-lambda/lakefile.toml
d5edba4e4b8faad9c1baeadb265716d20d03be4d1a2647dc5e35b0c0325bea7b  formalization/lean/qrh-lambda/lean-toolchain
8a08f0aa59a7320ac4fa62414fe8bb406897f6c05873598e2aaabc707adb1d14  formalization/lean/qrh-lambda/oai-axioms-output.txt
8b241edba5dddd8c88928c4df3a260f4dd16683e09a28bba783f85964258b11e  formalization/lean/qrh-lambda/QrhLambda/Barrier.lean
1b184b79d88ac5b0993206e06e02222b755469a17bac1e66bf5c3de971093105  formalization/lean/qrh-lambda/QrhLambda/Cap.lean
5a7dd39bcd73ba0a9108011678d4a39834e912bc2409414c68f0ef22c1d216a3  formalization/lean/qrh-lambda/QrhLambda/Checker.lean
0425bdd62fce4d1cd808e0c0ff969c87484a4b692980ae570d96c9954af1d389  formalization/lean/qrh-lambda/QrhLambda/Defs.lean
32109a38593904d60b3c36bef040d59b9103a9babcf608143d83d254ba675134  formalization/lean/qrh-lambda/QrhLambda/ExpLog.lean
01054bac9e184826a90702c24fe0c3a40cbc4059fe62eb5cd611714d9baa9537  formalization/lean/qrh-lambda/QrhLambda/F2Chunks.lean
4b446b942803f26352f96c70ea372592bf285ecab9d1c5978ea8f16001c0e9ac  formalization/lean/qrh-lambda/QrhLambda/Flow.lean
92a5888563a38d2e957816589cfe82357e0deb8baa908d3eda45bebce6bd5e7d  formalization/lean/qrh-lambda/QrhLambda/Hyps.lean
47f55a2851951bb6f1e094fd9eb41b048d2602ea2e5e5356a93509cbfb9f5b41  formalization/lean/qrh-lambda/QrhLambda/Main.lean
fd3b1bf700f493662041a396109bf05646a31f2074215192e85f39c5cc77eb82  formalization/lean/qrh-lambda/QrhLambda/R78Chunks.lean
5e58a0de36da2a6569833d9c5b5a186d97273cdab691ce48269159406b67b93a  formalization/lean/qrh-lambda/QrhLambda/Sound.lean
29743e4a90d0fd023b912d1fdda0acb39cb43c06fd8f6f5323364b67e0453fbc  formalization/lean/qrh-lambda/QrhLambda/Terminal11.lean
1de9d1bb03820be9bd2df145088cb22221b72fc6149a6e299a6320df68534863  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C00.lean
67c1272a01a1609f9f5f69294bd4d35ed9ae149169ba748ed5c58eb7b5ee8f85  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C01.lean
38246d4e8ee979c7c22968e3eead2dff5e2ec62a94c8f83f64bbf1c7882e8994  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C02.lean
cbff85d157ee08115392455f0786d18ed9201fac2f4d6c250ac4503a1979f070  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C03.lean
68f0ba5cdd6e606150f9e6d3cfc84f98d622413cab53e4f2e1fcb52fe4e8db32  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C04.lean
9b275ec40cb471a62ee2ca0969efb65db86d7f229b480da6c0ba67c8f34171b4  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C05.lean
af9a4e5af6246cca4c53159c52444fd456e43c5228ad14332b024ef6124dbfb1  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C06.lean
8470dcb28f1ec2ad1414efb041b5fd5527dcbec67014e0251fa637570ec1998a  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C07.lean
8379b878e5178831f92b87753d29f4c8c034e29935e2057920fa8c8da1d67ebd  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C08.lean
77e7b6024b229b70be840cc35a69cb05aa0a12bce781f7e59dedbbc03e21518e  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C09.lean
4a8490cdd603eea614b5c9cae20533578a8d2fb445048959aec059ee5883d5e6  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C10.lean
89105b375108a58051e2c885c126b53ac643e35c7ecf81dfa8817fdaf418fe1f  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C11.lean
2477a619d61c6bff4361936cf624b025501008ff71a4d080f66934b70bb04e17  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C12.lean
3382f8ce029c081bed18328c8da1dbeb65064e6779170c643044c01788a47b60  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C13.lean
756f15750a8c75ac1f7f6a9c37eab8adef33148148f2316153f129101944c9e5  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C14.lean
bd7e546fda809c41016e1f1fa14fc00127332da2a7d2d6935887a10418fd5ba2  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C15.lean
15feeb7efadc25d1d5c643b01d1a5d6833e68505155a6bfb472ab4fecf0979c8  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C16.lean
66e3164b7fd336114da81bc84dae71615ef0ef8dad6cc1e524f6df6773fad901  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C17.lean
b48169711706398c012fd9f94bdb1842aa6f89108d03ab221a292604fc59da22  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C18.lean
56895e09b2d4bf700a180d8f2d24f0ae426bf86ce72db4ad437418ecab74a0d1  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C19.lean
0f512aabe262384d40421400ac2bb5c5ae1afe8ab8f3df342bc06a4e3733d9f3  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C20.lean
66e58bd5ebe256bb7680b83066fe4b1dc160e3f66efa676df6cafb74692a4bd3  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C21.lean
06e06c4f5bb20d0d69169178562837a2a3cc6559e350c5ee37ba43dd89173fea  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C22.lean
d0f6c2d5dbf162dc8281e5da2f74c949c2cccedddd3991ce92201bc94c73365e  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C23.lean
7147f5a657826a3782302a9255e692fc03c66589c497aa2271a4f92873154640  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C24.lean
427476b87bc1fb1011cd0e46d4ef1c05a493aae7b0c75d566ca9194e0e0ba6a9  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C25.lean
9c3e8bf94c80084590daea194d045d7aa662b4ab5a8d995897e5bb1424f0f212  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C26.lean
6c0a7bbe8b21601e6328d13fb94f05bc8b24306c140780a5251c822fcba09ac8  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C27.lean
b289204b2d38a6cd9440c7e876aaeb7d35eb666c3a4d849da38d9e77befd7e3c  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C28.lean
a4334e8befa03604fd36a45e6e0217b2449670ec52b439f2359a87ddf9d67c71  formalization/lean/qrh-lambda/QrhLambda/Chunks/F2C29.lean
8fc299d06c35b9dcc58d4ecd0ede8d923c7cfe11cefd2efe09bb8d05c4c1c42d  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C00.lean
f68857b51e73548f65080fcee6bf561a4b082210b8f47269a705571d2ccd0579  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C01.lean
b7148e9571e359f76b015a6904655f25c729ae4dc05df80a3ab8d165e69f4806  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C02.lean
eca285381029b4b54d67ad2b6cc2f87000c4057b2284da22bc49c7674cd8191c  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C03.lean
446ce6460dd2794b68f42993ca3318fc47fadfb6caa9d56fe33ab178aa87f3ba  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C04.lean
77d5a4baa3a6e269a9b06ae8dff78fbd6f7b79479bb6dd7d7bd5406f125167c3  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C05.lean
1394702aff519a84f07cc9a12ae2c05e99762af8e1c51e05d4f8e839f5d1fe35  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C06.lean
8936898a774d6b3ef20209595ff02a9900ecd61806e418627f36574a8f86c9e4  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C07.lean
ffa852cd3140be7b7ea20ff12eec1c5f0789b6efb34d791703fba2f38304b6f8  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C08.lean
38dfd43582abc098eefb88c0ff12df342cb682a56bacd370d7b663fbf0b257bf  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C09.lean
cda36900367e2fe57f9eb45491cf9bbf8f5aae2f046820e082edcb05f929bf00  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C10.lean
f768ed4c8904a7dced2f68ce5f3a95119b995b89b724a392a632948934bdda8d  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C11.lean
4e712e8b34f2a5d697bc4c50867b3100835ced7f404f8d57113e7960b7edb17f  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C12.lean
ecfceef567cea6ace474f6a1751e634906132055cc3de55b014848ead40ca314  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C13.lean
6630ebc8377d398fd81eab9b3bede087edb867b6c721fee3cb258cbe466381f2  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C14.lean
68f2b3a7b559b1516b91544a1f9674499310058cf6109c95d59acdc435940b25  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C15.lean
ccf530195056a0fddac63536fc4c0e89362caf79e614b212a4281fffd2f73f51  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C16.lean
471b74ab660b19fed92c7842709c9654441ccbef69d0c09de34b39fda19386e3  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C17.lean
45a0067ee8fa3040d31e759b946e783233f77fdd6067139a09ae52fb9cf9a125  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C18.lean
7922eab9c4f2938fef7cf4a75359ae58c5eca885e55505dfa6a3e7e98a42dd49  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C19.lean
00b66bf37bfd7c514c5553e51425fcda062185c245067824a8f0a209dac93582  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C20.lean
1aacb7d1f55145639eb7ddf9ab043aed49cf888f75835602ef31f4d6fb972d7b  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C21.lean
b6f98a641078a0993d53bad8b1525fd55f3ecaec99f43e1ec36f659d7760470d  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C22.lean
d24e9a8c1d33ba63bf4eeef5258b7abfe226f7644b0540d3f37040170b417638  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C23.lean
02e226bfc9a1ea47d3f55b79d540023318832735f6eedc5f8790e9bf8c0adbc5  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C24.lean
ce8ac78dd3065f31162a1299fbc318f0a56aa5df6bfbec2299908780b039758f  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C25.lean
f46bf5127b1735e1733e764877d36384f2872fc27f309605b3abab59623d9072  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C26.lean
15afc76b4f6bd3b31556d2cf00a9328c538bab17b93597a00c4bee5756ad9d53  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C27.lean
9d5ea43285cf483dda259a9bff477f3ba41e1ffd71149a08a55323970d0246c3  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C28.lean
0627ca204bf72b9ed644fc6702ba86817cd14901b2bf61b66a7a9825fb96ee1a  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C29.lean
8a05d1a68f1ff4b6554578715efd491f2a2c8d128caf3aaf996fe89b71260095  formalization/lean/qrh-lambda/QrhLambda/Chunks/R78C30.lean
39f326e878e34cf7b0a7c13574b1ffe2f52a27d8f5432565cbdaa140212a5756  formalization/lean/qrh-lambda/QrhLambda/Data/F2.lean
35600c60e168191ebcaf72be09889616e51e45fc8951208b2cdb1d4a6409d26d  formalization/lean/qrh-lambda/QrhLambda/Data/R78.lean
eba49d952ecbae01a85725e7db5c43a1728a40b41f637b42a7867d70dc23f104  formalization/lean/qrh-lambda/QrhLambdaOAI/Main78.lean
405ba118af5e56345723e4c3c5b4652dfb27a31f32aaf09c0b9f7340f7fe7093  formalization/lean/qrh-lambda/build-logs/F2-chunks.log
1aa69a5f2294b938a5e9547b181861fb067830352d3436ebaa2ee7203f299ca0  formalization/lean/qrh-lambda/build-logs/R78-chunks.log
9d692492910d2fec490d196798d8deb9457bea337f594f7066e26b3b2306c343  formalization/lean/qrh-lambda/build-logs/chunk-timing.txt
a5d008ac727172cf2dccd7bf4fc50bbb4b279ba87dfee0f03a7805684c3930ad  formalization/lean/qrh-lambda/build-logs/mem-samples.txt
1cfe563a17ed869a0c3c783eaf245661148a24f9c6b1719119919a4be1694876  formalization/lean/qrh-lambda/build-logs/rebuild-2026-10-09-referee.log
352d932305f1337115fd747036edfd64e36f37685a7dda4e00dbebad9fe8a931  formalization/lean/qrh-lambda/exports/f2_export.json
6e807a4630babb65bc342b5a1c698bfb130807c85f228c3b8a7e5a48e42b9fd1  formalization/lean/qrh-lambda/exports/r78_export.json
6c984a8db796e1f2f710bb80552963437a7af4df7c8200413350aba2adf077e1  formalization/lean/qrh-lambda/inputs/KERNELS.json
3b50588099443ea7d18d4ce1c1a4280bb634d9b9b637bf9a060717e77664f1a3  formalization/lean/qrh-lambda/inputs/TABLES_NEW.json
bac03bf0214d4a5c7cc9af49f874a439a635aac67b21da3d6e94611cc7252b3b  formalization/lean/qrh-lambda/scripts/AxiomsCheck.lean
e64df5eee26ca1733cd8db6ede09bd3d426ba1e016a87b6bafccbf44f13206ac  formalization/lean/qrh-lambda/scripts/NegativeControl.lean
960e9b8b3ef0189a9e1a0dacc44362db77e6296aebcb0d8ecd05269375ec0152  formalization/lean/qrh-lambda/scripts/build_chunks.sh
5df7dfa28b5501e32d4960d427a9d72b98a2f26fb9b9fe46b9e1840eecd9593e  formalization/lean/qrh-lambda/scripts/check-oai.sh
626fa63904493602c1a84b4ffa6cfb515b3caaff38d2b9fe711dd8351baac4d8  formalization/lean/qrh-lambda/scripts/export_f2.py
03badd44d9c50fd6e1590b5f42cbfaaf11081537dc364de5ea133c75988c1cee  formalization/lean/qrh-lambda/scripts/export_r78.py
fb27cb746f27740ee5d050c341ab2439842601113f5770144e9163ca4761b31c  formalization/lean/qrh-lambda/scripts/gen_lean.py
48f28d4ad2038cfacc86230dcfe06d5507a399d32c9889b3f054f5e5e27d47b5  formalization/lean/qrh-lambda/scripts/mem_sampler.sh
a196a2c92b6289c7cb392d0249bb88425e8503b8b2f21486f9d727d7b1b114d8  formalization/lean/qrh-lambda/scripts/time_chunks.sh
```

## Lean: referee consistency proof

The internal referee's proof that the named hypotheses follow from RH (`QrhLambda.Referee.raymondChainHyps_of_RH`) and its axiom output, in the referee's copy outside the repository.

Git status: .

```
```

## Lean: openai/math check files

Statement and axiom checks for the 7/8 theorem, in the local openai/math workspace (outside the repository).

Git status: 6 outside repository.

```
465e45439c31fdd5a7930c2bd1e7e431c8a7ccd1c67060e8162d38c100fabf8c  /tmp/qrh-verify/check/ChallengeType.lean
aa182e8bca38d98532b4729bbec34971f58f099d7b4fd58ed5f42e30630c8a7d  /tmp/qrh-verify/check/SolutionType.lean
79e4f5eae68cfffcc75d084863806c8da9e5a50ca3767b0ee614a075c463e151  /tmp/qrh-verify/check/challenge.out
da75e4ef0e6ec162ab1648ca3d1419c22652d2e0276c2feb3f388fcfce056e27  /tmp/qrh-verify/check/challenge.types
41a8ab3189d7381a84a5d699ec05bc48175be7aaadfc19666043313ef7d39deb  /tmp/qrh-verify/check/solution.out
da75e4ef0e6ec162ab1648ca3d1419c22652d2e0276c2feb3f388fcfce056e27  /tmp/qrh-verify/check/solution.types
```

## Not found when hashing

* `/tmp/qrh-tune-dump-F2_final.steps.jsonl`
* `/tmp/qrh-paper-check/raymond78.json`
* `/tmp/qrh-paper-check/raymond78.log`
* `/tmp/qrh-paper-check/run_refverify.sh`
* `/tmp/qrh-paper-check/F2_refverify.json`
* `/tmp/qrh-paper-check/F2_refverify.log`
* `/tmp/qrh-referee-20261009/qrh-lambda/referee/RefereeSanity.lean`
* `/tmp/qrh-referee-20261009/logs/sanity.out`
