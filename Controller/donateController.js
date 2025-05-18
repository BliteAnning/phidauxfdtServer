import DonateModel from "../Model/donate.js";
import https from 'https';


const frontend_url = process.env.FRONTEND_URL;


const donateNow = async (req, res) => {
  try {
    const { name, email, message, amount } = req.body;

    // Validate the request body
    if (!name || !email || !amount ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new donation record
    const newDonation = new DonateModel({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      amount: req.body.amount,
      date: new Date(),
     
    });

    // Save the donation record to the database
    await newDonation.save();



    //handling payment with stripe
    

    const params = JSON.stringify({
      "email": req.body.email,
      "amount": req.body.amount * 100,
      "currency": "GHS",
    })

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    }

    const reqpaystack = https.request(options, respaystack => {
      let data = ''

      respaystack.on('data', (chunk) => {
        data += chunk
      });

      respaystack.on('end', () => {
        const paystackResponse = JSON.parse(data);
  // Send only the authorization_url to the frontend
        res.json({ authorization_url: paystackResponse.data.authorization_url });
        console.log(JSON.parse(data))
      })
    }).on('error', error => {
      console.error(error)
    })

    reqpaystack.write(params)
    reqpaystack.end()
  



  } catch (error) {
    console.log("Error processing donation:", error);
  }
}

export default donateNow;