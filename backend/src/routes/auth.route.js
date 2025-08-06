import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { config } from 'dotenv';
config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = new User({ username })
        await user.setPassword(password);
        await user.save();
        res.status(201).json({ message: "User created" })

    } catch (err) {
        res.status(400).json({ error: "Username already taken" });
    }

});

router.post("/login", async (req, res) => {
    // console.log(JWT_SECRET)
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid Username" });
        }
        const pass = await user.verifyPassword(password)
        if (!pass) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: "12h" })

        res.status(200).json({ token: token, username })
    } catch (err) {
        res.status(400).json({ error: err })
    }
});

export default router;