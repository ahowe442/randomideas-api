const express = require('express');
const router = express.Router();

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
    text: 'Basketball Bracket App - Helps you create a NCAA bracket. Oriented for the casual user.',
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

//Get all ideas
router.get('/', (req, res) => {
  res.json({ success: true, data: ideas });
});

// Get single idea
router.get('/:id', (req, res) => {
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  // If not found return a 404 error message
  if (!idea) {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }
  // Share success message and return the idea
  res.json({ success: true, data: idea });
});

// Add an idea
router.post('/', (req, res) => {
  //Create the idea object
  const idea = {
    id: ideas.length + 1,
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
    date: new Date().toISOString().slice(0, 10),
  };
  //adds idea object to the array
  ideas.push(idea);

  // returns success message and the new idea
  res.json({ success: true, data: idea });
});

// Update idea
router.put('/:id', (req, res) => {
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  if (!idea) {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }
  //update or keep the body & tag.
  idea.text = req.body.text || idea.text;
  idea.tag = req.body.tag || idea.tag;

  res.json({ success: true, data: idea });
});

// Delete Idea
router.delete('/:id', (req, res) => {
  // Find the idea
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  //If idea not found
  if (!idea) {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }
  //If found delete the idea
  const index = ideas.indexOf(idea);
  ideas.splice(index, 1);

  // Share success message and return an empty object
  res.json({ success: true, data: {} });
});

// Find ideas by text
router.get('/search/:searchText', (req, res) => {
  const searchText = req.params.searchText.toLowerCase();

  // Filter ideas based on the searchText
  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.text.toLowerCase().includes(searchText) ||
      idea.tag.toLowerCase().includes(searchText) ||
      idea.username.toLowerCase().includes(searchText) ||
      idea.date.toLowerCase().includes(searchText)
  );

  // If no ideas match the search criteria, send a 404 error
  if (filteredIdeas.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No ideas found matching the search criteria',
    });
  }

  // If ideas are found, return them
  res.json({ success: true, data: filteredIdeas });
});

module.exports = router;
