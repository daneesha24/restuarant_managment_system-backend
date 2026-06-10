const Table = require("../models/Table");

const addTable = async (req, res) => {
  try {
    const { tableNumber, capacity, status } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({ message: "Table number and capacity are required" });
    }

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: "Table number already exists" });
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      status: status || "available",
    });

    res.status(201).json({
      message: "Table added successfully",
      table,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTables = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.capacity) {
      query.capacity = { $gte: Number(req.query.capacity) };
    }

    const tables = await Table.find(query).sort({ tableNumber: 1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const table = await Table.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({
      message: "Table updated successfully",
      table,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["available", "reserved", "occupied"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const table = await Table.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({
      message: "Table status updated successfully",
      table,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTable,
  getTables,
  updateTable,
  updateTableStatus,
};
