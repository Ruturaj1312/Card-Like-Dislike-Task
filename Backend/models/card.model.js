import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true, trim: true },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Card", cardSchema);
