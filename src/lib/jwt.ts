import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export function  signJwt(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyJwt(token: string): null | jwt.JwtPayload {
    try {
        return jwt.verify(token, SECRET) as jwt.JwtPayload
    } catch (err) {
        console.error('❌ Invalid JWT:', err)
        return null
    }
}