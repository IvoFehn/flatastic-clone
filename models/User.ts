import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Bitte geben Sie eine E-Mail an"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Bitte geben Sie ein Passwort an"],
    },
    username: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
