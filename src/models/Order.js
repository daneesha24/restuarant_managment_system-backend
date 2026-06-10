const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
