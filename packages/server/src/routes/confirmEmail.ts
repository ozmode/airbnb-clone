import { Request, Response } from "express";

import { User } from "../entity/User";
import redis from "../utils/redis";

export const confirmEmail = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
        await User.update({ id: userId }, { confirmed: true });
        await redis.del(id);
        return res.send("Ok");
    } else {
        return res.status(400).send("Invalid code");
    }
};
