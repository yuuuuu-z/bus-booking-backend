import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BAKONG_ACCESS_TOKEN;
if (!token) {
    console.log("No token found");
} else {
    try {
        const decoded = jwt.decode(token);
        console.log(JSON.stringify(decoded, null, 2));
    } catch (e) {
        console.error("Error decoding token:", e.message);
    }
}
