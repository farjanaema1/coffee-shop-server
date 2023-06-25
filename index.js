const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
 
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zapyzlw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run (){
    try{
        const productCollection = client.db('coffeeshop').collection('products')
        const orderCollection = client.db('coffeeshop').collection('orders')
        app.get('/products',async(req,res) => {
            const query = {};
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
           
            const cursor = productCollection.find(query);
            const products = await cursor.skip( page * size ).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();

            res.send({count,products});

        });
        app.get('/orders',async( req,res) => {
            const query = {};
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        })
        app.post('/orders',async( req,res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        // app.delete('/products/:id',async( req,res) => {
        //     const id = req.params.id;
        //     const query = {_id: new ObjectId(id)};
        //     const result = await orderCollection.deleteOne(query);
        //     res.send(result);
        // })
        app.post ('productsByIds',async (req,res) => {
            const ids = req.body;
            const objectIds = ids.map( id => ObjectId(id));
            const query = { _id:{$in : objectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })


    }
    finally{

    }
}
run()



app.get('/',( req,res) => {
    res.send('coffee shop')
})
app.listen( port, () => {
    console.log(`coffee shop running on : ${port}`)
})