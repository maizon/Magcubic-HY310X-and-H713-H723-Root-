import hashlib
import json
from pathlib import Path
import tempfile
import unittest
import zipfile
from tools.backup_audit import audit, checked_name

class BackupAuditTests(unittest.TestCase):
    def test_safe_filename(self):
        self.assertEqual(checked_name("backupprojeto/boot_a.img"), "boot_a.img")
        for name in ("../boot_a.img", "/absolute.img", "bad\\boot_a.img", "x.txt"):
            with self.subTest(name=name):
                with self.assertRaises(ValueError):
                    checked_name(name)

    def test_good_reference(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "backup.zip"
            data = b"ANDROID!" + b"X" * 24
            with zipfile.ZipFile(p, "w") as z:
                z.writestr("backupprojeto/boot_a.img", data)
            reference = {"expected_sizes": {"boot_a.img": len(data)},
                         "public_reference_sha256": {"boot_a.img": hashlib.sha256(data).hexdigest()}}
            report = audit(p, reference)
            self.assertTrue(report["ok"])
            self.assertEqual(report["count"], 1)

    def test_mismatch_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "backup.zip"
            with zipfile.ZipFile(p, "w") as z:
                z.writestr("boot_a.img", b"ANDROID!")
            report = audit(p, {"expected_sizes": {"boot_a.img": 64}})
            self.assertFalse(report["ok"])
            self.assertTrue(report["problems"])

    def test_traversal_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "backup.zip"
            with zipfile.ZipFile(p, "w") as z:
                z.writestr("../../private.img", b"secret")
            report = audit(p)
            self.assertFalse(report["ok"])

    def test_duplicate_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "backup.zip"
            with zipfile.ZipFile(p, "w") as z:
                z.writestr("one/boot_a.img", b"A")
                z.writestr("two/boot_a.img", b"B")
            self.assertFalse(audit(p)["ok"])

if __name__ == "__main__":
    unittest.main()
