const express = require('express');
const router = express.Router();
const Routine = require('../routes/Routine');
const User = require('../routes/User');

router.get('/', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        console.error('User ID not found in session');
        return res.status(400).send('User ID not found in session');
    }

    try {
        const user = await User.findById(userId).populate('currentRoutine').populate('pastRoutines');

        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }

        const routines = await Routine.find({ user: userId }).populate('exercises').sort({ createdAt: -1 });

        res.render('history', { user, routines, page: 'History' });
    } catch (error) {
        console.error('Error fetching workout history:', error);
        res.status(500).send('Error fetching workout history');
    }
});

module.exports = router;