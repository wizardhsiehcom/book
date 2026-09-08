"""Synthetic integrity checks; no model inference or device benchmark."""
from pathlib import Path
from tempfile import TemporaryDirectory
import manifest

with TemporaryDirectory() as directory:
    manifest.ROOT = Path(directory)
    manifest.MANIFEST = manifest.ROOT / 'SHA256SUMS.txt'
    for rel in manifest.TRACK:
        path = manifest.ROOT / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(b'synthetic artifact')
    manifest.create()
    manifest.verify()
    target = manifest.ROOT / manifest.TRACK[0]
    target.write_bytes(b'tampered artifact')
    try:
        manifest.verify()
    except SystemExit as error:
        assert 'HASH_MISMATCH' in str(error)
    else:
        raise AssertionError('tampering was accepted')
    target.write_bytes(b'synthetic artifact')
    target.unlink()
    try:
        manifest.verify()
    except SystemExit as error:
        assert 'MISSING' in str(error)
    else:
        raise AssertionError('missing artifact was accepted')
print('manifest self-check passed: intact, tampered, missing')
