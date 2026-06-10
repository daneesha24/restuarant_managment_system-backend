const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Customer routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Staff routes (Kitchen, Waiter, Cashier, Admin)
router.get("/", protect, authorizeRoles("admin", "waiter", "kitchen", "cashier"), getOrders);
router.patch("/:id/status", protect, authorizeRoles("admin", "waiter", "kitchen", "cashier"), updateOrderStatus);

module.exports = router;
