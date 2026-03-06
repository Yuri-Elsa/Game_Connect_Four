/**
 * constants/tutorialSteps.js
 * Defines every step of the guided in-game tutorial.
 * Each step can optionally lock the player to a specific column (forceCol)
 * so the tutorial always ends with the human winning.
 */

export const TUTORIAL_STEPS = [
  {
    title: "Selamat Datang di Connect Four!",
    desc:
      "Mari kita pelajari cara bermain. Kamu akan melawan AI yang cerdas. " +
      "Tujuannya: sambungkan 4 keping milikmu secara berurutan!",
    icon: "👋",
    action: null,
    highlight: null,
    forceCol: undefined,
  },
  {
    title: "Klik Kolom untuk Menjatuhkan Keping",
    desc:
      "Papan memiliki 7 kolom dan 6 baris. Klik salah satu kolom di atas " +
      "untuk menjatuhkan keping merahmu ke bawah. Coba klik kolom 4 (tengah)!",
    icon: "🖱️",
    action: "click_col",
    highlight: "col_3",
    forceCol: 3,
  },
  {
    title: "Kini Giliran AI",
    desc:
      "AI (keping kuning) sekarang akan berpikir dan memilih kolom terbaiknya " +
      "menggunakan algoritma Minimax dengan Alpha-Beta Pruning. " +
      "Perhatikan metrik di panel kanan!",
    icon: "🤖",
    action: "wait_ai",
    highlight: "metrics",
    forceCol: undefined,
  },
  {
    title: "Buat 4 Berurutan!",
    desc:
      "Kamu bisa menang secara horizontal ↔, vertikal ↕, atau diagonal ↗↘. " +
      "Sekarang coba klik kolom 3 untuk mulai membangun baris horizontal!",
    icon: "🎯",
    action: "click_col",
    highlight: "col_2",
    forceCol: 2,
  },
  {
    title: "Terus Bangun Deretan!",
    desc: "Bagus! Terus tambahkan keping di kolom 5 untuk melanjutkan deretan horizontalmu.",
    icon: "🔗",
    action: "click_col",
    highlight: "col_4",
    forceCol: 4,
  },
  {
    title: "Satu Lagi untuk Menang!",
    desc:
      "Kamu hampir menang! Klik kolom 6 untuk menutup deretan 4 kepingmu " +
      "dan meraih kemenangan!",
    icon: "🏆",
    action: "click_col",
    highlight: "col_5",
    forceCol: 5,
  },
  {
    title: "🎉 Kamu Menang!",
    desc:
      "Luar biasa! Kamu sudah paham cara bermain. Sekarang tantang AI sungguhan! " +
      "Ingat: blokir deretan AI sebelum mencapai 4, dan bangun deretanmu sendiri.",
    icon: "🎉",
    action: "finish",
    highlight: null,
    forceCol: undefined,
  },
];
