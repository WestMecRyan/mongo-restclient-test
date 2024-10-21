// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Client Setup
const client = new MongoClient(process.env.MONGODB_URI);


let collection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        const db = client.db(process.env.DATABASE_NAME);
        collection = db.collection(process.env.COLLECTION_NAME);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

// Routes

// Home Route
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Create (Insert) a Document
app.post('/insert', async (req, res) => {
    try {
        const document = req.body;
        // console.log(document);
        const result = await collection.insertOne(document);
        res.status(201).json({ insertedId: result.inseredId });
    } catch (error) {
        console.error('Insert error:', error);
        res.status(500).json({ error: 'Failed to insert document' });
    }
});

// Read (Find) All Documents
app.get('/find', async (req, res) => {
    try {
        const documents = await collection.find({}).toArray();
        res.status(200).json(documents);
    } catch (error) {
        console.error('Find error:', error);
        res.status(500).json({ error: 'Failed to retrieve documents' });
    }
});

// Update a Document
app.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update document' });
    }
});

// Delete a Document
app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
