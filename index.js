// require('dotenv').config();
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const Port = process.env.PORT;
// const session = require('express-session');
// const passport = require('passport');
// const passportLocalmongoose = require('passport-local-mongoose');
// const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.SECRET;
// const cookieParser = require('cookie-parser');
// const bcrypt = require('bcrypt');
// const salt = bcrypt.genSaltSync(5);
// const authenticateJWT = require("./middleware/authenticateJWT");


// app.use(express.json());

// app.use(bodyParser.urlencoded({extended: true}));

// app.use(cors({
//   origin: true, // Allow all origins
//   credentials: true // Allow credentials if needed
// }));

// app.use(cookieParser());

// require("./db/connect");

// const Client = require('./models/clientDB');
// const Reservation = require('./models/reservationDB');

// app.post('/api/register',async (req,res)=>{
//     const {username} = req.body;
//     const {password} = req.body;
//     try{
//         const userExist = await Client.findOne({username:username}) ;
//         if(userExist){
//             return res.status(422).json({error:"email already exist"});
//         }else{
//             const client = new Client({
//                 username: username,
//                 password: bcrypt.hashSync(password,salt)
//             })
//             await client.save();
//             res.json(client);
//         }

//     }catch(e){
//         console.log(e)
//     }
    
// })

// app.post('/api/login',async (req,res)=>{
//     const {username,password} = req.body;
 

//     try{
//         const clientExist = await Client.findOne({username});
//         if(clientExist){
//            const passOk = bcrypt.compareSync(password, clientExist.password);
//            if(passOk){
//             jwt.sign({
//                 id: clientExist._id,
//                 username: clientExist.username,
//                 password: clientExist.password,
//             },jwtSecret,{},(err,token)=>{
//                 if(err) throw err;
//                 res.cookie('token', token).json(clientExist);
//             })
//            }else{
//             res.json({message:"incorrect password"})
//            }
//         }else{
//             res.json({message:"user not found"})
//         }
//     }catch(e){
//         console.log(e)
//     }
// })


// app.get('/api/verify',(req,res)=>{
//     const {token} = req.cookies;

//         if(token)
//             {jwt.verify(token, jwtSecret, {}, async (err, clientData)=>{
//             if(err) throw err;
//             const client = await Client.findById(clientData.id);
//             if(!client){
//                 res.json({message:"no user"})
//             }else{
//                 const {username,_id,password} = client;
//                 res.json({username,_id,password})
//             }
//         })}else{
//             res.json(null)
//         }
// })

// app.post('/api/reservation', authenticateJWT, async(req,res)=>{
//     const {carType, pickPlace, dropPlace, pickDate, dropDate, pickTime,dropTime ,firstname,lastname ,age ,phone,email,address,city,zipcode} = req.body;
//     const clientId = req.user.id;
//     try{
//         const reservation = new Reservation({
//             owner: clientId,
//             firstname: firstname,
//             lastname: lastname,
//             age: age,
//             phone: phone,
//             email: email,
//             address: address,
//             city: city,
//             zipcode: zipcode,
//             carType: carType, 
//             pickPlace: pickPlace, 
//             dropPlace: dropPlace, 
//             pickDate: pickDate, 
//             dropDate: dropDate, 
//             pickTime: pickTime,
//             dropTime : dropTime
//         })
//         await reservation.save();
//         res.json(reservation)
//     }catch(error){
//         console.log(error)
//         res.json(error)
//     }
// })

// app.get('/api/bookings',authenticateJWT, async (req,res)=>{
//    const userId = req.user.id;
//     try{
//         const reservation = await Reservation.find({owner: userId});
//         if(reservation){
//             res.json(reservation)
//         }else{
//             res.json(null)
//         }
//     }catch(e){
//         res.json(e)
//     }
// })

// app.post('/api/cancel', async (req,res)=>{
//     const {bookingId} = req.body;
//     try{
//         const reservation = await Reservation.findOneAndDelete({_id: bookingId})
//         if(reservation){
//             res.json('deleted')
//         }
//         else{
//             res.json('couldnt delete at this stage')
//         }
//     }catch(e){
//         res.json(e)
//     }
// })

// app.post('/api/logout', (req,res)=>{
//     res.cookie('token','').json(true);
// })

// app.listen(Port, ()=>{
//     console.log("app started...")
// })


require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const authenticateJWT = require("./middleware/authenticateJWT");

const salt = bcrypt.genSaltSync(5);
const Port = process.env.PORT || 5000;
const jwtSecret = process.env.SECRET;

// DB connection
require("./db/connect");

// Models
const Client = require('./models/clientDB');
const Reservation = require('./models/reservationDB');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Correct CORS config
app.use(cors({
  origin: 'https://car-rentel-web.vercel.app',
  credentials: true
}));

// Routes

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExist = await Client.findOne({ username });
    if (userExist) {
      return res.status(422).json({ error: "email already exists" });
    }
    const client = new Client({
      username,
      password: bcrypt.hashSync(password, salt)
    });
    await client.save();
    res.json(client);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const clientExist = await Client.findOne({ username });
    if (clientExist) {
      const passOk = bcrypt.compareSync(password, clientExist.password);
      if (passOk) {
        jwt.sign({
          id: clientExist._id,
          username: clientExist.username,
        }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          // ✅ Set cookie securely for cross-site access
          res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
          }).json(clientExist);
        });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/verify', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, clientData) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      const client = await Client.findById(clientData.id);
      if (!client) return res.status(404).json({ message: "No user" });

      const { username, _id } = client;
      res.json({ username, _id });
    });
  } else {
    res.json(null);
  }
});

app.post('/api/reservation', authenticateJWT, async (req, res) => {
  const { carType, pickPlace, dropPlace, pickDate, dropDate, pickTime, dropTime, firstname, lastname, age, phone, email, address, city, zipcode } = req.body;
  const clientId = req.user.id;

  try {
    const reservation = new Reservation({
      owner: clientId,
      firstname,
      lastname,
      age,
      phone,
      email,
      address,
      city,
      zipcode,
      carType,
      pickPlace,
      dropPlace,
      pickDate,
      dropDate,
      pickTime,
      dropTime
    });
    await reservation.save();
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.get('/api/bookings', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const reservations = await Reservation.find({ owner: userId });
    res.json(reservations || []);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.post('/api/cancel', async (req, res) => {
  const { bookingId } = req.body;
  try {
    const reservation = await Reservation.findOneAndDelete({ _id: bookingId });
    if (reservation) {
      res.json('deleted');
    } else {
      res.json('couldn’t delete at this stage');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.post('/api/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  }).json(true);
});

app.listen(Port, () => {
  console.log(`App started on port ${Port}...`);
});