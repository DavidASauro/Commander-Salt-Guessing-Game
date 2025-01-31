import { promises as fs } from "fs";

interface Cache {
  [key: string]: string;
}

const cache: Cache = {};

export default async function FetchCard() {
  const file = await fs.readFile(
    process.cwd() + "/app/data/results.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const keys = Object.keys(data);
  const randomIndex = Math.floor(Math.random() * keys.length);
  let randomKey = keys[randomIndex];

  while (cache[randomKey]) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    randomKey = keys[randomIndex];
  }

  cache[randomKey] = `https://api.scryfall.com/cards/named?exact=${randomKey}`;

  const response = await fetch(
    `https://api.scryfall.com/cards/named?exact=${randomKey}`
  );

  const card = await response.json();
  const cardImage = card.image_uris.border_crop;

  return (
    <div>
      <img
        className="h-96 w-96 object-contain"
        src={cardImage}
        alt="NO IMAGE"
      ></img>
    </div>
  );
}
