
"""
Court Reporter Application

This application provides tools for processing documents, enhancing content,
and generating formatted outputs for e-reading applications.

Main modules:
- document: Document loading, parsing, and processing
  - document_loader: Handles loading documents from various formats
  - chapter_extractor: Extracts chapters from documents
  - text_processor: Processes and enhances text content
  - toc_generator: Generates tables of contents
  
- ai: AI-powered content enhancement and generation
  - content_reviewer: AI-based content quality assessment
  - openai_integration: Integration with OpenAI's API
  - toc_generator: Table of contents generation
  - chapter_gen: Chapter generation utilities
  
- ui: User interface components for desktop application
  - main_window: Main application window
  - file_tab: File processing interface
  - ai_tab: AI enhancement interface
  - chapter_tab: Chapter generation interface
  
- utils: Utility functions and helper classes
  - error_handling: Error handling utilities
  - file_utils: File operations helpers
  - text_utils: Text processing utilities

The application follows a modular architecture to ensure maintainability,
testability, and extensibility. Each module focuses on a specific aspect
of functionality, with clear interfaces between components.
"""

__version__ = '1.0.0'
__author__ = 'Court Reporter Team'
__maintainer__ = 'Court Reporter Maintenance Team'
__email__ = 'support@courtreporter.example.com'
__status__ = 'Production'

