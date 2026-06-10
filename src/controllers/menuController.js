const MenuItem = require("../models/MenuItem");

const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    let imageUrl = req.body.imageUrl || "";

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      isAvailable,
      imageUrl,
    });

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenu = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    // Customers might only see available items, but let's return all by default
    // or we could filter by isAvailable based on user role, but for now we'll just return all
    // and let frontend handle it or allow specific query param
    if (req.query.available === "true") {
      query.isAvailable = true;
    }

    const menu = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (isAvailable === undefined) {
      return res.status(400).json({ message: "isAvailable status is required" });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item status updated",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMenuItem,
  getMenu,
  updateMenuItem,
  deleteMenuItem,
  updateItemStatus,
};
