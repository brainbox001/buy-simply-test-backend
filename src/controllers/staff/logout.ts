import { Request, Response } from "express";

export default async function logout(req: Request, res: Response) {
  try {
    const cookies = req.cookies;

    if (cookies["authToken"])
      res.cookie("authToken", "", {
        expires: new Date(0),
      });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
