import { readFile } from "fs/promises";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = "4b88e72faee7a16a";

interface User {
  id: String;
  name: String;
  email: String;
  role: String;
  password: String;
}

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const data = await readFile("../../../data/staffs.json", "utf-8");
    const users = JSON.parse(data);
    const user = users.find(
      (user: User) => user.email === email && user.password === password
    );
    if (user) {
      const payload = { ...user };

      const token = jwt.sign(payload, secretKey, { expiresIn: "7h" });

      res.cookie("authToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 7,
      });
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
