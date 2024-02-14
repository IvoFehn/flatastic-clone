// pages/api/transactions/add.js
import dbConnect from "@/util/dbConnect";
import Transaction from "@/models/Transaction";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const { amount, description, paidBy, paidTo, space } = req.body;
      const transaction = await Transaction.create({
        amount,
        description,
        paidBy,
        paidTo,
        space,
      });
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
