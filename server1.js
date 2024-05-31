const express = require('express')

const app = express()

app.use(express.json())
app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
})

const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect('mongodb+srv://abdubash04:Family01234@cluster0.datjqek.mongodb.net/', (err, Client)=>{
    db = Client.db('webstore');
})          
app.use((req, res, next) => {
    var log = `${req.ip} -- ${req.method} ${req.path} ${res.statusCode}"`;
    console.log(log, req.body);
    next();
  });
  
  app.get("/", (req, res) => {
    // db.collection('lessons').updateMany({}, { $set: { avaliability: 5 } });
    res.send("Select a collection, e.g., /collection/products");
  });
  
  // retrieve all the object from an collection
  app.get("/collection/:collectionName", (req, res) => {
    try {
      db.collection(req.params.collectionName)
        .find({})
        .toArray()
        .then((results) => {
          res.send(results);
        });
    } catch (error) {
      console.log(error);
    }
  });
  
  // Search
  app.post("/search/collection/products/", (req, res) => {
    try {
      var search = req.body.search;
      var sort = req.body.sort || "title";
      var order = req.body.order == "desc" ? -1 : 1;
  
      if (search) {
        search = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        };
      } else {
        search = {};
      }
  
      db.collection("products")
        .find(search)
        .sort({ [sort]: order })
        .toArray()
        .then((results) => {
          res.send(results);
        });
    } catch (error) {
      console.log(error);
    }
  });
  
  //to insert a document to the collection
  app.post("/collection/:collectionName", (req, res) => {
    try {
      db.collection(req.params.collectionName)
        .insertOne(req.body)
        .then((results) => {
          res.send(results);
        });
    } catch (error) {
      console.log(error);
    }
  });
  
  app.get("/collection/:collectionName/:id", (req, res) => {
    try {
      db.collection(req.params.collectionName)
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((results) => {
          res.send(results);
        });
    } catch (error) {
      console.log(error);
    }
  });
  
  //to update a document by ID
  app.put("/collection/:collectionName/:id", (req, res) => {
    try {
      db.collection(req.params.collectionName)
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
        .then((results) => {
          res.send(results);
        });
    } catch (error) {
      console.log(error);
    }
  });
  
  app.delete("/collection/:collectionName/:id", (req, res) => {
    try {
      db.collection(req.params.collectionName)
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((results) => {
          res.send(results);
        });
    } catch (error) {
      console.log(error);
    }
  });
  
//   app.listen(3000, () => {
//     console.log("Express.js server running at PORT 3000");
//   });