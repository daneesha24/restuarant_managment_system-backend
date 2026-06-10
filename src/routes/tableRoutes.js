const express = require("express");
const router = express.Router();
const {
  addTable,
  getTables,
  updateTable,
  updateTableStatus,
} = require("../controllers/tableController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// View tables (Waiters, Admin, Cashier)
// Customers might also need to view available tables for reservation
router.get("/", getTables);

// Admin only routes
router.post("/", protect, authorizeRoles("admin"), addTable);
router.put("/:id", protect, authorizeRoles("admin"), updateTable);

// Update status (Admin, Waiter)
router.patch("/:id/status", protect, authorizeRoles("admin", "waiter", "cashier"), updateTableStatus);

module.exports = router;
