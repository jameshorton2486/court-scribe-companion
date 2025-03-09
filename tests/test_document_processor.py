
import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the new processor_core module instead of document_processor
from modules.document.processor_core import process_document


class TestDocumentProcessor(unittest.TestCase):
    def setUp(self):
        self.processor = MagicMock()
        self.processor.process_document = process_document
    
    @patch('modules.document.document_loader.load_document')
    def test_load_document(self, mock_load):
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


if __name__ == '__main__':
    unittest.main()
