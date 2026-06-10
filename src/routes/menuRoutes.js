const express = require("express");
const router = express.Router();
const {
  addMenuItem,
  getMenu,
  updateMenuItem,
  deleteMenuItem,
  updateItemStatus,
} = require("../controllers/menuController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public route to view menu
router.get("/", getMenu);

// Admin only routes for managing menu
router.post("/", protect, authorizeRoles("admin"), upload.single("image"), addMenuItem);
router.put("/:id", protect, authorizeRoles("admin"), upload.single("image"), updateMenuItem);
router.delete("/:id", protect, authorizeRoles("admin"), deleteMenuItem);

// Admin and Manager(waiter/kitchen could possibly mark unavailable if out of stock) 
router.patch("/:id/status", protect, authorizeRoles("admin", "kitchen", "waiter"), updateItemStatus);

module.exports = router;
