
import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modules.document.text_processor import fix_text_encoding, fix_common_encoding_issues, fix_html_entities

class TestTextProcessor(unittest.TestCase):
    def setUp(self):
        # Create a mock app object with necessary attributes
        self.app = MagicMock()
        self.app.log = MagicMock()
        self.app.log.info = MagicMock()
        self.app.log.warning = MagicMock()
        
        # Create mock document content
        mock_paragraph1 = MagicMock()
        mock_paragraph1.text = "Normal text"
        mock_paragraph1.runs = [MagicMock(text="Normal text")]
        
        mock_paragraph2 = MagicMock()
        mock_paragraph2.text = "Text with â€™ encoding issues"
        mock_paragraph2.runs = [MagicMock(text="Text with â€™ encoding issues")]
        
        self.app.docx_content = MagicMock()
        self.app.docx_content.paragraphs = [mock_paragraph1, mock_paragraph2]
    
    def test_fix_common_encoding_issues(self):
        """Test fixing common encoding issues in text"""
        # Test various encoding issues
        test_cases = [
            ("Text with â€™ apostrophe", "Text with ' apostrophe"),
            ("Text with Â extra characters", "Text with  extra characters"),
            ("Text with â€œ quotes â€", "Text with \" quotes \""),
            ("Text with\r\nwindows line endings", "Text with\nwindows line endings"),
            ("Text with\x00null bytes", "Text with null bytes"),
            ("Text with Ã© character", "Text with é character")
        ]
        
        for input_text, expected_output in test_cases:
            result = fix_common_encoding_issues(input_text)
            self.assertEqual(result, expected_output)
    
    def test_fix_html_entities(self):
        """Test fixing HTML entities in text"""
        # Test HTML entity replacement
        test_cases = [
            ("Text with &lt;tags&gt;", "Text with <tags>"),
            ("Text with &quot;quotes&quot;", "Text with \"quotes\""),
            ("Text with &amp; ampersand", "Text with & ampersand"),
            ("Text with &#39;apostrophe&#39;", "Text with 'apostrophe'")
        ]
        
        for input_text, expected_output in test_cases:
            result = fix_html_entities(input_text)
            self.assertEqual(result, expected_output)
    
    @patch('modules.document.text_processing.replacements.get_character_replacements')
    @patch('modules.utils.encoding_utils.contains_encoding_issues')
    def test_fix_text_encoding(self, mock_contains_issues, mock_get_replacements):
        """Test the complete text encoding fix process"""
        # Setup mocks
        mock_contains_issues.side_effect = [True, False]  # First paragraph has issues, second doesn't
        mock_get_replacements.return_value = {'â€™': "'", 'Â': ''}
        
        # Call the function
        result = fix_text_encoding(self.app)
        
        # Verify the function reported encoding issues
        self.assertTrue(result)
        
        # Verify log messages
        self.app.log.info.assert_called_with("Fixing text encoding issues...")
        self.app.log.warning.assert_called_once()
        
        # Test when no encoding issues are found
        mock_contains_issues.side_effect = [False, False]  # No paragraphs have issues
        result = fix_text_encoding(self.app)
        
        # Verify the function reported no encoding issues
        self.assertFalse(result)


if __name__ == '__main__':
    unittest.main()
