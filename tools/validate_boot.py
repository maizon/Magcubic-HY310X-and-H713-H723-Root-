#!/usr/bin/env python3
"""Validate Android boot image headers, sizes and hashes OFFLINE. No flashing."""
import argparse
import hashlib
from pathlib import Path
import sys

MAGIC = b"ANDROID!"
def inspect(path):
    h = hashlib.sha256()
    size = 0
    with path.open("rb") as handle:
        head = handle.read(8)
        h.update(head)
        size = len(head)
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
            size += len(chunk)
    return {"file": path.name, "size": size, "sha256": h.hexdigest(),
            "android_boot_magic": head == MAGIC}

def main(argv=None):
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument("--original", type=Path, required=True)
    a.add_argument("--patched", type=Path)
    a.add_argument("--expected-original-sha")
    a.add_argument("--expected-patched-sha")
    args = a.parse_args(argv)
    originals = inspect(args.original)
    patched = inspect(args.patched) if args.patched else None
    errors = []
    for label, r, expected in [("original", originals, args.expected_original_sha),
                                ("patched", patched, args.expected_patched_sha)]:
        if r is None:
            continue
        print(f"{label}: {r['file']} ({r['size']:,} bytes)")
        print("  SHA-256:", r["sha256"])
        print("  ANDROID! magic:", r["android_boot_magic"])
        if not r["android_boot_magic"]:
            errors.append(f"{label}: invalid Android boot magic")
        if expected and r["sha256"] != expected.lower():
            errors.append(f"{label}: SHA-256 mismatch")
    if patched:
        if patched["size"] != originals["size"]:
            errors.append("patched size differs from original")
        if patched["sha256"] == originals["sha256"]:
            errors.append("patch identical to original; verify patcher output")
    if errors:
        for problem in errors:
            print("ERROR:", problem, file=sys.stderr)
        return 1
    print("PASS: basic offline integrity checks only; boot compatibility NOT proven")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
