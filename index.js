const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// midleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwz2c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('Database connected successfully');
        const database = client.db('tourismPlace');
        const placeCollection = database.collection('places');
        const accommodationCollection = database.collection('accommodation');
        const serviceCollection = database.collection('services');
        // const buyerCollection=database.collection('buyers');
        const orderCollection = database.collection('orders');

        //GET API
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.json(places);
        })

        //GET API
        app.get('/accommodations', async (req, res) => {
            const cursor = accommodationCollection.find({});
            const accommodations = await cursor.toArray();
            res.json(accommodations);
        })

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        // POST places 
        app.post('/places', async (req, res) => {
            const place = req.body;
            const result = await placeCollection.insertOne(place);
            res.json(result);
        })

        // POST buyers
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        //GET API
        app.get('/orders', async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = { email: email };
            }
            const cursor = orderCollection.find(query);
            const services = await cursor.toArray();
            res.json(services);
        })

        // DELETE API 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
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