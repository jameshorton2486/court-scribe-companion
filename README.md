
# Book Processor

A standalone application for processing, enhancing, and generating book content with AI assistance.

## Overview

Book Processor is a comprehensive tool designed to help authors and publishers prepare, enhance, and manage book content. The application combines document processing capabilities with AI-powered content enhancement to streamline the book production workflow.

## Key Features

### Document Processing
- Load DOCX/TXT files or paste content directly
- Automatic chapter detection and organization
- Fix text encoding issues
- Generate table of contents
- Create chapter outlines

### AI Enhancement
- Grammar and spelling correction
- Content expansion and clarity improvement
- Professional formatting
- Writing style customization
- Table of contents generation

### Content Generation
- AI-assisted chapter generation
- Image and diagram creation
- Visual content integration
- Content structuring assistance

### Export Options
- Save individual chapters
- Generate complete book
- Multiple format support
- Customizable output settings

## Technical Architecture

The application is built with a modular architecture:

- **Document Processing Module**: Handles file loading, text processing, and chapter extraction
- **AI Enhancement Module**: Provides content improvement capabilities
- **Chapter Generation Module**: Creates new content with visuals
- **UI Module**: Delivers an intuitive user interface

## Installation

### Requirements
- Python 3.6 or higher
- Required packages:
  - python-docx
  - openai
  - pillow
  - matplotlib
  - chardet
  - bs4 (BeautifulSoup)

### Setup
1. Clone this repository or download the files
2. Install the required packages:

```bash
pip install -r requirements.txt
```

3. You'll need an OpenAI API key with access to GPT-4 and DALL-E for AI features

## Usage

### Launch the Application

Run the application with:

```bash
python book_processor.py
```

### Processing Workflow

1. **File Processing**
   - Upload a document or paste content
   - Set output directory and book metadata
   - Select processing options
   - Process the document to organize chapters

2. **Content Enhancement**
   - Select chapters to enhance
   - Choose enhancement options (grammar, content, formatting)
   - Apply AI enhancement to improve quality
   - Preview and adjust enhancements

3. **Content Generation**
   - Create outlines for new chapters
   - Generate complete chapter content
   - Add images and diagrams
   - Save generated content

## Configuration

The application supports various configuration options:

- **Grammar Enhancement**: Adjust the level of grammar correction
- **Content Expansion**: Control how much content is expanded
- **Formatting Options**: Select font family, TOC generation, chapter breaks
- **Generation Settings**: Configure image inclusion, diagram creation, writing style

## Contributing

Contributions to Book Processor are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new functionality
- Update documentation for changes
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI models
- The open-source libraries that make this project possible
