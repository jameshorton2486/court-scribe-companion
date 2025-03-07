
def get_character_replacements():
    """Return a dictionary of special character replacements."""
    return {
        # Smart quotes and apostrophes
        '\u2018': "'",  # Left single quotation mark
        '\u2019': "'",  # Right single quotation mark
        '\u201c': '"',  # Left double quotation mark
        '\u201d': '"',  # Right double quotation mark
        # Dashes and hyphens
        '\u2013': '-',  # En dash
        '\u2014': '--', # Em dash
        '\u2015': '--', # Horizontal bar
        # Other common special characters
        '\u2026': '...', # Ellipsis
        '\u00a0': ' ',  # Non-breaking space
        '\u00ad': '',   # Soft hyphen
        '\u200b': '',   # Zero-width space
        '\u200e': '',   # Left-to-right mark
        '\u200f': '',   # Right-to-left mark
        # Currency symbols
        '\u20ac': 'EUR', # Euro sign
        '\u00a3': 'GBP', # Pound sign
        '\u00a5': 'JPY', # Yen sign
        # Bullet points and list characters
        '\u2022': '*',  # Bullet
        '\u2023': '>',  # Triangular bullet
        '\u25e6': 'o',  # White bullet
        '\u2043': '-',  # Hyphen bullet
        # Typographic symbols
        '\u00ae': '(R)', # Registered trademark
        '\u2122': '(TM)', # Trademark
        '\u00a9': '(C)', # Copyright
        # Additional characters
        '\u2039': '<',  # Single left-pointing angle quotation mark
        '\u203a': '>',  # Single right-pointing angle quotation mark
        '\u00ab': '<<', # Left-pointing double angle quotation mark
        '\u00bb': '>>', # Right-pointing double angle quotation mark
        '\u2212': '-',  # Minus sign
        '\u00b7': '·',  # Middle dot
        '\u00b0': '°',  # Degree sign
        '\u00b9': '¹',  # Superscript one
        '\u00b2': '²',  # Superscript two
        '\u00b3': '³',  # Superscript three
        '\u00f7': '/',  # Division sign
        '\u00d7': 'x',  # Multiplication sign
        '\u2248': '~',  # Almost equal to
        '\u00b1': '+/-',# Plus-minus sign
    }
