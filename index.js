const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3002;

// middleware
app.use(express.json());
app.use(cors());


const uri =
  `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.03r3dfs.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a database for my project name the book haven
    const booksDB = client.db("booksDB");
    const booksColl = booksDB.collection("books");

    // create or add book
    app.post('/add-book', async(req,res)=>{
        const newBook=req.body
        const result=await booksColl.insertOne(newBook)
        res.send(result)
    })

   

    // get all books api 
    app.get('/all-books', async(req,res)=>{
        const cursor= booksColl.find()
        const result=await cursor.toArray()
        res.send(result)
    })

    // get my books api
    app.get('/my-books', async(req,res)=>{
        const email=req.query.email
        const query={}
        if(email){
            query.userEmail=email
        }
        const cursor= booksColl.find(query)
        const result=await cursor.toArray()
        res.send(result)
    })

    // update book api
    app.patch('/my-books/:id', async(req,res)=>{
        const id=req.params.id
        const updateBook=req.body
        const query={_id: new ObjectId(id)}
        const update={
            $set:{
                title:updateBook.title,
                author:updateBook.author,
                genre:updateBook.genre,
                rating:updateBook.rating,
                summary:updateBook.summary,
                coverImage:updateBook.coverImage
            }

        }
        const result=await booksColl.updateOne(query,update)
        res.send(result)
    })

    // delete book api
    app.delete('/delete-book/:id', async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await booksColl.deleteOne(query)
        res.send(result)
    })
    // Users can Update their own books (title, author, genre, rating, summary, coverImage
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
