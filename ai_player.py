
"""
ai_player.py - Wrapper untuk AI Players dengan metrik dan time limit
"""
from minimax import MinimaxAI
from alpha_beta import AlphaBetaAI

class AIPlayer:
    def __init__(self, algorithm='alpha_beta', depth=4, time_limit=None):
        self.algorithm = algorithm
        self.depth = depth
        self.time_limit = time_limit

        if algorithm == 'minimax':
            self.engine = MinimaxAI(depth=depth, time_limit=time_limit)
        else:
            self.engine = AlphaBetaAI(depth=depth, time_limit=time_limit)

    def get_move(self, game, player):
        col, stats = self.engine.best_move(game, player)
        # normalisasi dict stats
        stats.setdefault("nodes", getattr(self.engine, "nodes_explored", 0))
        stats.setdefault("time_ms", 0.0)
        return col, stats
