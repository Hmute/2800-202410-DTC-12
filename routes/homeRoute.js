const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Routine = require('../routes/Routine'); // Import the central model

router.get('/', async (req, res) => {
    const { saved } = req.query;
    const user = req.session.user;

    try {
        const myDatabase = mongoose.connection.useDb('test');
        const Routines = myDatabase.model('Routine', Routine.schema);
        const routines = await Routines.find({ user: user._id });

        res.render('home', { user, page: 'Home', saved, routines });
    } catch (err) {
        console.error('Error fetching routines:', err);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
