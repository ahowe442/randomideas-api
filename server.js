const express = require('express');
const port = 5001;

const app = express();

const ideas = [
  {
    id: 1,
    text: 'Positive Newsletter, a newsletter that only shares positive, uplifting news',
    tag: 'technology',
    username: 'TonyStark',
    date: '2022-01-02',
  },
  {
    id: 2,
    text: 'Milk cartons that change color the older the milk is.',
    tag: 'inventions',
    username: 'Genius',
    date: '2022-01-02',
  },
  {
    id: 3,
    text: 'Basketball Bracket App - Helps you create a NCAA bracket',
    tag: 'technology',
    username: 'TonyStark',
    date: '2024-21-03',
  },
  {
    id: 4,
    text: 'EduJot - Action oriented notes for building principals',
    tag: 'technology',
    username: 'TonyStark',
    date: '2024-15-02',
  },
];
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RandomIdeas API' });
});

//Get all ideas
app.get('/api/ideas', (req, res) => {
  res.json({ success: true, data: ideas });
});
app.get('/api/ideas/:id', (req, res) => {
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  if (!idea) {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }
  res.json({ success: true, data: idea });
});

app.listen(port, () =>
  console.log(`Server listening on ${port}`)
);
