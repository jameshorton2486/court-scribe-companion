
"""
Document loader module - preserved for backward compatibility
"""
from modules.document.loaders.core_loader import load_document

# Re-export the load_document function to maintain compatibility with existing code
__all__ = ['load_document']
