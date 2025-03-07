
import re

def enhance_book_content(app):
    """Enhanced book content processing with more sophisticated text improvements."""
    app.log("Enhancing book content...")
    
    # Stats to track changes
    enhanced_paragraphs = 0
    
    # Process each chapter
    for chapter in app.chapters:
        # Process paragraphs in this chapter
        for para in chapter['content']:
            original_text = para.text
            
            # Skip headings and empty paragraphs
            if para.style.name.startswith('Heading') or not original_text.strip():
                continue
            
            # Apply multiple enhancement techniques
            new_text = original_text
            
            # 1. Fix multiple spaces
            new_text = ' '.join(new_text.split())
            
            # 2. Fix capitalization at beginning of sentences
            sentences = re.split(r'(\.|\?|\!)\s+', new_text)
            processed_sentences = []
            for i in range(0, len(sentences), 2):
                sentence = sentences[i]
                if sentence and sentence[0].islower():
                    sentence = sentence[0].upper() + sentence[1:]
                processed_sentences.append(sentence)
                if i+1 < len(sentences):
                    processed_sentences.append(sentences[i+1])
            new_text = ''.join(processed_sentences)
            
            # 3. Fix common grammatical issues
            common_fixes = {
                ' i ': ' I ',
                ' dont ': " don't ",
                ' cant ': " can't ",
                ' wont ': " won't ",
                ' didnt ': " didn't ",
                ' its ': " it's ",  # possessive vs contraction
                ' youre ': " you're ",
                ' theyre ': " they're ",
                ' theres ': " there's ",
                ' shouldnt ': " shouldn't ",
                ' couldnt ': " couldn't ",
                ' wouldnt ': " wouldn't ",
                ' wasnt ': " wasn't ",
                ' werent ': " weren't ",
                ' havent ': " haven't ",
                ' hasnt ': " hasn't ",
                ' doesnt ': " doesn't ",
                ' dont ': " don't ",
                ' isnt ': " isn't ",
                ' arent ': " aren't ",
            }
            
            for error, fix in common_fixes.items():
                if error in ' ' + new_text.lower() + ' ':
                    new_text = (' ' + new_text + ' ').replace(' ' + error + ' ', fix)
                    new_text = new_text.strip()
            
            # 4. Fix spacing after punctuation
            new_text = re.sub(r'([.!?:;,])([^\s\d"])', r'\1 \2', new_text)
            
            # 5. Fix repeated punctuation
            new_text = re.sub(r'([.!?]){2,}', r'\1', new_text)
            
            # 6. Fix common typography errors
            new_text = new_text.replace(" - ", " – ")  # Use en dash for ranges
            
            # If the text was changed, update the paragraph
            if new_text != original_text:
                para.text = new_text
                enhanced_paragraphs += 1
    
    app.log(f"Enhanced {enhanced_paragraphs} paragraphs")

def apply_ai_enhancements(app, chapter_idx, content_type='grammar'):
    """Apply AI-based enhancements to a specific chapter."""
    if not hasattr(app, 'chapters') or not app.chapters:
        app.log("No chapters available to enhance")
        return False
    
    try:
        # Validate chapter index
        if chapter_idx < 0 or chapter_idx >= len(app.chapters):
            app.log(f"Invalid chapter index: {chapter_idx}")
            return False
            
        chapter = app.chapters[chapter_idx]
        app.log(f"Applying AI enhancement to chapter: {chapter['title']}")
        
        # Only proceed if we have a valid OpenAI API key
        if not app.openai_api_key.get():
            app.log("No OpenAI API key available. Skipping AI enhancement.")
            return False
            
        # Extract content from the chapter
        chapter_content = "\n".join([p.text for p in chapter['content']])
        
        # Call OpenAI integration for enhancement
        from modules.ai.openai_integration import enhance_text_with_ai
        
        enhanced_content = enhance_text_with_ai(
            app, 
            chapter_content, 
            enhancement_type=content_type,
            review_grammar=app.review_grammar.get(),
            review_coherence=app.review_coherence.get(),
            suggest_improvements=app.suggest_improvements.get()
        )
        
        if enhanced_content:
            # Update chapter content with AI enhanced text
            app.log("Updating chapter with AI enhanced content")
            
            # Split content into paragraphs
            new_paragraphs = enhanced_content.split('\n\n')
            
            # Update the content while preserving headings
            heading_style = None
            paragraph_idx = 0
            
            for i, para in enumerate(chapter['content']):
                if para.style.name.startswith('Heading'):
                    # Preserve headings
                    heading_style = para.style
                elif paragraph_idx < len(new_paragraphs):
                    # Update paragraph text with enhanced content
                    para.text = new_paragraphs[paragraph_idx]
                    paragraph_idx += 1
            
            return True
        else:
            app.log("AI enhancement didn't return valid content")
            return False
            
    except Exception as e:
        app.log(f"Error applying AI enhancements: {str(e)}")
        return False
