"""
main.py - Entry Point untuk Aplikasi Connect Four AI
Menjalankan aplikasi dengan GUI atau mode console
"""

import sys
import tkinter as tk
from gui import ConnectFourGUI
from game import ConnectFour
from ai_player import AIPlayer


def run_gui():
    """Menjalankan aplikasi dengan GUI"""
    root = tk.Tk()
    app = ConnectFourGUI(root)
    root.mainloop()


def run_console():
    """Menjalankan aplikasi dalam mode console (untuk testing)"""
    print("=" * 50)
    print("CONNECT FOUR - AI ADVERSARIAL SEARCH")
    print("=" * 50)
    print()
    
    # Pilih mode
    print("Pilih Mode:")
    print("1. Player vs Minimax AI")
    print("2. Player vs Alpha-Beta AI")
    print("3. Minimax vs Alpha-Beta (AI vs AI)")
    
    while True:
        try:
            choice = int(input("\nPilihan (1-3): "))
            if 1 <= choice <= 3:
                break
            print("Pilihan tidak valid!")
        except ValueError:
            print("Masukkan angka 1-3!")
    
    # Pilih depth
    while True:
        try:
            depth = int(input("Masukkan AI Depth (1-6, recommended 4): "))
            if 1 <= depth <= 6:
                break
            print("Depth harus antara 1-6!")
        except ValueError:
            print("Masukkan angka!")
    
    game = ConnectFour()
    
    if choice == 1:
        ai = AIPlayer('minimax', depth)
        play_vs_ai(game, ai, 'Minimax')
    elif choice == 2:
        ai = AIPlayer('alpha_beta', depth)
        play_vs_ai(game, ai, 'Alpha-Beta')
    else:
        ai1 = AIPlayer('minimax', depth)
        ai2 = AIPlayer('alpha_beta', depth)
        play_ai_vs_ai(game, ai1, ai2)


def play_vs_ai(game, ai, ai_name):
    """
    Mode Player vs AI dalam console
    
    Args:
        game: ConnectFour object
        ai: AIPlayer object
        ai_name (str): Nama algoritma AI
    """
    print(f"\n🎮 Mode: Player vs {ai_name} AI")
    print("Anda adalah Player 1 (X), AI adalah Player 2 (O)")
    print()
    
    while not game.game_over:
        game.print_board()
        
        if game.current_player == 1:
            # Player turn
            print("Giliran Anda!")
            valid_cols = game.get_valid_columns()
            print(f"Kolom valid: {valid_cols}")
            
            while True:
                try:
                    col = int(input("Pilih kolom (0-6): "))
                    if col in valid_cols:
                        break
                    print("Kolom tidak valid!")
                except ValueError:
                    print("Masukkan angka!")
            
            game.make_move(col)
            
        else:
            # AI turn
            print(f"\n🤖 Giliran {ai_name} AI...")
            col, stats = ai.get_move(game, 2)
            print(f"AI memilih kolom: {col}")
            print(f"Nodes explored: {stats['nodes_explored']:,}")
            print(f"Time taken: {stats['time_taken']:.3f}s")
            if 'pruned_branches' in stats:
                print(f"Pruned branches: {stats['pruned_branches']:,}")
            
            game.make_move(col)
            print()
    
    # Game over
    game.print_board()
    if game.winner == 0:
        print("🤝 Permainan SERI!")
    elif game.winner == 1:
        print("🎉 Selamat! Anda MENANG!")
    else:
        print(f"😔 {ai_name} AI MENANG!")


def play_ai_vs_ai(game, ai1, ai2):
    """
    Mode AI vs AI dalam console
    
    Args:
        game: ConnectFour object
        ai1: AIPlayer object (Minimax)
        ai2: AIPlayer object (Alpha-Beta)
    """
    print("\n🤖 Mode: Minimax vs Alpha-Beta")
    print("Player 1 (X) = Minimax")
    print("Player 2 (O) = Alpha-Beta")
    print()
    
    move_count = 0
    
    while not game.game_over:
        game.print_board()
        
        current_ai = ai1 if game.current_player == 1 else ai2
        ai_name = "Minimax" if game.current_player == 1 else "Alpha-Beta"
        
        print(f"\n🤖 Giliran {ai_name}...")
        col, stats = current_ai.get_move(game, game.current_player)
        
        move_count += 1
        print(f"Move #{move_count}: {ai_name} memilih kolom {col}")
        print(f"  Nodes: {stats['nodes_explored']:,} | Time: {stats['time_taken']:.3f}s", end="")
        if 'pruned_branches' in stats:
            print(f" | Pruned: {stats['pruned_branches']:,}")
        else:
            print()
        
        game.make_move(col)
        
        input("Tekan Enter untuk lanjut...")
    
    # Game over
    game.print_board()
    if game.winner == 0:
        print("🤝 Permainan SERI!")
    elif game.winner == 1:
        print("🏆 MINIMAX MENANG!")
    else:
        print("🏆 ALPHA-BETA MENANG!")
    
    # Statistik akhir
    print("\n" + "=" * 50)
    print("STATISTIK AKHIR")
    print("=" * 50)
    
    stats1 = ai1.get_average_stats()
    stats2 = ai2.get_average_stats()
    
    print(f"\nMinimax:")
    print(f"  Total moves: {stats1['total_moves']}")
    print(f"  Avg nodes: {stats1['avg_nodes']:,.1f}")
    
    print(f"\nAlpha-Beta:")
    print(f"  Total moves: {stats2['total_moves']}")
    print(f"  Avg nodes: {stats2['avg_nodes']:,.1f}")
    
    if stats1['avg_nodes'] > 0 and stats2['avg_nodes'] > 0:
        efficiency = ((stats1['avg_nodes'] - stats2['avg_nodes']) / stats1['avg_nodes']) * 100
        print(f"\n✨ Alpha-Beta {efficiency:.1f}% lebih efisien!")


def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == '--console':
        run_console()
    else:
        run_gui()


if __name__ == '__main__':
    main()