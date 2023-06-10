const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' });
  }
  // bearer token
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'unauthorized access' })
    }
    req.decoded = decoded;
    next();
  })
}



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
  const feedbackCollection = client.db('summer-school').collection('feedback')
  const addToClassCollection = client.db('summer-school').collection('addToClass')
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


    app.post('/addClass', async (req, res) => {
      const newClass = req.body;
      const result = await classesCollection.insertOne(newClass);
      res.send(result);

    })

    app.patch('/classApprove/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateAdmin = {
        $set: {
          status: 'approved'
        }
      }
      const result = await classesCollection.updateOne(filter, updateAdmin);
      res.send(result);
    })


    app.patch('/classDenied/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateAdmin = {
        $set: {
          status: 'denied'
        }
      }
      const result = await classesCollection.updateOne(filter, updateAdmin);
      res.send(result);
    })


    app.get('/allClasses', async (req, res) => {
      const result = await classesCollection
        .find()
        .sort({ students: -1, _id: -1 })
        .toArray();
      res.send(result);
    })


    app.get('/allClasses/approved', async (req, res) => {
      const approved = { status: 'approved' };
      const result = await classesCollection
        .find(approved)
        .sort({ students: -1 })
        .toArray();
      res.send(result);
    })


    // student or user apis
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


    app.delete('/users/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })


    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send('User Already exist')
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })


    app.post('/student/addToClass', async (req, res) => {
      const studentAddedClass = req.body;
      const result = await addToClassCollection.insertOne(studentAddedClass);
      res.send(result)
    })

    app.get('/addedClass', async (req, res) => {
      const email = req.query.email;
      const filter = { studentEmail: email }
      const result = await addToClassCollection.findOne(filter);
      res.send(result);
    })


    // instructor apis
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


    app.get('/my_classes/:email', async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollection.find(query).toArray();
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


    // admin apis
    app.post('/feedback', async (req, res) => {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.send(result);
    })

    app.get('/feedback_for_instructor/:id', async (req, res) => {
      const id = req.params.id;
      const query = { class_id: id };
      const result = await feedbackCollection.find(query).toArray();
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