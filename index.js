const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3002;

// middleware
app.use(express.json());
app.use(cors());

// 8KddRYXCCXpj5fsm
// book-haven-server

const uri =
  "mongodb+srv://book-haven-server:8KddRYXCCXpj5fsm@cluster0.03r3dfs.mongodb.net/?appName=Cluster0";

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
