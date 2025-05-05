import DonateModel from "../Model/donate.js";
import Stripe from "stripe";


const frontend_url = process.env.FRONTEND_URL;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const donateNow = async (req, res) => {
  try {
    const { name, email, message, amount, paymentMethod } = req.body;

    // Validate the request body
    if (!name || !email || !amount || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new donation record
    const newDonation = new DonateModel({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      amount: req.body.amount,
      date: new Date(),
      paymentMethod: req.body.paymentMethod,
    });

    // Save the donation record to the database
    await newDonation.save();

 

    //handling payment with stripe
    const session = await stripe.checkout.sessions.create({
        amount: amount * 100, // Amount in cents
        currency: "usd",
        payment_method_types: [paymentMethod],
        name: name,
        email: email,
        metadata: {
            donationId: newDonation._id.toString(), // Store the donation ID in metadata
        },
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&donationId=${newDonation._id}`,
        cancel_url: `${frontend_url}/verify?success=false&donationId=${newDonation._id}`
        });
    // Confirm the payment
        res.status(201).json({
            success: true,
            message: "Payment initiated",
            session_url: session.url, // Send the session ID to the client
        });
    


    
  } catch (error) {
    console.log("Error processing donation:", error);
  }
}

export default donateNow;