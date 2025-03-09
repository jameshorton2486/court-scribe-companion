
"""
UI Module for Court Reporter

This module handles all user interface components and interactions
for the desktop application, including the main window, tabs,
dialogs, and various UI utilities.

Submodules:
- main_window: Main application window implementation
- file_tab: File processing tab interface
- ai_tab: AI enhancement tab interface
- chapter_tab: Chapter generation and editing tab
- file_actions: File management operations
- navigation_utils: Navigation between chapters and sections
- background_processor: Background task handling
- operation_handler: Operation execution and management
- status_manager: Status and progress tracking
- log_manager: Logging functionality for the UI
- ui_builder: UI component creation and layout
"""

__version__ = '1.0.0'
__author__ = 'Court Reporter Team'

# Import common utilities for easier access
from modules.ui.status_manager import StatusManager
from modules.ui.log_manager import LogManager
from modules.ui.background_processor import BackgroundProcessor
from modules.ui.ui_builder import create_main_ui

