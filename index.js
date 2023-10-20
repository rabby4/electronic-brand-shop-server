const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// MondoDB URI
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.v07t2jx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('brandShop').collection("allProduct");
    const cartCollection = client.db('brandShop').collection('cartProduct')

    // post product on database
    app.post('/products', async(req, res)=>{
      const newProduct = req.body;
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    // get all products
    app.get('/products', async(req, res)=>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // get updated product
    app.get('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    // put updated product
    app.put('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateProduct = req.body;
      const product ={
        $set: {
          title: updateProduct.title,
          brand: updateProduct.brand,
          category: updateProduct.category,
          photo: updateProduct.photo,
          price: updateProduct.price,
          ratting: updateProduct.ratting,

        }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)
    })

    // post product on cart database
    app.post('/cart', async(req, res)=>{
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart)
      res.send(result)
    })

    // get cart data
    app.get('/cart', async(req, res)=>{
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('brand shop server is running')
})
app.listen(port, ()=>{
    console.log(`brand shop server is running on ${port}`)
})