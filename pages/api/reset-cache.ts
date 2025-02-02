import { NextApiRequest, NextApiResponse } from 'next';
import {cache} from './fetch-card';


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'POST'){
        Object.keys(cache).forEach(key => {
            delete cache[key];
        });

        return res.status(200).json({message: "Cache has been reset."});
    }else{
        return res.status(405).json({message: "Method Not Allowed"});
    }
}