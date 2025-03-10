
import tkinter as tk
import logging
import os
from modules.ui.main_window import BookProcessor
from modules.utils.error_handler import setup_logging

if __name__ == "__main__":
    try:
        # Initialize logging system
        log_file = setup_logging()
        
        # Print banner with application info
        print("=" * 60)
        print("Book Processor Application Starting")
        print(f"Logs will be saved to: {log_file}")
        print("=" * 60)
        
        # Start the application
        logging.info("Initializing main application window")
        root = tk.Tk()
        
        try:
            app = BookProcessor(root)
            logging.info("Application initialized successfully")
            print("Application initialized successfully. Ready to process documents.")
            root.mainloop()
        except Exception as e:
            logging.critical(f"Failed to initialize application: {str(e)}", exc_info=True)
            print(f"CRITICAL ERROR: Failed to initialize application: {str(e)}")
            raise
            
    except Exception as e:
        print(f"Fatal error during application startup: {str(e)}")
        
        # Try to show error in GUI if possible
        try:
            from tkinter import messagebox
            messagebox.showerror("Fatal Error", f"Application failed to start: {str(e)}")
        except:
            pass
        
        raise
