import hashlib
from pathlib import Path
import tempfile
import unittest
from tools.validate_boot import inspect, main

class BootTests(unittest.TestCase):
    def test_android_header(self):
        with tempfile.TemporaryDirectory() as tmp:
            f=Path(tmp)/"boot.img"
            f.write_bytes(b"ANDROID!" + b"\x00" * 64)
            self.assertTrue(inspect(f)["android_boot_magic"])
            self.assertEqual(main(["--original", str(f),
                "--expected-original-sha", hashlib.sha256(f.read_bytes()).hexdigest()]), 0)
    def test_wrong_magic(self):
        with tempfile.TemporaryDirectory() as tmp:
            f=Path(tmp)/"notboot.img"
            f.write_bytes(b"NOTBOOT!" + b"\x00" * 64)
            self.assertEqual(main(["--original", str(f)]), 1)

if __name__ == "__main__":
    unittest.main()
