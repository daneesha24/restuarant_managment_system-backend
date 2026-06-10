const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservations,
  getMyReservations,
  updateReservationStatus,
} = require("../controllers/reservationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Customer routes
router.post("/", protect, createReservation);
router.get("/my-reservations", protect, getMyReservations);

// Admin / Waiter routes
router.get("/", protect, authorizeRoles("admin", "waiter", "cashier"), getReservations);

// Update status (Customer can cancel, Admin/Waiter can confirm/complete)
router.patch("/:id/status", protect, updateReservationStatus);

module.exports = router;
