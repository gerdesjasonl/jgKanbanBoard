import { Router } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    // TODO: If the user exists and the password is correct, return a JWT token
    const { username, password } = req.body;
    try {
        // This searches for a user with the email provided
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid Username or Password' });
        }
        // This compares the password provided with the hashed password stored in the database
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(401).json({ message: 'Invalid Username of Password' });
        }
        // This finally creates the JWT token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not defined' });
        }
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error' });
    }
    ;
    return;
};
const router = Router();
// POST /login - Login a user
router.post('/login', login);
export default router;
