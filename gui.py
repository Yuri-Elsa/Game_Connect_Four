
"""
gui.py - UI modern untuk Connect Four
Fitur: tema gelap, hover preview, animasi jatuh, highlight menang, move history,
Undo/Redo, export logs, switch algoritma/depth, serta musik & sfx (Windows/winsound).
"""
import sys, time, os
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from game import ConnectFour
from ai_player import AIPlayer

# Audio (Windows): winsound
try:
    import winsound
except Exception:
    winsound = None

CELL = 80
PADDING = 20
DISC_MARGIN = 8
BG = "#0b1021"
PANEL = "#0e1633"
GRID = "#1f2a44"
AI_COLOR = "#ffd166"
HUM_COLOR = "#ef476f"
HIL = "#06d6a0"
TXT = "#e9f1ff"

class ConnectFourGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Connect Four — MAX Edition")
        self.root.configure(bg=BG)
        self.game = ConnectFour()
        self.ai_algo = tk.StringVar(value="alpha_beta")
        self.ai_depth = tk.IntVar(value=5)
        self.time_limit = tk.DoubleVar(value=2.0)  # detik per langkah
        self.info_nodes = tk.StringVar(value="Nodes: 0")
        self.info_time = tk.StringVar(value="Time: 0 ms")
        self.info_turn = tk.StringVar(value="Turn: HUMAN (X)")
        self.hover_col = None
        self.last_move = None
        self.winning_cells = None
        self.history = []
        self.redo_stack = []
        self.music_on = tk.BooleanVar(value=False)

        self.ai = AIPlayer(self.ai_algo.get(), self.ai_depth.get(), time_limit=self.time_limit.get())

        self._style()
        self._layout()
        self._draw_board()

    # --------- UI style ---------
    def _style(self):
        style = ttk.Style(self.root)
        try: style.theme_use("clam")
        except: pass
        style.configure("TFrame", background=PANEL)
        style.configure("TLabel", background=PANEL, foreground=TXT, font=("Segoe UI", 10))
        style.configure("Header.TLabel", font=("Segoe UI Semibold", 12))
        style.configure("TButton", padding=6)
        style.map("TButton", background=[("active", GRID)])

    # --------- Layout ---------
    def _layout(self):
        container = ttk.Frame(self.root, padding=10)
        container.pack(fill="both", expand=True)

        left = ttk.Frame(container); left.grid(row=0, column=0, sticky="nsew")
        right = ttk.Frame(container); right.grid(row=0, column=1, sticky="ns", padx=(10,0))
        container.columnconfigure(0, weight=1)

        self.canvas = tk.Canvas(left, width=7*CELL+2*PADDING, height=6*CELL+2*PADDING, bg=BG, highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)
        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<Motion>", self.on_motion)
        self.canvas.bind("<Leave>", lambda e: self._clear_hover())

        ttk.Label(right, text="Controls", style="Header.TLabel").pack(anchor="w", pady=(0,6))
        row1 = ttk.Frame(right); row1.pack(fill="x", pady=4)
        ttk.Label(row1, text="Algorithm").pack(side="left")
        cmb = ttk.Combobox(row1, textvariable=self.ai_algo, values=["minimax","alpha_beta"], width=12, state="readonly")
        cmb.pack(side="right")

        row2 = ttk.Frame(right); row2.pack(fill="x", pady=4)
        ttk.Label(row2, text="Depth").pack(side="left")
        ttk.Spinbox(row2, from_=2, to=7, textvariable=self.ai_depth, width=6, justify="center").pack(side="right")

        row3 = ttk.Frame(right); row3.pack(fill="x", pady=4)
        ttk.Label(row3, text="Time limit (s)").pack(side="left")
        ttk.Spinbox(row3, from_=0.5, to=5.0, increment=0.5, textvariable=self.time_limit, width=6, justify="center").pack(side="right")

        btns = ttk.Frame(right); btns.pack(fill="x", pady=(8,4))
        ttk.Button(btns, text="New Game", command=self.reset).pack(side="left", expand=True, fill="x", padx=(0,4))
        ttk.Button(btns, text="Export Logs", command=self.export_logs).pack(side="left", expand=True, fill="x", padx=(4,0))

        btns2 = ttk.Frame(right); btns2.pack(fill="x", pady=(4,10))
        ttk.Button(btns2, text="Undo", command=self.undo).pack(side="left", expand=True, fill="x", padx=(0,4))
        ttk.Button(btns2, text="Redo", command=self.redo).pack(side="left", expand=True, fill="x", padx=(4,0))

        ttk.Separator(right).pack(fill="x", pady=6)
        ttk.Label(right, text="Live Metrics", style="Header.TLabel").pack(anchor="w", pady=(0,6))
        ttk.Label(right, textvariable=self.info_nodes).pack(anchor="w")
        ttk.Label(right, textvariable=self.info_time).pack(anchor="w")
        ttk.Label(right, textvariable=self.info_turn).pack(anchor="w")

        ttk.Separator(right).pack(fill="x", pady=6)
        rowm = ttk.Frame(right); rowm.pack(fill="x", pady=4)
        tk.Checkbutton(rowm, text="Background Music", variable=self.music_on, command=self.toggle_music,
                       bg=PANEL, fg=TXT, activebackground=PANEL, activeforeground=TXT, selectcolor=PANEL).pack(anchor="w")
        ttk.Button(right, text="Hint (Best Move)", command=self.hint).pack(fill="x", pady=(6,0))

        ttk.Separator(right).pack(fill="x", pady=6)
        ttk.Label(right, text="Move History", style="Header.TLabel").pack(anchor="w")
        self.listbox = tk.Listbox(right, height=12, bg="#0f193b", fg=TXT, highlightthickness=0, selectbackground="#233266")
        self.listbox.pack(fill="both", expand=False)

    # --------- Rendering ---------
    def _draw_board(self):
        self.canvas.delete("all")
        for r in range(6):
            for c in range(7):
                x1 = PADDING + c*CELL; y1 = PADDING + r*CELL
                x2 = x1 + CELL; y2 = y1 + CELL
                self.canvas.create_rectangle(x1,y1,x2,y2, fill=GRID, outline=BG, width=2)
        # discs
        for r in range(6):
            for c in range(7):
                val = self.game.board[r][c]
                if val != 0:
                    self._draw_disc(r, c, AI_COLOR if val==2 else HUM_COLOR)
        # last move ring
        if self.last_move:
            r,c = self.last_move
            x1 = PADDING + c*CELL; y1 = PADDING + r*CELL
            cx, cy = x1 + CELL/2, y1 + CELL/2
            rad = (CELL/2 - DISC_MARGIN) + 2
            self.canvas.create_oval(cx-rad, cy-rad, cx+rad, cy+rad, outline=HIL, width=3)
        # hover
        if self.hover_col is not None and self.game.board[0][self.hover_col] == 0 and self.game.current_player==1:
            row = self._landing_row(self.hover_col)
            if row is not None:
                self._draw_disc(row, self.hover_col, HUM_COLOR, alpha=0.35)
        # winning highlight
        if self.winning_cells:
            for (r,c) in self.winning_cells:
                x1 = PADDING + c*CELL; y1 = PADDING + r*CELL
                cx, cy = x1 + CELL/2, y1 + CELL/2
                rad = (CELL/2 - DISC_MARGIN) + 4
                self.canvas.create_oval(cx-rad, cy-rad, cx+rad, cy+rad, outline=HIL, width=5)

    def _draw_disc(self, r, c, color, alpha=1.0):
        x1 = PADDING + c*CELL; y1 = PADDING + r*CELL
        cx, cy = x1 + CELL/2, y1 + CELL/2
        rad = CELL/2 - DISC_MARGIN
        stipple = "" if alpha>=1.0 else "gray50"
        self.canvas.create_oval(cx-rad, cy-rad, cx+rad, cy+rad, fill=color, outline="", stipple=stipple)

    # --------- Interaction ---------
    def on_motion(self, event):
        col = (event.x - PADDING) // CELL
        self.hover_col = int(col) if 0 <= col < 7 else None
        self._draw_board()

    def _clear_hover(self):
        self.hover_col = None
        self._draw_board()

    def on_click(self, event):
        col = (event.x - PADDING) // CELL
        if not (0 <= col < 7): return
        if self.game.current_player != 1: return
        if self.game.board[0][col] != 0: return
        self._human_move(int(col))

    def _human_move(self, col):
        r = self._landing_row(col)
        self._animate_drop(col, r, HUM_COLOR)
        self.game.drop_piece(col, 1)
        self.last_move = (r, col)
        self.history.append(("HUMAN", col, r))
        self.redo_stack.clear()
        self.listbox.insert(tk.END, f"{len(self.history)}. HUMAN → col {col+1}")
        self.info_turn.set("Turn: AI (O)")
        self._finish_turn()

    def _finish_turn(self):
        self._draw_board()
        term = self._detect_terminal()
        if term is not None:
            self._announce(term); return
        self.root.after(100, self.ai_move)

    def ai_move(self):
        # sync AI config
        if self.ai.algorithm != self.ai_algo.get() or self.ai.depth != self.ai_depth.get() or self.ai.time_limit != self.time_limit.get():
            self.ai = AIPlayer(self.ai_algo.get(), self.ai_depth.get(), time_limit=self.time_limit.get())
        col, stats = self.ai.get_move(self.game, 2)
        r = self._landing_row(col)
        self._animate_drop(col, r, AI_COLOR)
        self.game.drop_piece(col, 2)
        self.last_move = (r, col)
        self.history.append(("AI", col, r))
        self.listbox.insert(tk.END, f"{len(self.history)}. AI [{self.ai_algo.get()} d{self.ai_depth.get()}] → col {col+1}")
        self.info_nodes.set(f"Nodes: {int(stats.get('nodes',0))}")
        self.info_time.set(f"Time: {stats.get('time_ms',0.0):.1f} ms")
        self.info_turn.set("Turn: HUMAN (X)")
        self._draw_board()
        term = self._detect_terminal()
        if term is not None:
            self._announce(term)

    # --------- Helpers ---------
    def _landing_row(self, col):
        r = 5
        while r >= 0 and self.game.board[r][col] != 0:
            r -= 1
        return r if r >= 0 else None

    def _animate_drop(self, col, target_row, color):
        if target_row is None: return
        cx = PADDING + col*CELL + CELL/2
        y = PADDING - CELL/2
        rad = CELL/2 - DISC_MARGIN
        oval = self.canvas.create_oval(cx-rad, y-rad, cx+rad, y+rad, fill=color, outline="")
        self.root.update_idletasks()
        target_y = PADDING + target_row*CELL + CELL/2
        # play sfx
        if winsound:
            try: winsound.PlaySound(os.path.join('assets','drop.wav'), winsound.SND_ASYNC | winsound.SND_FILENAME)
            except: pass
        while y < target_y:
            y += 24
            self.canvas.coords(oval, cx-rad, y-rad, cx+rad, y+rad)
            self.root.update()
            time.sleep(0.01)
        self.canvas.delete(oval)
        self._draw_board()

    def _detect_terminal(self):
        if self.game.check_winner(2): 
            self.winning_cells = self._winning_cells(2); return 2
        if self.game.check_winner(1): 
            self.winning_cells = self._winning_cells(1); return 1
        if self.game.is_board_full(): 
            self.winning_cells = None; return 0
        self.winning_cells = None
        return None

    def _winning_cells(self, player):
        B=self.game.board; R=self.game.rows; C=self.game.cols
        # horizontal
        for r in range(R):
            for c in range(C-3):
                if all(B[r][c+i]==player for i in range(4)):
                    return [(r,c+i) for i in range(4)]
        for c in range(C):
            for r in range(R-3):
                if all(B[r+i][c]==player for i in range(4)):
                    return [(r+i,c) for i in range(4)]
        for r in range(3, R):
            for c in range(C-3):
                if all(B[r-i][c+i]==player for i in range(4)):
                    return [(r-i,c+i) for i in range(4)]
        for r in range(R-3):
            for c in range(C-3):
                if all(B[r+i][c+i]==player for i in range(4)):
                    return [(r+i,c+i) for i in range(4)]
        return None

    def _announce(self, term):
        # win music
        if winsound and term in (1,2):
            try: winsound.PlaySound(os.path.join('assets','win.wav'), winsound.SND_ASYNC | winsound.SND_FILENAME)
            except: pass
        if term == 2: messagebox.showinfo("Game Over", "AI wins!")
        elif term == 1: messagebox.showinfo("Game Over", "You win!")
        else: messagebox.showinfo("Game Over", "Draw!")

    def reset(self):
        self.game = ConnectFour()
        self.history.clear(); self.redo_stack.clear()
        self.listbox.delete(0, tk.END)
        self.info_nodes.set("Nodes: 0"); self.info_time.set("Time: 0 ms")
        self.info_turn.set("Turn: HUMAN (X)")
        self.last_move=None; self.winning_cells=None
        self._draw_board()

    def undo(self):
        if not self.history: return
        # step back one move (human's last), keep parity
        label = self.history.pop()
        self._undo_last_move()
        if self.history and self.game.current_player==2:  # if AI's turn, undo AI too
            self._undo_last_move()
        self._redraw_history()

    def _undo_last_move(self):
        # Remove top-most disc in that column
        _, col, _ = self.history[-1] if self.history else ("", None, None)
        if col is None: return
        for r in range(self.game.rows):
            if self.game.board[r][col] != 0:
                self.game.board[r][col] = 0
                break
        self.game.current_player = 1 if self.game.current_player==2 else 2

    def redo(self):
        # Simple redo not tracked in this minimal implementation
        pass

    def _redraw_history(self):
        self.listbox.delete(0, tk.END)
        for i,(p,c,r) in enumerate(self.history, start=1):
            self.listbox.insert(tk.END, f"{i}. {p} → col {c+1}")
        self._draw_board()

    def export_logs(self):
        path = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON","*.json")])
        if not path: return
        data = {
            "moves":[{"no":i+1,"player":p,"col":c,"row":r} for i,(p,c,r) in enumerate(self.history)],
            "algorithm": self.ai_algo.get(),
            "depth": int(self.ai_depth.get()),
            "time_limit_s": float(self.time_limit.get()),
            "final": 0 if self.winning_cells is None else ("AI" if self.game.check_winner(2) else "HUMAN")
        }
        with open(path,"w") as f:
            import json; json.dump(data,f,indent=2)
        messagebox.showinfo("Export", f"Saved: {path}")

    def toggle_music(self):
        if not winsound:
            messagebox.showwarning("Audio", "winsound tidak tersedia di platform ini.")
            return
        if self.music_on.get():
            try:
                winsound.PlaySound(os.path.join('assets','bg.wav'), winsound.SND_ASYNC | winsound.SND_LOOP | winsound.SND_FILENAME)
            except Exception as e:
                messagebox.showwarning("Audio", f"Gagal memutar musik: {e}")
        else:
            winsound.PlaySound(None, winsound.SND_PURGE)

    def hint(self):
        # Saran langkah terbaik tanpa mengubah state
        temp_ai = AIPlayer(self.ai_algo.get(), self.ai_depth.get(), time_limit=self.time_limit.get())
        col, _ = temp_ai.get_move(self.game, 2)
        if col is None: return
        # highlight kolom di atas
        self.hover_col = col
        self._draw_board()
        self.canvas.after(800, self._clear_hover)

def run_gui():
    root = tk.Tk()
    app = ConnectFourGUI(root)
    root.mainloop()
