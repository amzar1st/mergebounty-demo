# MergeBounty Commit-Bound Evidence

This file is the primary public evidence manifest for the MergeBounty demo submission.

The exact Git commit identified by the URL containing this file contains the completed repository tree, including the implementation, automated tests, README documentation, original task marker, and this evidence manifest.

## Immutable bounty requirements mapping

1. **Lowercase input text** — implemented in `slugify.py` with `text.lower()`.
2. **Replace one or more whitespace characters with one hyphen** — implemented with `re.sub(r"\s+", "-", value)`.
3. **Remove unsupported punctuation and special characters while preserving lowercase letters, numbers and hyphens** — implemented with `re.sub(r"[^a-z0-9-]+", "", value)`.
4. **Remove leading/trailing hyphens and avoid repeated hyphens** — implemented with `re.sub(r"-+", "-", value)` and `strip("-")`.
5. **At least five automated tests** — `test_slugify.py` contains eight unittest cases covering normal text, repeated spaces, punctuation, mixed case, leading/trailing whitespace, repeated hyphens, special characters, and leading/trailing hyphens.
6. **README usage documentation and examples** — `README.md` documents behavior, usage examples, test execution, and file roles.

## Implementation snapshot

```python
import re


def slugify(text: str) -> str:
    """Convert text into a deterministic lowercase ASCII slug."""
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    value = text.lower().strip()
    value = re.sub(r"\s+", "-", value)
    value = re.sub(r"[^a-z0-9-]+", "", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")
```

## Automated test snapshot

```python
import unittest
from slugify import slugify

class SlugifyTests(unittest.TestCase):
    def test_normal_text(self):
        self.assertEqual(slugify("hello world"), "hello-world")

    def test_repeated_spaces(self):
        self.assertEqual(slugify("hello    world"), "hello-world")

    def test_punctuation(self):
        self.assertEqual(slugify("Hello, world!!!"), "hello-world")

    def test_mixed_case(self):
        self.assertEqual(slugify("MergeBounty Demo"), "mergebounty-demo")

    def test_leading_and_trailing_whitespace(self):
        self.assertEqual(slugify("   hello world   "), "hello-world")

    def test_repeated_hyphens(self):
        self.assertEqual(slugify("hello---world"), "hello-world")

    def test_special_characters(self):
        self.assertEqual(slugify("ship @ version #2"), "ship-version-2")

    def test_leading_and_trailing_hyphens(self):
        self.assertEqual(slugify("---hello world---"), "hello-world")
```

## Review guidance

The developer submission claim is not intended to replace evidence. Validators should evaluate this manifest against the immutable bounty requirements and the exact commit-bound repository tree. The source implementation and tests are deliberately small so their behavior can be independently inspected from the public evidence.
