import dbConnect from "@/util/dbConnect";
import Space from "@/models/Space";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const { name, createdBy } = req.body;
      const space = await Space.create({
        name,
        createdBy,
        members: [createdBy],
      });
      res.status(201).json(space);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
