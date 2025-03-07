
import tkinter as tk

class LogManager:
    """Manages the application log text widget"""
    
    def __init__(self, log_text):
        self.log_text = log_text
        
    def log(self, message):
        """Add a message to the log text widget"""
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)
