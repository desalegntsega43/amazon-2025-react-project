const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// --- SECRET KEY DISPLAY & VERIFICATION ---
const secretKey = process.env.STRIPE_SECRET_KEY;

if (secretKey) {
  // Displays the first 7 characters and the last 4 to verify it's the right key
  console.log(`✅ Stripe Secret Key detected: ${secretKey.substring(0, 7)}...${secretKey.slice(-4)}`);
} else {
  console.error("❌ ERROR: STRIPE_SECRET_KEY is not defined in your .env file.");
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.post("/payments/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total, // amount in cents (e.g., $10.00 is 1000)
        currency: "usd",
      });
      
      console.log("Payment Intent created:", paymentIntent.id);
      
      // Send the client secret back to the frontend
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Stripe Error:", error.message);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Amazon Server running on: http://localhost:${PORT}`);
});