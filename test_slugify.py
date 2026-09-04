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


if __name__ == "__main__":
    unittest.main()
