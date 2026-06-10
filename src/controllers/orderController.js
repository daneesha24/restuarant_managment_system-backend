const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

const createOrder = async (req, res) => {
  try {
    const { tableId, reservationId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Calculate total amount based on actual menu item prices
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item ${menuItem.name} is currently unavailable` });
      }

      const price = menuItem.price;
      const quantity = item.quantity;
      totalAmount += price * quantity;

      orderItems.push({
        menuItem: menuItem._id,
        quantity,
        price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      table: tableId || null,
      reservation: reservationId || null,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("table", "tableNumber")
      .populate("items.menuItem", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("table", "tableNumber")
      .populate("items.menuItem", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["pending", "preparing", "ready", "served", "paid"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
};
