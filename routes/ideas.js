const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

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
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json({ success: true, data: ideas });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong.',
    });
  }
});

// Get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return handleResourceNotFound(res);
    }
    res.json({ success: true, data: idea });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
});

// Add an idea
router.post('/', async (req, res) => {
  const { text, tag, username } = req.body;
  try {
    const idea = new Idea({ text, tag, username });
    const savedIdea = await idea.save();
    res.json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          text: req.body.text,
          tag: req.body.tag,
        },
      },
      { new: true } //If the idea doesn't exist then it will create a new idea.
    );
    res.json({ success: true, data: updatedIdea });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(
      req.params.id
    );
    res.json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
});

// Search ideas by string
router.get('/search/:searchText', async (req, res) => {
  try {
    const searchText = toLowerCase(req.params.searchText);
    const filteredIdeas = await Idea.find({
      $or: [
        { text: { $regex: searchText, $options: 'i' } },
        { tag: { $regex: searchText, $options: 'i' } },
        { username: { $regex: searchText, $options: 'i' } },
      ],
    });
    if (filteredIdeas.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          'No ideas found matching the search criteria',
      });
    }
    res.json({ success: true, data: filteredIdeas });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
});

// Search ideas by date or date range
router.get(
  '/searchDate/:startDate/:endDate?',
  async (req, res) => {
    try {
      const { startDate, endDate } = req.params;
      const filteredIdeas = await Idea.find({
        date: {
          $gte: new Date(startDate),
          ...(endDate && { $lte: new Date(endDate) }),
        },
      });
      if (filteredIdeas.length === 0) {
        return res.status(404).json({
          success: false,
          error:
            'No ideas found matching the search criteria',
        });
      }
      res.json({ success: true, data: filteredIdeas });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Something went wrong',
      });
    }
  }
);

module.exports = router;
