
"""
benchmarks.py - eksperimen otomatis untuk membandingkan Minimax vs Alpha-Beta
"""
import csv, random
from game import ConnectFour
from ai_player import AIPlayer

def random_state(steps=6):
    g = ConnectFour()
    for _ in range(steps):
        cols = g.get_valid_columns()
        if not cols: break
        g.drop_piece(random.choice(cols), g.current_player)
        g.current_player = 2 if g.current_player==1 else 1
        if g.check_winner(1) or g.check_winner(2):
            break
    return g

def main():
    rows=[]
    for alg in ["minimax","alpha_beta"]:
        for depth in [3,4,5]:
            for i in range(20):
                g = random_state(steps=6)
                ai = AIPlayer(alg, depth, time_limit=1.5)
                col, stats = ai.get_move(g, 2)
                rows.append([alg, depth, i, stats.get("nodes",0), stats.get("time_ms",0.0), col])
    with open("benchmarks.csv","w",newline="") as f:
        w=csv.writer(f); w.writerow(["algorithm","depth","sample","nodes","time_ms","chosen_col"]); w.writerows(rows)
    print("Saved benchmarks.csv")

if __name__=="__main__":
    main()
