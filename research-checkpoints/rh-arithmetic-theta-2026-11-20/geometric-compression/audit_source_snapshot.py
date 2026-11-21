#!/usr/bin/env python3
"""Read-only source inventory and import-closure audit; never compiles Lean.

This checks a pinned Git checkout and lexical facts, not Lean proof terms.
No source text or third-party proof bodies are copied into the JSON report.
"""

import argparse
from collections import Counter, deque
import hashlib
import json
from pathlib import Path
import re
import subprocess

PIN = "c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2"
EARLIER_PIN = "712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9"
SUSPECT = re.compile(r"\b(?:axiom|sorry|admit|native_decide|implemented_by|extern|unsafe|opaque|skipKernelTC)\b")
IMPORT = re.compile(r"^\s*(?:(?:public|private)\s+)?import\s+([^\n]+)", re.MULTILINE)


def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args])


def mask_comments_and_strings(text):
    """Preserve newlines while masking nested comments and double-quoted strings."""
    out = list(text)
    i, depth, string = 0, 0, False
    while i < len(text):
        if depth:
            if text.startswith("/-", i):
                out[i:i+2] = "  "
                depth += 1
                i += 2
            elif text.startswith("-/", i):
                out[i:i+2] = "  "
                depth -= 1
                i += 2
            else:
                if text[i] != "\n":
                    out[i] = " "
                i += 1
        elif string:
            if text[i] == "\\" and i + 1 < len(text):
                out[i] = " "
                if text[i+1] != "\n":
                    out[i+1] = " "
                i += 2
            else:
                string = text[i] != '"'
                if text[i] != "\n":
                    out[i] = " "
                i += 1
        elif text.startswith("--", i):
            end = text.find("\n", i)
            if end < 0:
                end = len(text)
            out[i:end] = " " * (end-i)
            i = end
        elif text.startswith("/-", i):
            out[i:i+2] = "  "
            depth = 1
            i += 2
        elif text[i] == '"':
            string = True
            out[i] = " "
            i += 1
        else:
            i += 1
    if depth or string:
        raise ValueError("Unterminated comment or double-quoted string")
    return "".join(out)


def audit(root):
    head = git(root, "rev-parse", "HEAD").decode().strip()
    if head != PIN:
        raise ValueError(f"Expected pinned revision {PIN}; got {head}")
    records = git(root, "ls-tree", "-r", "-z", "--long", "HEAD", "--", "src").split(b"\0")
    modules, metadata, flags = {}, {}, []
    manifest = hashlib.sha256()
    total_bytes = total_lines = 0
    for record in records:
        if not record:
            continue
        info, name_bytes = record.split(b"\t", 1)
        mode, kind, blob, size = info.decode().split()
        name = name_bytes.decode()
        if not name.endswith(".lean"):
            continue
        if kind != "blob" or mode != "100644":
            raise ValueError(f"Unexpected source object: {name}")
        payload = (root / name).read_bytes()
        actual_blob = hashlib.sha1(b"blob " + str(len(payload)).encode() + b"\0" + payload).hexdigest()
        if actual_blob != blob or len(payload) != int(size):
            raise ValueError(f"Checkout differs from pinned source: {name}")
        digest = hashlib.sha256(payload).hexdigest()
        manifest.update(name.encode() + b"\0" + digest.encode() + b"\n")
        text = payload.decode("utf-8")
        # The submitted files have no comments; avoid unnecessary character scans.
        clean = mask_comments_and_strings(text) if ('/-' in text or '--' in text or '"' in text) else text
        module = name[4:-5].replace("/", ".")
        imports = [token for match in IMPORT.finditer(clean) for token in match.group(1).split()]
        modules[module] = imports
        metadata[module] = {"path": name, "git_blob_sha": blob, "sha256": digest, "bytes": len(payload)}
        for match in SUSPECT.finditer(clean):
            flags.append({"module": module, "token": match.group(), "line": clean.count("\n", 0, match.start())+1})
        total_bytes += len(payload)
        total_lines += len(payload.splitlines())

    roots = {m.split(".")[0] for m in modules}
    closure, external, missing = set(), set(), set()
    todo = ["Main"]
    while todo:
        current = todo.pop()
        if current in closure:
            continue
        if current not in modules:
            raise ValueError(f"Missing entry module {current}")
        closure.add(current)
        for dependency in modules[current]:
            if dependency in modules:
                todo.append(dependency)
            elif dependency.split(".")[0] in roots:
                missing.add(dependency)
            else:
                external.add(dependency)

    indegree = {m: 0 for m in closure}
    reverse = {m: [] for m in closure}
    for m in closure:
        for dependency in set(modules[m]):
            if dependency in closure:
                indegree[m] += 1
                reverse[dependency].append(m)
    ready = deque(m for m, d in indegree.items() if d == 0)
    processed = 0
    while ready:
        m = ready.popleft()
        processed += 1
        for user in reverse[m]:
            indegree[user] -= 1
            if indegree[user] == 0:
                ready.append(user)

    differences = git(root, "diff", "--name-status", EARLIER_PIN, PIN, "--", "src").decode().splitlines()
    selected = [
        "Main", "Statements", "Challenge",
        "Formalism.SharpRestriction.CuspSpanNormBounds.MinorIntegralityTorus",
        "Formalism.SharpRestriction.CuspSpanNormBounds.KTwoCosetCount",
        "Formalism.SharpRestriction.CuspSpanNormBounds.WeightedLatticeSum",
        "Formalism.SharpRestriction.CuspSpanNormBounds.BruhatCellsKronecker.ShiftedParametersOfDifferingLetters",
        "Development.AbelianVarietyTheory.Proofs.FlagMeasures.OffK0Closed",
    ]
    report = {
        "schema_version": 1,
        "scope": "Pinned byte verification and static import/keyword audit only; no Lean compilation, axiom-closure check, proof-term dependency extraction, or independent kernel replay.",
        "source_repository": "https://github.com/leanprover-community/riemann-hypothesis",
        "source_commit": PIN,
        "earlier_commit": EARLIER_PIN,
        "source_tree_git_sha": git(root, "rev-parse", "HEAD:src").decode().strip(),
        "earlier_source_tree_git_sha": git(root, "rev-parse", f"{EARLIER_PIN}:src").decode().strip(),
        "source_diff_from_earlier_pin": differences,
        "all_lean_files": len(modules),
        "all_lean_bytes": total_bytes,
        "all_lean_lines": total_lines,
        "sorted_git_inventory_sha256": manifest.hexdigest(),
        "main_import_closure_files": len(closure),
        "main_import_closure_by_library": dict(sorted(Counter(m.split(".")[0] for m in closure).items())),
        "outside_main_import_closure": sorted(set(modules)-closure),
        "external_imports": sorted(external),
        "unresolved_project_imports": sorted(missing),
        "import_graph_acyclic": processed == len(closure),
        "keyword_occurrences_in_main_import_closure": [x for x in flags if x["module"] in closure],
        "keyword_occurrences_outside_main_import_closure": [x for x in flags if x["module"] not in closure],
        "selected_source_fingerprints": [metadata[m] for m in selected if m in metadata],
        "conclusion": "Static checks completed; no verdict on the claimed RH proof.",
    }
    if missing or processed != len(closure):
        raise ValueError("Unresolved local imports or an import cycle; report cannot be accepted")
    return report


def self_test():
    example = 'import A B\n/- outer /- sorry -/ axiom -/\nimport C\n-- admit\ndef s := "unsafe \\" opaque"\n'
    masked = mask_comments_and_strings(example)
    assert [x for m in IMPORT.finditer(masked) for x in m.group(1).split()] == ["A", "B", "C"]
    assert SUSPECT.findall(masked) == []
    assert SUSPECT.findall(mask_comments_and_strings("theorem t : False := by sorry\n")) == ["sorry"]
    assert SUSPECT.findall(mask_comments_and_strings("axiom t : False\n")) == ["axiom"]
    try:
        mask_comments_and_strings("/- unterminated")
    except ValueError:
        pass
    else:
        raise AssertionError("Unterminated comment accepted")
    print("PASS: imports, nested comments, strings, admissions, and malformed-input controls")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", nargs="?", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
    else:
        if args.source is None or args.output is None:
            parser.error("source and --output are required")
        result = audit(args.source)
        args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
        print(json.dumps({key: result[key] for key in ["source_commit", "all_lean_files", "main_import_closure_files", "unresolved_project_imports", "import_graph_acyclic", "source_diff_from_earlier_pin"]}, indent=2))
