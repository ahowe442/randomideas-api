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

// Middleware to convert text to lowercase
const toLowerCase = (text) => text.toLowerCase();

// Middleware to handle error response for resource not found
const handleResourceNotFound = (res) =>
  res.status(404).json({
    success: false,
    error: 'Resource not found',
  });

// Middleware to filter ideas based on a search criteria
const filterIdeas = (ideas, searchText) =>
  ideas.filter(
    (idea) =>
      toLowerCase(idea.text).includes(searchText) ||
      toLowerCase(idea.tag).includes(searchText) ||
      toLowerCase(idea.username).includes(searchText)
  );

// Middleware to filter ideas based on date or date range
const filterIdeasByDate = (ideas, startDate, endDate) => {
  const startDateObj = new Date(startDate);
  const endDateObj = endDate ? new Date(endDate) : null;

  return ideas.filter((idea) => {
    const ideaDate = new Date(idea.date);
    if (endDateObj) {
      return (
        ideaDate >= startDateObj && ideaDate <= endDateObj
      );
    } else {
      return ideaDate.getTime() === startDateObj.getTime();
    }
  });
};

// Get all ideas
router.get('/', (req, res) => {
  res.json({ success: true, data: ideas });
});

// Get single idea
router.get('/:id', (req, res) => {
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  if (!idea) {
    return handleResourceNotFound(res);
  }
  res.json({ success: true, data: idea });
});

// Add an idea
router.post('/', (req, res) => {
  const idea = {
    id: ideas.length + 1,
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
    date: new Date().toISOString().slice(0, 10),
  };
  ideas.push(idea);
  res.json({ success: true, data: idea });
});

// Update idea
router.put('/:id', (req, res) => {
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  if (!idea) {
    return handleResourceNotFound(res);
  }
  idea.text = req.body.text || idea.text;
  idea.tag = req.body.tag || idea.tag;
  res.json({ success: true, data: idea });
});

// Delete idea
router.delete('/:id', (req, res) => {
  const idea = ideas.find(
    (idea) => idea.id === +req.params.id
  );
  if (!idea) {
    return handleResourceNotFound(res);
  }
  const index = ideas.indexOf(idea);
  ideas.splice(index, 1);
  res.json({ success: true, data: {} });
});

// Search ideas by string
router.get('/search/:searchText', (req, res) => {
  const searchText = toLowerCase(req.params.searchText);
  const filteredIdeas = filterIdeas(ideas, searchText);
  if (filteredIdeas.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No ideas found matching the search criteria',
    });
  }
  res.json({ success: true, data: filteredIdeas });
});

// Search ideas by date or date range
router.get(
  '/searchDate/:startDate/:endDate?',
  (req, res) => {
    const { startDate, endDate } = req.params;
    const filteredIdeas = filterIdeasByDate(
      ideas,
      startDate,
      endDate
    );
    if (filteredIdeas.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          'No ideas found matching the search criteria',
      });
    }
    res.json({ success: true, data: filteredIdeas });
  }
);

module.exports = router;
