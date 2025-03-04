
import tkinter as tk
from modules.ui.main_window import BookProcessor

if __name__ == "__main__":
    root = tk.Tk()
    app = BookProcessor(root)
    root.mainloop()
