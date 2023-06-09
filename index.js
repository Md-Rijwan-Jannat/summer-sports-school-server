const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fiopcal.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

  const classesCollection = client.db('summer-school').collection('classes')
  const usersCollection = client.db('summer-school').collection('users')
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // classes apis
    app.get('/classes', async (req, res) => {
      const result = await classesCollection
        .find()
        .sort({ students: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    })


    app.get('/allClasses', async (req, res) => {
      const result = await classesCollection
        .find()
        .sort({ students: -1 })
        .toArray();
      res.send(result);
    })


    // users apis
    app.get('/allUsers', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })


    app.patch('/user/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateAdmin = {
        $set: {
          role: 'admin'
        }
      }
      const result = await usersCollection.updateOne(filter, updateAdmin);
      res.send(result);
    })
    app.patch('/user/instructor/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateInstructor = {
        $set: {
          role: 'instructor'
        }
      }
      const result = await usersCollection.updateOne(filter, updateInstructor);
      res.send(result);
    })


    app.patch('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send('User Already exist')
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })


    app.get('/users/instructor', async (req, res) => {
      const query = { role: 'instructor' }
      const result = await usersCollection
        .find(query)
        .toArray();
      res.send(result);
    })


    app.get('/users/popular/instructor', async (req, res) => {
      const query = { role: 'instructor' }
      const result = await usersCollection
        .find(query)
        .limit(6)
        .toArray();
      res.send(result);
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


app.get('/', (req, res) => {
  res.send('summer school is running')
});


app.listen(port, () => {
  console.log(`summer school port is ${port}`);
})