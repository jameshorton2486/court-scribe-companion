
def load_text_document(file_path):
    """Load a text file."""
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        return f.read()

def load_large_text_document(file_path, app, chunk_size=1000):
    """Optimized loading for large text files."""
    app.log.info("Using chunked loading for large text file")
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Read file in chunks to minimize memory usage
    content = ""
    read_chunk_size = 1024 * 1024  # 1MB chunks for reading
    processed_size = 0
    
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        while True:
            chunk = f.read(read_chunk_size)
            if not chunk:
                break
                
            content += chunk
            processed_size += len(chunk)
            
            # Update progress
            progress = 10 + (processed_size / file_size) * 30
            app.update_progress(progress, f"Loading large text file ({processed_size/1024/1024:.1f}MB/{file_size/1024/1024:.1f}MB)...")
            
            # Periodically yield to UI to prevent freezing
            app.update()
    
    return content
