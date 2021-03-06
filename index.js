const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middle ware 
app.use(cors())
app.use(express.json());

//connecting database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a2vjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



async function run() {
    try {
      await client.connect();
      const database = client.db("infinity_tour");
      const tourCollection = database.collection("tour_collection");
      const bookingCollection = database.collection("booking_collection");
  
      // Default GET API for Checking server 
      app.get('/',(req,res)=>{
        res.send('Infinity tour Sever is running ')
      })
      
    // GET API
    // GETTING ALL TOURS DESTINATION
    app.get("/tours", async (req, res) => {
        const cursor = tourCollection.find({});
        const result = await cursor.toArray();
        res.json(result);
      });

      
    // POST API
    //  FOR NEW TOUR   
    app.post ('/tours',async(req,res)=>{
        const tour = req.body;
        const doc = {
          img:tour.img,
          title:tour.title,
          describe:tour.describe,
          price:tour.price
        }
        const result = await tourCollection.insertOne(doc);
  
        res.send(result)
      })

       //GET API
       //GETTING ONE TOUR DESTINATION FROM ALL TOURS DESTINATION 
    
    app.get('/travelbooking/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await tourCollection.findOne(query);
        res.json(result)
    })


    // POST API 
    //FOR BOOKING 
    app.post('/booking', async(req,res)=>{
        const booking = req.body;
        const doc = {
          name:booking.name,
          email:booking.email,
          title:booking.title,
          date:booking.date,
          address:booking.address
        }
        const result = await bookingCollection.insertOne(doc);
        res.json(result)
      })

      
    //GET API
    // ALL BOOKING
    app.get('/allbooking', async(req,res)=>{
        const cursor = bookingCollection.find({});
        const result = await cursor.toArray();
        res.json(result);
      })

      //DELETE API
       // ALL BOOKING ONE ITEM DELETE API
    app.delete('/allbooking/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await bookingCollection.deleteOne(query)
        res.json(result)
      })

      // GET API
      // MY BOOKING GET API
      app.get('/mybooking/:email',async(req,res)=>{
        const email = req.params.email
        const query = {email:email}
        const cursor =  bookingCollection.find(query);
        const result = await cursor.toArray();
        res.json(result);
  })

  //DELETE API
  //  MY BOOKING DELETE API
  app.delete('/mybooking/:email/:id',async(req,res)=>{
    const email = req.params.email;
    const id = req.params.id;
    const query = {email:email, _id:ObjectId(id)};
    const result = await bookingCollection.deleteOne(query);
    res.json(result);
  })
    
  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
  app.listen(port, () => {
    console.log("hitting the port", 5000);
  });
  