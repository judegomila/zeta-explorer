import DedekindZetaSolution
import DedekindZetaChallenge
open Lean Elab Command Meta
#print axioms DedekindZetaZeroFree.main
#print axioms DedekindZetaZeroFree.heckeCorollary
#print axioms DedekindZetaZeroFree.dedekindZeta_ne_zero
#print axioms DedekindZetaZeroFree.heckeL_ne_zero
set_option pp.fullNames true in
#check @DedekindZetaZeroFree.dedekindZeta_ne_zero
set_option pp.fullNames true in
#check @DedekindZetaZeroFree.heckeL_ne_zero
def stmtConsts (n : Name) : CommandElabM Unit := do
  let env ← getEnv
  let some ci := env.find? n | throwError "missing {n}"
  let mut out := #[]
  for c in ci.type.getUsedConstants do
    let m := match env.getModuleIdxFor? c with
      | some i => toString env.header.moduleNames[i.toNat]!
      | none => "<this file>"
    out := out.push s!"  {c}  @ {m}"
  logInfo m!"STATEMENT CONSTANTS of {n}:\n{"\n".intercalate out.toList}"
run_cmd stmtConsts ``DedekindZetaZeroFree.dedekindZeta_ne_zero
run_cmd stmtConsts ``DedekindZetaZeroFree.heckeL_ne_zero
run_cmd do
  let env ← getEnv
  let ms := env.header.moduleNames
  IO.FS.writeFile "closure-all-modules.txt" ("\n".intercalate (ms.toList.map toString) ++ "\n")
  logInfo m!"closure modules: {ms.size}"
