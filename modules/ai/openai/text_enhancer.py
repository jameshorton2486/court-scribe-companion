
import time
import openai
from modules.ai.openai.api_client import get_api_key

def enhance_text_with_ai(app, text, enhancement_type='grammar', 
                         review_grammar=True, review_coherence=True, 
                         suggest_improvements=True, intensity=0.5):
    """
    Use OpenAI to enhance text content with improved error handling and expanded options.
    
    Args:
        app: The application instance
        text: The text to enhance
        enhancement_type: Type of enhancement ('grammar', 'expand', 'simplify', or 'style')
        review_grammar: Whether to review grammar
        review_coherence: Whether to review coherence
        suggest_improvements: Whether to suggest improvements
        intensity: Enhancement intensity (0.1 to 1.0)
    
    Returns:
        Enhanced text or None if there was an error
    """
    app.log(f"Enhancing text with AI ({enhancement_type}, intensity: {intensity})...")
    
    # Get API key with improved handling
    api_key = get_api_key(app)
    if not api_key:
        app.log("No OpenAI API key available")
        app.update_progress(0, "AI enhancement failed: No API key")
        return None
    
    # Set up the client
    client = openai.OpenAI(api_key=api_key)
    
    # Map intensity to temperature and other parameters
    temperature = min(0.7, max(0.1, 0.1 + intensity * 0.5))
    
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Build system prompt based on enhancement type and options
            system_prompt = "You are an expert editor and writing assistant. "
            
            if enhancement_type == 'grammar':
                system_prompt += f"Your task is to improve the text while maintaining its original meaning and style. Apply changes with {intensity * 100:.0f}% intensity - higher means more significant rewrites."
                
                if review_grammar:
                    system_prompt += " Fix any grammatical errors, spelling mistakes, and punctuation."
                    
                if review_coherence:
                    system_prompt += " Ensure the text is coherent, flows naturally, and has logical transitions."
                    
                if suggest_improvements:
                    system_prompt += " Improve clarity and readability where possible."
            
            elif enhancement_type == 'expand':
                system_prompt += f"Your task is to expand and enrich the provided content while maintaining its original style and message. Add relevant details, examples, or explanations to make the content more comprehensive. Apply expansion with {intensity * 100:.0f}% intensity - higher means more added content."
            
            elif enhancement_type == 'simplify':
                system_prompt += f"Your task is to simplify the provided content without losing its essential meaning. Make it more accessible to a general audience by reducing complexity and using simpler language. Apply simplification with {intensity * 100:.0f}% intensity - higher means more significant simplification."
                
            elif enhancement_type == 'style':
                style_type = app.style_type.get() if hasattr(app, 'style_type') else "professional"
                system_prompt += f"Your task is to rewrite the text in a {style_type} style while preserving its meaning. Apply style changes with {intensity * 100:.0f}% intensity - higher means more significant style adjustments."
            
            app.log(f"Using system prompt: {system_prompt}")
            
            # Prepare user prompt with the text to enhance
            user_prompt = f"Please enhance the following text according to the instructions. Return ONLY the improved text without additional commentary:\n\n{text}"
            
            # Call OpenAI API with selected model
            model = app.openai_model.get()
            app.log(f"Using model: {model}")
            
            # Call OpenAI API
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=4000,
                temperature=temperature
            )
            
            # Extract enhanced text from response
            enhanced_text = response.choices[0].message.content.strip()
            
            app.log("AI enhancement completed successfully")
            return enhanced_text
            
        except openai.RateLimitError:
            retry_count += 1
            app.log(f"Rate limit exceeded. Retrying in {2 ** retry_count} seconds... (Attempt {retry_count}/{max_retries})")
            app.update_progress(10 * retry_count, f"Retrying... ({retry_count}/{max_retries})")
            time.sleep(2 ** retry_count)  # Exponential backoff
            
        except (openai.APIError, openai.APIConnectionError) as e:
            app.log(f"API error in AI text enhancement: {str(e)}")
            app.update_progress(0, f"AI enhancement failed: {type(e).__name__}")
            return None
            
        except Exception as e:
            app.log(f"Error in AI text enhancement: {str(e)}")
            app.update_progress(0, "AI enhancement failed")
            return None
    
    # If we've exhausted retries
    app.log("Maximum retries exceeded for OpenAI API call")
    app.update_progress(0, "AI enhancement failed: Max retries exceeded")
    return None
