const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

const createReservation = async (req, res) => {
  try {
    const { tableId, date, time, guests } = req.body;

    if (!tableId || !date || !time || !guests) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (guests > table.capacity) {
      return res.status(400).json({ message: `Table capacity is ${table.capacity}. Too many guests.` });
    }

    // Prevent double booking: check if reservation exists for this table on this date & time
    const reservationDate = new Date(date);
    const existingReservation = await Reservation.findOne({
      table: tableId,
      date: reservationDate,
      time: time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingReservation) {
      return res.status(400).json({ message: "Table is already booked for this date and time" });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table: tableId,
      date: reservationDate,
      time,
      guests,
      status: "pending", // default
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReservations = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.date) {
      query.date = new Date(req.query.date);
    }

    const reservations = await Reservation.find(query)
      .populate("user", "name email phone")
      .populate("table", "tableNumber capacity")
      .sort({ date: 1, time: 1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("table", "tableNumber capacity")
      .sort({ date: 1, time: 1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Customers can only cancel their own reservations
    if (req.user.role === "customer") {
      if (reservation.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this reservation" });
      }
      if (status !== "cancelled") {
        return res.status(403).json({ message: "Customers can only cancel reservations" });
      }
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({
      message: "Reservation status updated successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getMyReservations,
  updateReservationStatus,
};
