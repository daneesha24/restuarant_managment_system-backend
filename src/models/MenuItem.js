const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
