
import unittest
from unittest.mock import patch, MagicMock
import sys
import os
import time

# Add the parent directory to the path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modules.ui.handlers.operation_base import BaseOperationHandler

class TestOperationHandler(unittest.TestCase):
    def setUp(self):
        # Create a mock app object
        self.app = MagicMock()
        self.app.log = MagicMock()
        self.app.log.info = MagicMock()
        self.app.log.error = MagicMock()
        self.app.log.warning = MagicMock()
        self.app.progress_value = MagicMock()
        self.app.update_progress = MagicMock()
        
        # Create an instance of the handler
        with patch('os.makedirs') as mock_makedirs, \
             patch('logging.FileHandler') as mock_file_handler:
            self.handler = BaseOperationHandler(self.app)
    
    def test_safe_execute_operation(self):
        """Test safe execution of operations with error handling"""
        # Test successful operation
        def successful_operation():
            return "Success"
        
        success, result = self.handler.safe_execute_operation(
            successful_operation, "Test Operation", True
        )
        
        self.assertTrue(success)
        self.assertEqual(result, "Success")
        self.assertEqual(self.handler.get_operation_result("Test Operation"), "Success")
        
        # Test failed operation
        def failing_operation():
            raise ValueError("Test error")
        
        success, result = self.handler.safe_execute_operation(
            failing_operation, "Failed Operation", False
        )
        
        self.assertFalse(success)
        self.assertIsInstance(result, ValueError)
        self.assertEqual(str(result), "Test error")
    
    def test_retry_operation(self):
        """Test retry mechanism for operations"""
        # Mock operation that fails twice then succeeds
        mock_operation = MagicMock()
        mock_operation.side_effect = [
            ValueError("Attempt 1 failed"),
            ValueError("Attempt 2 failed"),
            "Success on attempt 3"
        ]
        
        # Execute with retry
        success, result = self.handler.retry_operation(
            mock_operation, "Retry Test", max_retries=3
        )
        
        # Verify success after retries
        self.assertTrue(success)
        self.assertEqual(result, "Success on attempt 3")
        self.assertEqual(mock_operation.call_count, 3)
        
        # Test operation that always fails
        mock_operation = MagicMock()
        mock_operation.side_effect = ValueError("Always fails")
        
        # Execute with retry
        success, result = self.handler.retry_operation(
            mock_operation, "Always Fails", max_retries=2, show_message=False
        )
        
        # Verify failure after all retries
        self.assertFalse(success)
        self.assertIsInstance(result, ValueError)
        self.assertEqual(mock_operation.call_count, 3)  # Initial attempt + 2 retries
    
    @patch('modules.utils.encoding_utils.contains_encoding_issues')
    def test_check_for_encoding_issues(self, mock_contains_issues):
        """Test encoding issue detection"""
        # Setup mock
        mock_contains_issues.return_value = True
        
        # Check for issues
        result = self.handler.check_for_encoding_issues("Test text")
        
        # Verify result
        self.assertTrue(result)
        mock_contains_issues.assert_called_once_with("Test text")
    
    @patch('modules.utils.encoding_utils.contains_encoding_issues')
    @patch('modules.utils.encoding_utils.log_encoding_issues')
    def test_log_document_info(self, mock_log_issues, mock_contains_issues):
        """Test document info logging with encoding checks"""
        # Setup document with paragraphs
        mock_document = MagicMock()
        mock_document.paragraphs = [
            MagicMock(text="Normal paragraph"),
            MagicMock(text="Paragraph with encoding issues")
        ]
        
        # Setup encoding check to find issues in the second paragraph
        mock_contains_issues.side_effect = [False, True]
        
        # Log document info
        self.handler.log_document_info(mock_document, "test.docx")
        
        # Verify logging occurred
        self.app.log.info.assert_called_once()
        self.app.log.warning.assert_called_once()
        mock_log_issues.assert_called_once()
        self.app.update_progress.assert_called_once()


if __name__ == '__main__':
    unittest.main()
