const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9rwg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emmajohn").collection("products");
  const orders = client.db("emmajohn").collection("orders");
  
    app.post("/addProduct", (req,res) => {
        const newProd = req.body;
        products.insertMany(newProd)
    })

    app.get("/products", (req,res) => {
        products.find({}).limit(20)
        .toArray((err,doc) => {
            res.send(doc);
        })
    })

    app.get("/products/:key", (req,res) => {
        products.find({key: req.params.key})
        .toArray((err,doc) => {
            res.send(doc[0]);
        })
    })
    app.post("/review", (req,res) => {
        const keys = req.body;
        products.find({key: {$in: keys}})
        .toArray((err,doc) => {
            res.send(doc);
        })

    })
    app.post("/addOrders", (req,res) => {
        const newOrder = req.body;
        orders.insertOne(newOrder)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

});


app.listen(process.env.PORT || port)