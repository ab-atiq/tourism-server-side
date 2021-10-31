const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// midleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwz2c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('Database connected successfully');
        const database = client.db('tourismPlace');
        const placeCollection = database.collection('places');
        const accommodationCollection = database.collection('accommodation');

        //GET API
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({})
            const places = await cursor.toArray();
            res.json(places);
        })
        //GET API
        app.get('/accommodations', async (req, res) => {
            const cursor = accommodationCollection.find({})
            const accommodations = await cursor.toArray();
            res.json(accommodations);
        })

        // POST places 
        app.post('/places', async (req, res) => {
            const place = req.body;
            // console.log('Hit the post API.', place);
            const result = await placeCollection.insertOne(place);
            // console.log(result);
            res.json(result);
        })


    }
    finally {
        // await client.connect();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism assignment server is running');
});

app.listen(port, () => {
    console.log("Server is running port", port);
})