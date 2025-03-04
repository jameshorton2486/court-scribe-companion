
# Book Processor

A standalone GUI application for processing and enhancing book documents.

## Features

- Load DOCX files
- Fix text encoding issues
- Generate table of contents
- Create chapter outlines
- Enhance book content
- Save individual chapters
- Generate complete book as DOCX

## Requirements

- Python 3.6 or higher
- python-docx library

## Installation

1. Clone this repository or download the files
2. Install the required packages:

```
pip install -r requirements.txt
```

## Usage

Run the application with:

```
python book_processor.py
```

### Processing Steps

1. Click "Browse..." to select an input DOCX file
2. Set output directory for processed files (defaults to "output" folder)
3. Fill in book title and author (optional)
4. Select processing options
5. Click "Load Document" to load the document
6. Click "Process Document" to analyze and process the document
7. Click "Save All Chapters" to save individual chapter files
8. Click "Generate Complete Book" to create the final document

## Processing Options

- **Fix Text Encoding Issues**: Corrects common encoding problems
- **Generate Table of Contents**: Creates a TOC based on chapter headings
- **Create Chapter Outlines**: Identifies and organizes chapters
- **Enhance Book Content**: Simple text improvements (experimental)

## Notes

This application works best with DOCX files that have some structure (headings, chapters, etc.).
The chapter detection algorithm looks for:
- Paragraphs with Heading styles
- Text starting with "Chapter" or chapter numbers
- Short, all-uppercase paragraphs that might be chapter titles

For best results, ensure your document has proper formatting before processing.
