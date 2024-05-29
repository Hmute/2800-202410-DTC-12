const express = require('express');
const router = express.Router();
const Routine = require('../routes/Routine'); // Ensure this path is correct

// Route to render the exercise log page
router.get('/', (req, res) => {
  res.render('exercise', { page: 'Exercises' });
});

// Fetch all routines for a user
router.get('/data', async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.session.userId });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

// Fetch a specific exercise by routine ID and exercise ID
router.get('/data/:routineId/:exerciseId', async (req, res) => {
  try {
    const { routineId, exerciseId } = req.params;
    const routine = await Routine.findById(routineId);
    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    const exercise = routine.exercises.id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

// Update a specific exercise in a routine
router.put('/data/:routineId/:exerciseId', async (req, res) => {
  const { routineId, exerciseId } = req.params;
  const { repetitions, sets, weight, time, completion } = req.body;
  try {
    const routine = await Routine.findById(routineId);
    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    const exercise = routine.exercises.id(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    exercise.repetitions = repetitions;
    exercise.sets = sets;
    exercise.weight = weight;
    exercise.time = time;
    exercise.completion = completion;

    await routine.save();
    res.json({ message: 'Exercise updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

module.exports = router;
