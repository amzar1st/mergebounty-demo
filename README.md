# MergeBounty Demo Repository

This repository is controlled public evidence for the MergeBounty GenLayer demo.

## Completed bounty task

This submission implements a deterministic Python `slugify(text)` utility according to the immutable bounty requirements.

### Behavior

The function:

- converts input text to lowercase;
- replaces one or more whitespace characters with a single hyphen;
- removes unsupported punctuation and special characters;
- preserves lowercase ASCII letters, numbers, and hyphens;
- collapses repeated hyphens;
- removes leading and trailing hyphens.

### Usage

```python
from slugify import slugify

print(slugify("Hello, MergeBounty!"))
# hello-mergebounty

print(slugify("  Ship   Version #2  "))
# ship-version-2
```

### Tests

The repository includes `test_slugify.py` with automated coverage for:

- normal text;
- repeated spaces;
- punctuation;
- mixed case;
- leading/trailing whitespace;
- repeated hyphens;
- special characters;
- leading/trailing hyphens.

Run the tests with:

```bash
python -m unittest -v
```

## Files

- `slugify.py` — implementation
- `test_slugify.py` — automated tests
- `TASK.md` — original task marker
- `EVIDENCE.md` — commit-bound review evidence for GenLayer validators
