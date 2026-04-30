const bingoItems = [
  "Host zegt: “Welkom in de Space!”",
  "Iemand vraagt om de mic",
  "Slechte verbinding / robotstem",
  "“Kun je me horen?”",
  "Meme-referentie",
  "Stilte van 5 seconden",
  "Inval-tweet genoemd",
  "Gast vergeet zichzelf te unmuted",
  "Live poll in de chat",
  "Muziek op de achtergrond",
  "“Volg me op X”",
  "Co-host geeft shout-out",
  "Iemand praat over threads",
  "Breaking news gedeeld",
  "Emoji-storm in de chat",
  "“Ik ga even luisteren”",
  "Hand-raise jam",
  "Compliment aan de host",
  "Hot take genoemd",
  "Q&A moment",
  "Spreker deelt een link",
  "Inside joke",
  "Spontane giveaway",
  "Nieuwe volger genoemd",
  "“We gaan afronden”"
];

const startScreen = document.getElementById("start-screen");
const bingoScreen = document.getElementById("bingo-screen");
const handleInput = document.getElementById("handle");
const startBtn = document.getElementById("startBtn");
const newCardBtn = document.getElementById("newCardBtn");
const bingoCard = document.getElementById("bingo-card");
const playerName = document.getElementById("player-name");
const status = document.getElementById("status");

const gridSize = 5;
const centerIndex = Math.floor((gridSize * gridSize) / 2);

const shuffle = (items) => items.sort(() => Math.random() - 0.5);

const buildCard = () => {
  bingoCard.innerHTML = "";
  status.textContent = "";

  const cardItems = shuffle([...bingoItems]).slice(0, gridSize * gridSize);
  cardItems[centerIndex] = "FREE SPACE";

  cardItems.forEach((text, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className =
      "bingo-tile flex items-center justify-center text-sm md:text-base p-2 text-center h-full";
    tile.textContent = text;

    if (index === centerIndex) {
      tile.classList.add("locked");
      tile.dataset.locked = "true";
    }

    tile.addEventListener("click", () => toggleTile(tile));
    bingoCard.appendChild(tile);
  });

  updateStatus();
};

const toggleTile = (tile) => {
  if (tile.dataset.locked === "true") {
    return;
  }
  tile.classList.toggle("active");
  updateStatus();
};

const getTiles = () => Array.from(bingoCard.querySelectorAll("button"));

const hasBingo = () => {
  const tiles = getTiles();
  const isMarked = (index) =>
    tiles[index].classList.contains("active") ||
    tiles[index].classList.contains("locked");

  const lines = [];
  for (let row = 0; row < gridSize; row += 1) {
    lines.push(
      Array.from({ length: gridSize }, (_, col) => row * gridSize + col)
    );
  }
  for (let col = 0; col < gridSize; col += 1) {
    lines.push(
      Array.from({ length: gridSize }, (_, row) => row * gridSize + col)
    );
  }
  lines.push(Array.from({ length: gridSize }, (_, i) => i * (gridSize + 1)));
  lines.push(
    Array.from({ length: gridSize }, (_, i) => (i + 1) * (gridSize - 1))
  );

  return lines.some((line) => line.every((index) => isMarked(index)));
};

const updateStatus = () => {
  const tiles = getTiles();
  const activeCount = tiles.filter((tile) =>
    tile.classList.contains("active")
  ).length;

  if (hasBingo()) {
    status.innerHTML =
      '<span class="status-chip">🎉 Bingo! Deel je kaart in de Space.</span>';
    return;
  }

  status.textContent =
    activeCount === 0
      ? "Tik vakjes aan om je Bingo te vullen."
      : `${activeCount} vakjes afgevinkt`;
};

startBtn.addEventListener("click", () => {
  const handle = handleInput.value.trim();
  playerName.textContent = handle ? `Kaart van ${handle}` : "Jouw bingo-kaart";

  startScreen.classList.add("hidden");
  bingoScreen.classList.remove("hidden");
  buildCard();
});

newCardBtn.addEventListener("click", () => buildCard());

handleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startBtn.click();
  }
});
