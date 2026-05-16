export const DINO_FACTS = [
    "T-Rex had the strongest bite of any land animal — but arms so short it couldn't reach its own mouth 🦖",
    "Velociraptors were actually about the size of a turkey. Hollywood lied to you 🦃",
    "Some dinosaurs had feathers! Birds are literally living dinosaurs 🐦",
    "The Brachiosaurus was so tall it could look into a 4th floor window 🏢",
    "Stegosaurus had a brain the size of a walnut. Relatable honestly 🥜",
    "T-Rex and Stegosaurus are further apart in time than T-Rex and us 🤯",
    "Dinosaurs roamed every continent, including Antarctica 🧊",
    "The longest dinosaur name is Micropachycephalosaurus. Say that 5 times fast 😅",
    "Some dinosaurs swallowed rocks to help digest food 🪨",
    "Dinosaurs dominated Earth for 165 million years. Humans have been here 0.2 million 😬",
]

export const randomDinoFact = () =>
    DINO_FACTS[Math.floor(Math.random() * DINO_FACTS.length)]