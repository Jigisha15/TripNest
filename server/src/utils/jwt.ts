import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/jwt.interface";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = async (payload: JwtPayload) => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1d",
	});
};

export const verifyToken = (token: string): JwtPayload => {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
};