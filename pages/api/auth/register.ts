// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/util/dbConnect";

interface Data {
  message: string;
  user?: object;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, password } = req.body;

  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Ein Benutzer mit dieser E-Mail existiert bereits." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Benutzer erfolgreich erstellt", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Registrierung fehlgeschlagen",
        error: error.message,
      });
    } else {
      res
        .status(500)
        .json({ message: "Ein unbekannter Fehler ist aufgetreten" });
    }
  }
}
