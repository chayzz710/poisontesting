export const LOADING_MESSAGES = [
  "Loading love... please wait, it's worth it 💛",
  "Polishing the polaroids ✨",
  "Asking the frog for directions 🐸",
  "Stirring chocolate into the pixels 🍫",
  "Wrapping the next Kinder Joy 🥚",
  "Drawing Riptide ⚔️",
  "Calculating moves... ♟️",
  "Counting sunflowers 🌻",
  "Pressing sunflowers between pages 🌻",
  "Untangling the puns 😩",
  "Refilling the memory jar 💌",
  "Pinning a new spot on the map 📍",
  "Shuffling the playlist 🎵",
  "The frog is thinking... 🐸",
]

export const randomMessage = () =>
  LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
