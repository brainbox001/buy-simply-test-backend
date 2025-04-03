import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";

const secretKey = "4b88e72faee7a16a";

interface User {
  id: String;
  name: String;
  email: String;
  role: String;
  password: String;
}

export async function auth(req: Request, res: Response, next: NextFunction) : Promise<any> {
  const cookies = req.cookies;
  const token = cookies["authToken"];

  if (!token) return res.status(401).json({ error: "Unauthorized request!!" });
  let payload: any;
  try {
    payload = jwt.verify(token, secretKey);

    const data = await readFile("../../../data/staffs.json", "utf-8");
    const users = JSON.parse(data);
    const user: User = users.find(
      (user: User) =>
        user.email === payload.email && user.password === payload.password
    );
    if (!payload || !user)
      return res.status(401).json({ error: "Unauthorized request!!" });
    req.user = payload;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Internal server error" });
  }
}

export async function isSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<any> {
  const user = req.user;
  if (user.role !== "superAdmin") {
    return res.status(403).json({ error: "Forbidden Request" });
  }
  next();
}
