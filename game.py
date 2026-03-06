"""
game.py - Logic Permainan Connect Four
Menangani papan permainan, validasi gerakan, dan pengecekan kemenangan
"""

import copy


class ConnectFour:
    def __init__(self, rows=6, cols=7):
        """
        Inisialisasi papan Connect Four
        """
        self.rows = rows
        self.cols = cols
        self.board = [[0 for _ in range(cols)] for _ in range(rows)]
        self.current_player = 1  # Player 1 dimulai (manusia)
        self.winner = None
        self.game_over = False
        self.last_move = None

    def reset(self):
        """Reset permainan ke kondisi awal"""
        self.board = [[0 for _ in range(self.cols)] for _ in range(self.rows)]
        self.current_player = 1
        self.winner = None
        self.game_over = False
        self.last_move = None

    def get_valid_columns(self):
        """Mendapatkan list kolom yang valid untuk diisi"""
        return [col for col in range(self.cols) if self.board[0][col] == 0]

    def is_valid_move(self, col):
        """Cek apakah gerakan ke kolom tertentu valid"""
        if col < 0 or col >= self.cols:
            return False
        return self.board[0][col] == 0

    def get_next_open_row(self, col):
        """Mendapatkan baris paling bawah yang kosong di kolom tertentu"""
        for row in range(self.rows - 1, -1, -1):
            if self.board[row][col] == 0:
                return row
        return None

    def drop_piece(self, col, player):
        """Menjatuhkan piece ke kolom tertentu"""
        if not self.is_valid_move(col):
            return None
        row = self.get_next_open_row(col)
        if row is not None:
            self.board[row][col] = player
            self.last_move = (row, col)
            return (row, col)
        return None

    def check_winner(self, player):
        """Cek apakah pemain tertentu menang"""
        # Cek horizontal
        for row in range(self.rows):
            for col in range(self.cols - 3):
                if all(self.board[row][col + i] == player for i in range(4)):
                    return True

        # Cek vertical
        for row in range(self.rows - 3):
            for col in range(self.cols):
                if all(self.board[row + i][col] == player for i in range(4)):
                    return True

        # Cek diagonal (kanan bawah)
        for row in range(self.rows - 3):
            for col in range(self.cols - 3):
                if all(self.board[row + i][col + i] == player for i in range(4)):
                    return True

        # Cek diagonal (kiri bawah)
        for row in range(self.rows - 3):
            for col in range(3, self.cols):
                if all(self.board[row + i][col - i] == player for i in range(4)):
                    return True

        return False

    def is_board_full(self):
        """Cek apakah papan penuh (draw)"""
        return all(self.board[0][col] != 0 for col in range(self.cols))

    def make_move(self, col):
        """Melakukan gerakan dan update state permainan"""
        if self.game_over:
            return False

        result = self.drop_piece(col, self.current_player)
        if result is None:
            return False

        # Cek apakah ada pemenang
        if self.check_winner(self.current_player):
            self.winner = self.current_player
            self.game_over = True
        # Cek apakah board penuh (draw)
        elif self.is_board_full():
            self.game_over = True
            self.winner = 0  # Draw
        else:
            # Ganti pemain
            self.current_player = 3 - self.current_player

        return True

    def get_board_copy(self):
        """Mendapatkan salinan papan saat ini"""
        return copy.deepcopy(self.board)

    def clone(self):
        """Membuat clone dari game state saat ini"""
        cloned = ConnectFour(self.rows, self.cols)
        cloned.board = self.get_board_copy()
        cloned.current_player = self.current_player
        cloned.winner = self.winner
        cloned.game_over = self.game_over
        cloned.last_move = self.last_move
        return cloned

    def evaluate_window(self, window, player):
        """Evaluasi 4-sel untuk heuristik"""
        score = 0
        opponent = 3 - player
        pc = window.count(player)
        oc = window.count(opponent)
        ec = window.count(0)

        if pc == 4:
            score += 100000
        elif pc == 3 and ec == 1:
            score += 100
        elif pc == 2 and ec == 2:
            score += 10

        if oc == 3 and ec == 1:
            score -= 120  # blokir diprioritaskan
        elif oc == 2 and ec == 2:
            score -= 12
        return score

    def evaluate_position(self, player):
        """Skor posisi untuk `player`. Bonus kontrol kolom tengah."""
        score = 0
        center_col = self.cols // 2
        center_array = [self.board[r][center_col] for r in range(self.rows)]
        score += center_array.count(player) * 6
        score -= center_array.count(3 - player) * 6

        # Horizontal
        for r in range(self.rows):
            for c in range(self.cols - 3):
                window = [self.board[r][c+i] for i in range(4)]
                score += self.evaluate_window(window, player)

        # Vertical
        for c in range(self.cols):
            for r in range(self.rows - 3):
                window = [self.board[r+i][c] for i in range(4)]
                score += self.evaluate_window(window, player)

        # Diagonal /
        for r in range(3, self.rows):
            for c in range(self.cols - 3):
                window = [self.board[r-i][c+i] for i in range(4)]
                score += self.evaluate_window(window, player)

        # Diagonal \
        for r in range(self.rows - 3):
            for c in range(self.cols - 3):
                window = [self.board[r+i][c+i] for i in range(4)]
                score += self.evaluate_window(window, player)

        return score

    def print_board(self):
        """Print papan ke console (untuk debugging)"""
        symbols = {0: '.', 1: 'X', 2: 'O'}
        print("\n" + " ".join(str(i) for i in range(self.cols)))
        for row in self.board:
            print(" ".join(symbols[cell] for cell in row))
        print()
