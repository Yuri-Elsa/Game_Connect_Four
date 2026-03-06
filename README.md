# 🔴 Connect Four AI

> Permainan papan Connect Four klasik dengan lawan AI berbasis **Minimax + Alpha-Beta Pruning**, dibangun dengan React. Dilengkapi onboarding interaktif dan tutorial in-game.

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript)

---

## 📸 Preview

```
┌─────────────────────────────┐
│  🔴 CONNECT FOUR            │
│  ▼  ▼  ▼  ▼  ▼  ▼  ▼      │
│  ○  ○  ○  ○  ○  ○  ○       │
│  ○  ○  ○  ○  ○  ○  ○       │
│  ○  ○  ○  🟡  ○  ○  ○      │
│  ○  ○  🔴 🟡  ○  ○  ○      │
│  ○  🔴 🔴 🟡 🔴  ○  ○      │
└─────────────────────────────┘
```

---

## ✨ Fitur

- 🤖 **AI Alpha-Beta Pruning** — kedalaman pencarian 1–7 yang bisa diatur
- 🎓 **Tutorial interaktif** — 7 langkah panduan yang selalu berakhir dengan kemenangan pemain
- 📊 **Metrik AI realtime** — nodes diperiksa & waktu kalkulasi tampil langsung
- ↩️ **Undo** — batalkan gerakan terakhir kapan saja
- 🌌 **UI tema galaktik gelap** — animasi keping jatuh, hover preview, highlight kemenangan

---

## 🚀 Cara Menjalankan

```bash
# Clone repositori
git clone https://github.com/username/connect-four-ai.git
cd connect-four-ai

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173`

---

## 📁 Struktur Proyek

```
src/
├── App.jsx                        # Root: komposisi komponen, tanpa logika bisnis
├── constants/
│   ├── board.js                   # Konstanta: ROWS, COLS, PLAYER_*, PHASE_*
│   └── tutorialSteps.js           # Data 7 langkah tutorial
├── game/
│   └── logic.js                   # Pure functions: dropPiece, checkWinner, isFull
├── ai/
│   ├── evaluation.js              # Fungsi heuristik & scoring papan
│   └── alphaBeta.js               # Algoritma Alpha-Beta Pruning + getBestMove()
├── hooks/
│   └── useGameState.js            # Semua state game, AI trigger, undo, tutorial flow
├── components/
│   ├── GameBoard.jsx              # Grid papan, tombol kolom, hover preview, animasi
│   ├── SidePanel.jsx              # Status, metrik, settings depth, history, tombol aksi
│   ├── OnboardingModal.jsx        # Layar sambutan pertama kali buka
│   ├── TutorialBanner.jsx         # Banner panduan tutorial di bawah layar
│   ├── ResultCard.jsx             # Overlay menang / kalah / seri
│   └── Stars.jsx                  # Background bintang dekoratif
└── styles/
    └── gameStyles.js              # Seluruh CSS dalam satu file
```

---

## 🧠 Algoritma AI

### Minimax dengan Alpha-Beta Pruning

AI menggunakan algoritma **Minimax** untuk menelusuri pohon kemungkinan gerakan, dioptimasi dengan **Alpha-Beta Pruning** yang memangkas cabang yang tidak relevan — menghasilkan keputusan lebih cepat tanpa mengorbankan kualitas.

```
Minimax biasa:   O(b^d)        ~16.807 nodes (b=7, d=5)
Alpha-Beta:      O(b^(d/2))    ~130 nodes (kondisi ideal)
```

**Move ordering** (centre-first) memaksimalkan efisiensi pruning:

```js
// Kolom tengah diprioritaskan karena lebih banyak peluang menang
validCols.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
```

### Fungsi Heuristik

Setiap window 4 sel dievaluasi di semua arah:

| Kondisi                     | Skor          |
| --------------------------- | ------------- |
| 4 keping berurutan          | +100.000      |
| 3 keping + 1 kosong         | +100          |
| 2 keping + 2 kosong         | +10           |
| 3 lawan + 1 kosong (blokir) | −120          |
| 2 lawan + 2 kosong          | −12           |
| Kontrol kolom tengah        | +6 per keping |

---

## 🎓 Tutorial

Tutorial memandu pemain baru melalui 7 langkah yang **selalu berakhir dengan kemenangan**, membangun kepercayaan diri sebelum menghadapi AI sungguhan.

| #   | Langkah                               | `forceCol` |
| --- | ------------------------------------- | ---------- |
| 0   | Sambutan & penjelasan tujuan          | —          |
| 1   | Klik kolom untuk menjatuhkan keping   | 3 (tengah) |
| 2   | Perhatikan AI bergerak + metrik       | —          |
| 3   | Mulai bangun deretan horizontal       | 2          |
| 4   | Lanjutkan deretan                     | 4          |
| 5   | Tutup dengan keping keempat (menang!) | 5          |
| 6   | Selamat + ajak main bebas             | —          |

---

## ⚙️ Konfigurasi

Edit `src/constants/board.js` untuk menyesuaikan:

```js
export const ROWS = 6; // Jumlah baris papan
export const COLS = 7; // Jumlah kolom papan
export const DEFAULT_DEPTH = 4; // Kedalaman AI default
export const AI_TIME_LIMIT_SEC = 2.0; // Batas waktu kalkulasi AI (detik)
export const AI_MOVE_DELAY_MS = 600; // Jeda sebelum AI bergerak (UX)
```

---

## 🧩 State Management

Seluruh state dikelola oleh satu custom hook `useGameState.js`. Komponen hanya menerima props dan memanggil action — tidak ada business logic di dalam JSX.

```
useGameState()
├── board, currentPlayer, winner, winCells, gameOver
├── droppingCell, aiThinking
├── metrics, depth
├── moveHistory, boardHistory
├── phase, tutorialStep
└── handleColClick, handleUndo, handleRestart,
    startTutorial, skipTutorial, finishTutorial
```

---

## 🤝 Kontribusi

Pull request sangat disambut! Pastikan:

- Pure functions di `game/` dan `ai/` tidak mengimpor React
- Komponen hanya menyimpan UI state lokal (contoh: `hoverCol`)
- Semua business logic masuk ke `hooks/useGameState.js`
- Tambah komentar JSDoc pada fungsi publik baru

### Menambah Algoritma AI Baru

Buat file di `src/ai/` dan ekspor `getBestMove()` dengan signature yang sama:

```js
// src/ai/monteCarlo.js
export function getBestMove(board, player, depth, timeLimitSec) {
  // ...implementasi
  return { col, timeMs, nodes };
}
```

Lalu impor dan tambahkan opsi di `SidePanel.jsx` dan `useGameState.js`.

---

## 📄 Lisensi

[MIT](LICENSE) © 2025
