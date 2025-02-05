import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from "next";

interface Cache{
    [key: string]: string;
}
export const cache: Cache = {};
export default async function handler(req : NextApiRequest, res: NextApiResponse){
   
    if(req.method === "GET"){
        try{
            const filePath = path.join(process.cwd(), 'public', 'results.json');
            const file = await fs.readFile(filePath, 'utf8');
            const data = JSON.parse(file);
            const keys = Object.keys(data);
    
            let randomKey = keys[Math.floor(Math.random() * keys.length)];
    
            while (cache[randomKey]) {
                randomKey = keys[Math.floor(Math.random() * keys.length)];
            }
            
            const response = await fetch(`https://api.scryfall.com/cards/named?exact=${randomKey}`);
            const card = await response.json();
    
            if(card.image_uris.border_crop){
                cache[randomKey] = `https://api.scryfall.com/cards/named?exact=${randomKey}`;
                res.status(200).json({
                    name: randomKey,
                    imageUrl: card.image_uris.border_crop,
                    cardSalt: data[randomKey]
                });
            }else if(card.image_uris.png){
                cache[randomKey] = `https://api.scryfall.com/cards/named?exact=${randomKey}`;
                res.status(200).json({
                    name: randomKey,
                    imageUrl: card.image_uris.png,
                    cardSalt: data[randomKey]
                });
            }
            else{
                res.status(404).json({message: "Card not found"})
            }
        }catch(error){
            console.error(error);
            res.status(500).json({message:"Internal Server Error"})
        }

    }

    
}