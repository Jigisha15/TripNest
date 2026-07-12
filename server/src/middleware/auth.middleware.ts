import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				success: false,
				message: "Authorization header missing",
			});
		}

		if (!authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Invalid token format",
			});
		}

		const token = authHeader.split(" ")[1];

		const payload = verifyToken(token);

		req.user = payload;

		next();
	} catch {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};