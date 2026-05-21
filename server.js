const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // allows frontend to call this API
app.use(express.json()); // reads JSON data from frontend

// ─── Email Transporter Setup ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
});

// ─── Contact Form API Route ────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

app.post('/send-email', async (req, res) => {
    const {name, email, phone, subject, message} = req.body;

    //validation
    if(!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, email and message are required."
        });
    }

    const mailOptions = {
        from: `"Environs Website" <${process.env.EMAIL}>`,
        replyTo: email, //reply goes to user's email
        to: "environs.wholly@gmail.com",
        subject: `New Contact: ${subject || "No Subject"}`,
        html: `
            <h2 style="color: #198754;">New Message from Environs Website</h2>
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="padding:8px; font-weight:bold;">Name</td>
                    <td style="padding:8px;">${name}</td>
                </tr>
                <tr style="background:#f2f2f2;">
                    <td style="padding:8px; font-weight:bold;">Email</td>
                    <td style="padding:8px;">${email}</td>
                </tr>
                <tr>
                    <td style="padding:8px; font-weight:bold;">Phone</td>
                    <td style="padding:8px;">${phone || "Not provided"}</td>
                </tr>
                <tr style="background:#f2f2f2;">
                    <td style="padding:8px; font-weight:bold;">Subject</td>
                    <td style="padding:8px;">${subject || "Not provided"}</td>
                </tr>
                <tr>
                    <td style="padding:8px; font-weight:bold;">Message</td>
                    <td style="padding:8px;">${message}</td>
                </tr>
            </table>
        `
    };

    try{
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true, 
            message: "Email sent successfully!"
        });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
