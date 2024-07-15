const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const Bookings = require("./Bookings");
const User = require("./Users");

const app = express();
const PORT = 3000;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
    `smtps://${process.env.APP_MAIL}:${process.env.APP_PASSWORD}@smtp.gmail.com`
);  

async function send(to_mail, main_message, to_name, subject) {
    const mailOptions = {
        from: `'${process.env.FROM_NAME}' <${process.env.APP_MAIL}>`,
        to: to_mail,
        subject: to_name+"\n"+main_message,
        text: subject
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            console.log("Failed to send Mail");
            return false;
        } 
        console.log("Mail Sent");
        return true;
    });
}

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { name, email, password, department } = req.body;
  User.create({ id: email, name, email, password, department })
    .then(async (user) => {
        await send(email, "Registeration Successful for the Application", name, "registeration email");
        res.status(201).json({
            message: "User registered",
            userId: user.email,
            department: user.department,
            name: user.name,
          });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/signin", (req, res) => {
  const { email, password, department } = req.body;
  User.login(email, password)
    .then((user) => {
      console.log("Sign-in successful for user:", user);
      res.status(200).json({
        message: "Sign-in successful",
        userId: user.email,
        department: user.department,
        name: user.name,
      });
    })
    .catch((err) => {
      console.log("Invalid credentials for email:", email);
      res.status(401).send("Invalid credentials");
    });
});

app.post("/book", (req, res) => {
  const {
    userId,
    auditorium,
    date,
    slot,
    title,
    start,
    end,
    name,
    amenities,
    eventname,
  } = req.body;

  console.log("Received booking request for userId:", userId);

  // Check if the user exists
  User.find({ id: userId }).then((result) => {
    console.log(result.length);
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    Bookings.find({
      auditorium: auditorium,
      date: date,
      slot: slot,
      status: "approved",
    })
      .then((output) => {
        console.log(output.length);
        if (output.length === 0) {
          Bookings.create({
            id: userId + date + auditorium + slot,
            userId,
            auditorium,
            date,
            slot,
            title,
            name,
            start,
            end,
            status: "approved",
            department: result[0].department,
            amenities: amenities,
            eventname: eventname,
          })
            .then(async (resultNew) => {
                await send(userId, "Approved Booking", name, "Booking");
              res.status(201).json({ message: "Booking confirmed", resultNew });
            })
            .catch((err) => {
                console.log(err);
              res.status(500).json({ message: "Error" });
            });
        } else {
          Bookings.create({
            id: userId + date + auditorium + slot,
            userId,
            auditorium,
            date,
            slot,
            title,
            name,
            start,
            end,
            status: "pending",
            department: result[0].department,
            amenities: amenities,
            eventname: eventname,
          })
            .then(async (resultNew) => {
                await send(userId, "Approved Pending", name, "Booking pending");
              res.status(201).json({
                message: "Booking request received and pending approval",
                resultNew,
              });
            })
            .catch((err) => {
              res.status(500).json({ message: "Error" });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Internal server error" });
      });
  });
});

app.get("/requests", async (req, res) => {
  const pendingBookings = await Bookings.find({status: "pending"});
  res.status(200).json(pendingBookings);
});

app.post("/approve", async (req, res) => {
  const { id } = req.body;
  const booking = await Bookings.findOne({id: id});
  console.log(booking);
  if (booking) {
    booking.status = "approved";
    res.status(200).send("Booking approved");
  } else {
    res.status(404).send("Booking not found");
  }
});

app.post("/reject", (req, res) => {
  const { id } = req.body;
  const booking = Bookings.find({id: id});
  if (booking) {
    booking.status = "rejected";
    res.status(200).send("Booking rejected");
  } else {
    res.status(404).send("Booking not found");
  }
});

app.get("/bookings", async (req, res) => {
  console.log("All bookings");
  const bookings = await Bookings.find();
  res.status(200).json(bookings);
});
app.get("/bookings/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userBookings = await Bookings.find({userId: userId});
  console.log("Single bookings");
  console.log(userBookings);
  res.status(200).json(userBookings);
});

app.post("/cancel", (req, res) => {
  const { userId, auditorium, date, slot } = req.body;
  console.log(date);

  var bookingId = userId + date + auditorium + slot;
  console.log(bookingId);
  const booking = Bookings.findOne({id: bookingId});
  Bookings.deleteOne({id: bookingId}).then(async result => {
    console.log(result);
    await send(userId, "Booking cancelled", booking.name, "Booking cancelled");
    res.status(200).json({message: "Booking cancelled"});
  }).catch(err => {
    res.status(404).json({
        message:
          "Booking not found or you do not have permission to cancel this booking",
      });
  })
});
// Get all bookings
app.get("/admin/bookings", async (req, res) => {
    const bookings = await Bookings.find({});
  res.status(200).json(bookings);
});

// Approve booking
app.post("/admin/approve", (req, res) => {
  const { id } = req.body;
  const booking = Bookings.findOne({id: id});
//   const booking = bookings.find((b) => b.id === id);
  if (booking) {
    Bookings.updateOne({id: id}, {status: "approved"}).then(result => {
        console.log(result);
        res.status(200).json({ message: "Booking approved" });
    }).catch(err => {
        res.status(500).json({ message: "Internal server error" });
    });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

// Cancel booking
app.post("/admin/cancel", (req, res) => {
  const { id } = req.body;
  const booking = Bookings.findOne({id: id});
  if (booking) {
    Bookings.deleteOne({id: id}).then(result => {
        console.log(result);
        res.status(200).json({ message: "Booking cancelled" });
    }).catch(err => {
        res.status(500).json({ message: "Internal server error" });
    });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

try {
    mongoose
      .connect(
        "mongodb+srv://pooannamalai09:poo@cluster0.dx0y53s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      )
      .then((result) => {
        console.log("DB Connected Sucessfully");
        app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
      });
  } catch (err) {
    console.log(err);
  }