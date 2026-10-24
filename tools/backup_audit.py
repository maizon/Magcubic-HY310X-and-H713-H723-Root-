#!/usr/bin/env python3
"""Offline validator/extractor of personal H713 backup archives.

Does NOT access ADB, write block devices or publish backups.
Standard-library only, Python 3.9+.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import sys
import zipfile

MAX_FILE_BYTES = 128 * 1024 * 1024
MAX_TOTAL_BYTES = 2 * 1024 * 1024 * 1024
NAME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_]{0,63}\.img$")
SENSITIVE = {"private", "metadata", "env_a", "env_b", "misc", "frp",
             "Reserve0_a", "Reserve0_b", "bootloader_a", "bootloader_b"}

def checked_name(name: str) -> str:
    """Validate ZIP paths and produce safe leaf filename."""
    if "\\" in name or name.startswith("/"):
        raise ValueError("unsafe absolute/backslash ZIP path")
    parts = PurePosixPath(name).parts
    if not parts or any(part in {"..", "."} for part in parts):
        raise ValueError("unsafe traversal path")
    leaf = parts[-1]
    if not NAME_RE.fullmatch(leaf):
        raise ValueError("invalid image name")
    return leaf

def sha256_stream(stream, output=None):
    h = hashlib.sha256()
    count = 0
    while True:
        chunk = stream.read(1024 * 1024)
        if not chunk:
            break
        count += len(chunk)
        if count > MAX_FILE_BYTES:
            raise ValueError("image exceeds max size")
        h.update(chunk)
        if output is not None:
            output.write(chunk)
    return count, h.hexdigest()

def audit(zip_path: Path, reference=None, destination=None):
    reference = reference or {}
    sizes = reference.get("expected_sizes", {})
    sha_public = reference.get("public_reference_sha256", {})
    results = []
    problems = []
    seen = set()
    declared_total = 0
    with zipfile.ZipFile(zip_path) as archive:
        members = []
        for info in archive.infolist():
            if info.is_dir():
                continue
            if not info.filename.lower().endswith(".img"):
                continue
            try:
                name = checked_name(info.filename)
            except ValueError as exc:
                problems.append(f"{info.filename!r}: {exc}")
                continue
            # ZIP Unix symbolic link mode (do not read as normal files).
            if ((info.external_attr >> 16) & 0o170000) == 0o120000:
                problems.append(f"{name}: symlink rejected")
                continue
            if name in seen:
                problems.append(f"{name}: duplicate image")
                continue
            seen.add(name)
            if not 0 < info.file_size <= MAX_FILE_BYTES:
                problems.append(f"{name}: invalid/oversize length")
                continue
            declared_total += info.file_size
            if declared_total > MAX_TOTAL_BYTES:
                problems.append("archive exceeds maximum uncompressed size")
                break
            members.append((info, name))
        if destination is not None and not problems:
            destination.mkdir(parents=True, exist_ok=True)
        for info, name in members:
            output = None
            try:
                target = destination / name if destination is not None else None
                # Never overwrite an existing backup by accident.
                if target is not None:
                    output = target.open("xb")
                with archive.open(info, "r") as source:
                    count, digest = sha256_stream(source, output)
            except (OSError, ValueError, zipfile.BadZipFile) as exc:
                problems.append(f"{name}: {exc}")
                continue
            finally:
                if output is not None:
                    output.close()
            flags = []
            if count != info.file_size:
                flags.append("extracted byte count differs from ZIP")
            if name in sizes and count != sizes[name]:
                flags.append("expected size mismatch")
            if name in sha_public and digest.lower() != sha_public[name].lower():
                flags.append("reference SHA-256 mismatch")
            if flags:
                problems.append(f"{name}: " + "; ".join(flags))
            results.append({"file": name, "bytes": count, "sha256": digest,
                            "sensitive": name[:-4] in SENSITIVE,
                            "status": "FAIL" if flags else "OK"})
    missing = sorted(set(sizes) - {item["file"] for item in results}) if sizes else []
    for name in missing:
        problems.append(f"{name}: missing from archive")
    return {"images": results, "count": len(results), "total_bytes": sum(i["bytes"] for i in results),
            "missing_reference": missing, "problems": problems, "ok": not problems}

def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help="ZIP containing *.img backups")
    parser.add_argument("--reference", type=Path, help="optional sanitized case-reference JSON")
    parser.add_argument("--extract", type=Path, help="PRIVATE destination; never publish")
    parser.add_argument("--json-out", type=Path, help="LOCAL report (may include unique hashes)")
    args = parser.parse_args(argv)
    if not args.archive.is_file():
        parser.error("archive does not exist")
    if args.extract is not None:
        if args.extract.resolve() == args.archive.parent.resolve():
            parser.error("extract into a separate private directory, not ZIP parent")
    reference = json.loads(args.reference.read_text(encoding="utf-8")) if args.reference else None
    try:
        result = audit(args.archive, reference, args.extract)
    except (OSError, ValueError, zipfile.BadZipFile) as exc:
        print("ERROR:", exc, file=sys.stderr)
        return 2
    print(f"Valid images: {sum(x['status']=='OK' for x in result['images'])}/{result['count']}")
    print(f"Uncompressed bytes: {result['total_bytes']:,}")
    for img in result["images"]:
        print(f"  [{img['status']}] {img['file']}: {img['bytes']:,} bytes" +
              (" [PRIVATE: do not publish]" if img["sensitive"] else ""))
    for problem in result["problems"]:
        print("  [FAIL]", problem)
    if args.json_out:
        args.json_out.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        print("Local JSON:", args.json_out, "(contains raw image hashes; keep private)")
    print("PASS" if result["ok"] else "FAIL")
    return 0 if result["ok"] else 1

if __name__ == "__main__":
    raise SystemExit(main())
