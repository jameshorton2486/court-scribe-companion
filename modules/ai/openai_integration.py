
"""
OpenAI Integration module - preserved for backward compatibility
"""
from modules.ai.openai.api_client import get_api_key, test_openai_connection
from modules.ai.openai.text_enhancer import enhance_text_with_ai
from modules.ai.openai.toc_generator import generate_ai_toc
from modules.ai.openai.content_reviewer import review_with_ai

# Re-export functions to maintain compatibility
__all__ = [
    'get_api_key',
    'test_openai_connection',
    'enhance_text_with_ai',
    'generate_ai_toc',
    'review_with_ai'
]
