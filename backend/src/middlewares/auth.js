import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyJwt = (req, res, next) => {
    console.log(req.headers)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.sendStatus(403);
    }
};