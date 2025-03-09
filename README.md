
# Court Reporter

A modern web application for book and document processing with enhanced reading capabilities.

## Overview

Court Reporter is a comprehensive document processing and e-reader application that allows users to:

- Import books and documents in various formats
- Process and enhance text content
- Generate chapters and tables of contents
- Read books with a clean, accessible interface
- Store books locally in browser storage

The application consists of both a Python backend for document processing and a React-based frontend for reading and interacting with documents.

## Architecture

The application is structured around distinct modules:

### Backend (Python)

- `modules/document/`: Document loading and processing
  - `document_loader.py`: Handles loading various document formats
  - `chapter_extractor.py`: Extracts chapters from loaded documents
  - `text_processor.py`: Text cleaning and processing utilities
  - `toc_generator.py`: Table of contents generation
  
- `modules/ai/`: AI-based content enhancement
  - `content_reviewer.py`: Reviews and suggests improvements to content
  - `openai_integration.py`: Integration with OpenAI's API
  - `chapter_gen/`: Chapter generation utilities
  
- `modules/ui/`: Desktop user interface components
  - `main_window.py`: Main application window definition
  - `file_tab.py`, `ai_tab.py`, `chapter_tab.py`: UI tabs
  - `ui_builder.py`: UI component creation utilities
  
- `modules/utils/`: Utility functions
  - Error handling, file operations, text processing

### Frontend (React/TypeScript)

- `src/components/`: UI components
  - `reader/`: E-reader components
  - `ebook-uploader/`: Book upload/import components
  - `book-enhancer/`: Content enhancement components
  - `ui/`: Reusable UI components (shadcn/ui)
  
- `src/contexts/`: React context providers
  - `ReaderContext.tsx`: Main reader state management

- `src/hooks/`: Custom React hooks
  - `useBookLoader.ts`: Book loading and management
  - `useBookOperations.ts`: Book operations (export, import, etc.)

- `src/utils/`: Utility functions
  - `errorHandlingUtils.ts`: Error handling utilities
  - `storageUtils.ts`: Local storage management

## Getting Started

### Backend Setup

#### Prerequisites

- Python 3.9 or higher
- Required Python packages (see `requirements.txt`)

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/court-reporter.git
cd court-reporter
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

#### Running the Backend

```bash
python book_processor.py
```

### Frontend Setup

#### Prerequisites

- Node.js 18.x or higher
- npm or yarn

#### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage

### Importing Books

1. Navigate to the "Upload" page
2. Either paste your content or upload a supported file
3. Fill in title and author information
4. Click "Process E-book" to import

### Reading Books

1. Navigate to the "Reader" page
2. Select a book from your library
3. Use the navigation controls to move between chapters
4. Toggle the table of contents for quick navigation

### Enhancing Content

1. Open a book in the reader
2. Click the "Enhance" button
3. Select enhancement options
4. Apply enhancements to selected chapters

## Development Guidelines

### Code Style

- **Python**: Follow PEP 8 style guidelines
- **TypeScript/React**: Follow project ESLint configuration
- Use meaningful variable and function names
- Write descriptive comments for complex logic

### Component Structure

- Create small, focused components
- Use proper TypeScript interfaces for props
- Follow the React hooks pattern for state management
- Document component props and functionality

### Error Handling

- Use structured error objects
- Implement proper error boundaries
- Log errors with useful information
- Provide user-friendly error messages

### Performance Considerations

- Implement pagination for large datasets
- Use memoization for expensive calculations
- Implement debouncing for frequent events
- Manage local storage efficiently

## Testing

The project includes both backend and frontend tests.

### Running Backend Tests

```bash
pytest tests/
```

### Running Frontend Tests

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

[MIT License](LICENSE)
