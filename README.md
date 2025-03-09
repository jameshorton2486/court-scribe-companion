
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
- `modules/ai/`: AI-based content enhancement
- `modules/ui/`: Desktop user interface components
- `modules/utils/`: Utility functions

### Frontend (React/TypeScript)

- `src/components/`: UI components
- `src/contexts/`: React context providers
- `src/hooks/`: Custom React hooks
- `src/pages/`: Application pages/routes
- `src/utils/`: Utility functions

## Backend Setup

### Prerequisites

- Python 3.9 or higher
- Required Python packages (see `requirements.txt`)

### Installation

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

### Running the Backend

```bash
python book_processor.py
```

## Frontend Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

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

## Error Handling Guidelines

This project uses a centralized error handling approach to ensure consistent error management across the codebase.

### Key Error Handling Principles

1. **Use the error handling utilities**:
   - `handleError`: For logging and user notification
   - `safeOperation`: For wrapping async operations with error handling
   - `executeWithTiming`: For operations where timing metrics are important

2. **Error propagation**:
   - Lower-level functions should throw errors for higher-level functions to handle
   - User-facing components should catch errors and provide appropriate feedback

3. **Error structure**:
   - Use the `AppError` interface for consistent error formatting
   - Include error codes for easier debugging and tracking

## Code Style Guidelines

This project follows these coding standards:

- **Python**: PEP 8 style guide
- **TypeScript/JavaScript**: ESlint and Prettier configuration
- **React**: Component composition and hooks pattern

### Naming Conventions

- **Files**: 
  - Python: snake_case (e.g., `document_loader.py`)
  - TypeScript/React: PascalCase for components (e.g., `ChapterContent.tsx`), camelCase for utilities
- **Variables and Functions**: camelCase (JS/TS) or snake_case (Python)
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

## Security Best Practices

- Validate and sanitize all user inputs
- Use secure dependencies and keep them updated
- Implement proper error handling
- Use content security measures when rendering HTML content

## Performance Considerations

- Use chunked processing for large documents
- Implement debouncing for frequent events
- Monitor memory usage with large files
- Use browser storage fragmentation for large datasets

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

[MIT License](LICENSE)
