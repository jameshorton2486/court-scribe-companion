
# Book Processor

A standalone GUI application for processing, enhancing, and generating book content with AI assistance.

## Features

- Load DOCX files
- Fix text encoding issues
- Generate table of contents
- Create chapter outlines
- Enhance book content
- Save individual chapters
- Generate complete book
- **NEW: AI-powered content review and enhancement**
- **NEW: AI-assisted table of contents generation**
- **NEW: Generate chapter content with images and diagrams**

## Requirements

- Python 3.6 or higher
- Required packages:
  - python-docx
  - openai
  - pillow
  - matplotlib

## Installation

1. Clone this repository or download the files
2. Install the required packages:

```
pip install -r requirements.txt
```

3. You'll need an OpenAI API key with access to GPT-4 and DALL-E

## Usage

Run the application with:

```
python book_processor.py
```

### Processing Steps

1. **File Processing Tab**
   - Click "Browse..." to select an input DOCX file
   - Set output directory for processed files
   - Fill in book title and author
   - Select processing options
   - Click "Process Document" to analyze and organize the document

2. **AI Enhancement Tab**
   - Enter your OpenAI API key
   - Select AI review options
   - Click "Review Content with AI" to get professional feedback
   - Use "Generate AI Table of Contents" to create a structured TOC

3. **Chapter Generation Tab**
   - Select a chapter from the list
   - Enter or paste an outline for the chapter
   - Choose generation options (images, diagrams, writing style)
   - Click "Generate Chapter Content" to create complete chapter
   - Save the generated content with "Save Generated Content"

## AI Features

- **Content Review**: Get professional feedback on grammar, coherence, and suggestions for improvement
- **AI Table of Contents**: Generate a structured TOC with detailed subsections
- **Chapter Generation**: Create complete chapter content based on outlines
- **Image Generation**: Add relevant images to chapters using DALL-E
- **Diagram Creation**: Include charts and diagrams to visualize key points

## Notes

This application works best with:
- DOCX files that have some structure (headings, chapters)
- Clear chapter outlines for AI generation
- A valid OpenAI API key with access to GPT-4 and DALL-E models

Generated content quality depends on the clarity of provided outlines and instructions.

