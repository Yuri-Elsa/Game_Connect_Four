
"""
minimax.py - Implementasi Minimax (tanpa pruning) dengan time guard opsional
"""
import time

class MinimaxAI:
    def __init__(self, depth=4, time_limit=None):
        self.depth = depth
        self.nodes_explored = 0
        self.name = "Minimax"
        self.time_limit = time_limit  # detik

    def evaluate_position(self, game, player):
        return game.evaluate_position(player)

    def best_move(self, game, player):
        start = time.time()
        self.nodes_explored = 0
        valid_cols = game.get_valid_columns()
        if not valid_cols:
            return None, {"nodes": 0, "time_ms": 0.0}

        best_score = float('-inf')
        best_col = valid_cols[0]

        for col in valid_cols:
            game_copy = game.clone()
            game_copy.drop_piece(col, player)
            score = self.minimax(game_copy, self.depth - 1, False, player, start)
            if score > best_score:
                best_score, best_col = score, col

        elapsed_ms = (time.time() - start) * 1000.0
        return best_col, {"nodes": self.nodes_explored, "time_ms": elapsed_ms}

    def minimax(self, game, depth, is_maximizing, player, start_time):
        self.nodes_explored += 1
        if self.time_limit is not None and (time.time() - start_time) > self.time_limit:
            return self.evaluate_position(game, player)

        opponent = 3 - player
        if game.check_winner(player):
            return 1_000_000
        if game.check_winner(opponent):
            return -1_000_000
        if game.is_board_full() or depth == 0:
            return self.evaluate_position(game, player)

        valid_cols = game.get_valid_columns()

        if is_maximizing:
            value = float('-inf')
            for col in valid_cols:
                game_copy = game.clone()
                game_copy.drop_piece(col, player)
                value = max(value, self.minimax(game_copy, depth - 1, False, player, start_time))
            return value
        else:
            value = float('inf')
            for col in valid_cols:
                game_copy = game.clone()
                game_copy.drop_piece(col, opponent)
                value = min(value, self.minimax(game_copy, depth - 1, True, player, start_time))
            return value
