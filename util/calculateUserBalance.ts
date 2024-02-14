import mongoose from "mongoose";
import dbConnect from "./dbConnect";
import TransactionModel from "@/models/Transaction";
import SpaceModel from "@/models/Space";

interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
}

interface ITransaction {
  amount: number;
  description: string;
  paidBy: mongoose.Schema.Types.ObjectId;
  paidTo: mongoose.Schema.Types.ObjectId[];
}

interface ISpace {
  _id: mongoose.Schema.Types.ObjectId;
  transactions: ITransaction[];
}

interface Balance {
  balance: number;
}

async function calculateUserBalance(
  userId: string,
  spaceId: string
): Promise<Balance> {
  await dbConnect();

  // Finden Sie den spezifischen Raum und umgehen Sie die Typisierung nach `populate`
  const space = (await SpaceModel.findById(spaceId).populate(
    "transactions"
  )) as ISpace | null;

  let balance: number = 0;

  if (space && space.transactions) {
    space.transactions.forEach((transaction: ITransaction) => {
      const totalMembers = transaction.paidTo.length + 1; // Zahler mit einbeziehen
      const individualShare = transaction.amount / totalMembers;

      // Wenn der Benutzer der Zahler ist
      if (transaction.paidBy.toString() === userId) {
        balance += transaction.amount - individualShare;
      }

      // Wenn der Benutzer einer der Empfänger ist
      if (transaction.paidTo.some((id) => id.toString() === userId)) {
        balance -= individualShare;
      }
    });
  }

  return { balance };
}
