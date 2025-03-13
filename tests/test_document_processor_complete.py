
import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import traceback

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modules.document.processor_core import process_document
from modules.document.text_processing.encoding import detect_encoding
from modules.utils.encoding_utils import contains_encoding_issues

class TestDocumentProcessorComplete(unittest.TestCase):
    def setUp(self):
        self.processor = MagicMock()
        self.processor.process_document = process_document
    
    @patch('modules.document.document_loader.load_document')
    def test_load_document(self, mock_load):
        """Test document loading functionality"""
        # Setup the mock
        mock_document = MagicMock()
        mock_load.return_value = mock_document
        
        # Call the method
        result = self.processor.load_document('test.docx')
        
        # Assert
        mock_load.assert_called_once_with('test.docx')
        self.assertEqual(result, mock_document)
    
    @patch('modules.document.chapter_extractor.extract_chapters')
    def test_extract_chapters(self, mock_extract):
        """Test chapter extraction functionality"""
        # Setup
        mock_document = MagicMock()
        mock_chapters = [{'title': 'Chapter 1', 'content': 'Content 1'}]
        mock_extract.return_value = mock_chapters
        
        # Call
        result = self.processor.extract_chapters(mock_document)
        
        # Assert
        mock_extract.assert_called_once_with(mock_document)
        self.assertEqual(result, mock_chapters)
    
    def test_process_document_flow(self):
        """Test the complete document processing flow"""
        # Mock dependencies
        self.processor.load_document = MagicMock(return_value='document')
        self.processor.extract_chapters = MagicMock(return_value=['chapter1', 'chapter2'])
        self.processor.process_chapters = MagicMock(return_value=['processed1', 'processed2'])
        
        # Call
        result = self.processor.process_document('test.docx')
        
        # Assert the flow
        self.processor.load_document.assert_called_once_with('test.docx')
        self.processor.extract_chapters.assert_called_once_with('document')
        self.processor.process_chapters.assert_called_once_with(['chapter1', 'chapter2'])
        self.assertEqual(result, ['processed1', 'processed2'])
    
    @patch('modules.document.text_processing.encoding.detect_encoding')
    def test_encoding_detection(self, mock_detect):
        """Test encoding detection in document processing"""
        # Setup
        mock_detect.return_value = 'utf-8'
        
        # Create a sample document with encoding issues
        mock_document = MagicMock()
        mock_document.paragraphs = [
            MagicMock(text="Normal text"),
            MagicMock(text="Text with â€™ encoding issues")
        ]
        
        # Test encoding detection
        encoding = detect_encoding("Text with â€™ encoding issues")
        self.assertEqual(encoding, mock_detect.return_value)
        
        # Test encoding issues detection
        has_issues = contains_encoding_issues("Text with â€™ encoding issues")
        self.assertTrue(has_issues)
        
        has_issues = contains_encoding_issues("Normal text")
        self.assertFalse(has_issues)
    
    def test_error_handling(self):
        """Test error handling during document processing"""
        # Mock dependencies with errors
        self.processor.load_document = MagicMock(side_effect=FileNotFoundError("File not found"))
        
        # Call with try/except to capture the error
        try:
            self.processor.process_document('nonexistent.docx')
            self.fail("Expected FileNotFoundError was not raised")
        except FileNotFoundError as e:
            self.assertEqual(str(e), "File not found")


if __name__ == '__main__':
    unittest.main()
