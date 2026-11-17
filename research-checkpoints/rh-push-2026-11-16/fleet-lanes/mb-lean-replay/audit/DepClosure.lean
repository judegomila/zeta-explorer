open Lean Elab Command in
run_cmd do
  let env ← getEnv
  let ms := env.header.moduleNames
  IO.FS.writeFile "dep-closure-modules.txt" ("\n".intercalate (ms.toList.map toString) ++ "\n")
  logInfo m!"closure modules: {ms.size}"
