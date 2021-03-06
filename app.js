const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const http = require('http');
const https = require('https');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require("constants");
require('dotenv').config();
var omise = require('omise')({
    'publicKey': process.env.OMISE_PUBLIC_KEY,
    'secretKey': process.env.OMISE_SECRET_KEY,
  });
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.post('/api-checkout-credit-card',async (req,res,next) => {
  console.log(req.body)  
  res.header("Access-Control-Allow-Origin", "*");
  const {name,amount,token} = req.body ;
   
try {
    const customer = await omise.customers.create({
        name,
        description : 'test',
        card : token,
    });
     const charge = await omise.charges.create({
            amount ,
            currency : 'thb',
            customer : customer.id,
     });
     console.log("Charge ---> ", charge) ;
     res.send({
        amount : charge.amount,
        status : charge.status,
        paidAt : charge.paid_at
     })
} catch (error) {
    console.log(error);
}

next()

})


const PORT = process.env.PORT || 443;

http.createServer(app).listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
