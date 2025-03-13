
"""
AI Tab Sections Package

This package contains UI section components for the AI tab in the Court Reporter
application. Each section is responsible for a specific part of the AI tab interface,
such as API configuration, enhancement options, review options, and action buttons.

Sections:
- api_config: API key configuration and model selection UI
- enhancement_options: Text enhancement settings UI
- review_options: Content review options UI
- action_buttons: Action buttons for running AI operations
- error_handling: Error handling utilities for the AI tab
"""

from .api_config import create_api_config
from .enhancement_options import create_enhancement_options
from .review_options import create_review_options
from .action_buttons import create_action_buttons
from .error_handling import setup_error_handling

__all__ = [
    'create_api_config',
    'create_enhancement_options',
    'create_review_options',
    'create_action_buttons',
    'setup_error_handling'
]
