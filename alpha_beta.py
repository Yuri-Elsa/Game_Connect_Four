
"""
alpha_beta.py - Implementasi Minimax dengan Alpha-Beta Pruning (optimized)
- Move ordering (center-first) untuk pruning maksimal
- Time guard opsional agar responsif
- Stat nodes_explored untuk analisis
"""
import time

class AlphaBetaAI:
    def __init__(self, depth=4, time_limit=None):
        self.depth = depth
        self.nodes_explored = 0
        self.pruned_branches = 0
        self.name = "Alpha-Beta Pruning"
        self.time_limit = time_limit  # detik

    def evaluate_position(self, game, player):
        return game.evaluate_position(player)

    def best_move(self, game, player):
        start = time.time()
        self.nodes_explored = 0
        self.pruned_branches = 0

        valid_cols = game.get_valid_columns()
        if not valid_cols:
            return None, {"nodes": 0, "time_ms": 0.0, "pruned": 0}

        # MOVE ORDERING: center-first
        center = game.cols // 2
        valid_cols.sort(key=lambda c: abs(c - center))

        best_score = float('-inf')
        best_col = valid_cols[0]
        alpha, beta = float('-inf'), float('inf')

        for col in valid_cols:
            game_copy = game.clone()
            game_copy.drop_piece(col, player)
            score = self.alpha_beta(game_copy, self.depth - 1, alpha, beta, False, player, start)
            if score > best_score:
                best_score, best_col = score, col
            alpha = max(alpha, score)

        elapsed_ms = (time.time() - start) * 1000.0
        return best_col, {"nodes": self.nodes_explored, "time_ms": elapsed_ms, "pruned": self.pruned_branches}

    def alpha_beta(self, game, depth, alpha, beta, is_maximizing, player, start_time):
        self.nodes_explored += 1
        # TIME GUARD
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
        # order again at deeper levels
        center = game.cols // 2
        valid_cols.sort(key=lambda c: abs(c - center))

        if is_maximizing:
            value = float('-inf')
            for col in valid_cols:
                game_copy = game.clone()
                game_copy.drop_piece(col, player)
                value = max(value, self.alpha_beta(game_copy, depth - 1, alpha, beta, False, player, start_time))
                alpha = max(alpha, value)
                if alpha >= beta:
                    self.pruned_branches += 1
                    break
            return value
        else:
            value = float('inf')
            for col in valid_cols:
                game_copy = game.clone()
                game_copy.drop_piece(col, opponent)
                value = min(value, self.alpha_beta(game_copy, depth - 1, alpha, beta, True, player, start_time))
                beta = min(beta, value)
                if alpha >= beta:
                    self.pruned_branches += 1
                    break
            return value
