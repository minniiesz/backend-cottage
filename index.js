const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
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


const PORT = process.env.PORT || 80;
var server = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("server is listening at http://%s:%s", host, port);
});