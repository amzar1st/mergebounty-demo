import re


def slugify(text: str) -> str:
    """Convert text into a deterministic lowercase ASCII slug.

    Rules:
    - lowercase the input
    - collapse one or more whitespace characters into a single hyphen
    - remove unsupported punctuation/special characters
    - preserve only lowercase ASCII letters, digits, and hyphens
    - collapse repeated hyphens
    - remove leading/trailing hyphens
    """
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    value = text.lower().strip()
    value = re.sub(r"\s+", "-", value)
    value = re.sub(r"[^a-z0-9-]+", "", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")
