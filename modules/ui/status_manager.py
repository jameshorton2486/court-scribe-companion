
import tkinter as tk
import time

class StatusManager:
    """Manages application status, progress bar, and spinner animations"""
    
    def __init__(self, root, status_var, progress_var):
        self.root = root
        self.current_status = status_var
        self.progress_value = progress_var
        self.elapsed_time = tk.StringVar(value="Time: 00:00")
        self.is_processing = False
        self.processing_cancelled = False
        self.start_time = 0
        self.spinner_label = None
        
    def set_ui_elements(self, spinner_label, cancel_button, time_label):
        """Set UI elements controlled by the status manager"""
        self.spinner_label = spinner_label
        self.cancel_button = cancel_button
        self.time_label = time_label
        
    def update_progress(self, value, status=None):
        """Update progress bar value and status text"""
        self.progress_value.set(value)
        if status:
            self.current_status.set(status)
        if value > 0 and value < 100:
            self.cancel_button.config(state=tk.NORMAL)
            if not self.is_processing:
                self.is_processing = True
                self.start_time = time.time()
                self.start_spinner()
                self.update_elapsed_time()
        else:
            self.cancel_button.config(state=tk.DISABLED)
            self.is_processing = False
            self.stop_spinner()
            self.elapsed_time.set("Time: 00:00")
        self.root.update()
    
    def update_elapsed_time(self):
        """Update the elapsed time display"""
        if self.is_processing:
            elapsed = time.time() - self.start_time
            minutes = int(elapsed // 60)
            seconds = int(elapsed % 60)
            self.elapsed_time.set(f"Time: {minutes:02d}:{seconds:02d}")
            self.root.after(1000, self.update_elapsed_time)
    
    def start_spinner(self):
        """Start the spinner animation for long-running tasks"""
        self.spinner_chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        self.spinner_index = 0
        self.update_spinner()
    
    def update_spinner(self):
        """Update the spinner animation"""
        if self.is_processing:
            self.spinner_label.config(text=f" {self.spinner_chars[self.spinner_index]} ")
            self.spinner_index = (self.spinner_index + 1) % len(self.spinner_chars)
            self.root.after(100, self.update_spinner)
    
    def stop_spinner(self):
        """Stop the spinner animation"""
        self.spinner_label.config(text="")
        
    def set_cancelled(self, cancelled=True):
        """Set the cancelled flag"""
        self.processing_cancelled = cancelled
