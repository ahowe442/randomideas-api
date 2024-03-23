const express = require('express');
const dotenv = require('dotenv');
//require('dotenv').config();
dotenv.config();
const port = process.env.PORT || 5001;
const connectDB = require('./config/db');

connectDB();
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RandomIdeas API' });
});

//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//This is where it will get the ideas data.
const ideasRouter = require('./routes/ideas');

//Middleware (pass in the endpoint, where you want it to go)
app.use('/api/ideas', ideasRouter);

app.listen(port, () =>
  console.log(`Server listening on ${port}`)
);
