// pages/api/spaces/addMember.js
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
      const { spaceId, userId } = req.body;
      const space = await Space.findById(spaceId);
      if (!space.members.includes(userId)) {
        space.members.push(userId);
        await space.save();
        res.status(200).json(space);
      } else {
        res
          .status(400)
          .json({ success: false, error: "User already a member" });
      }
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
