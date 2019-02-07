import express from 'express';
import { Matches } from '.';
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const matches = await Matches.getMatches();
        res.render('matches', {
            layout: 'default',
            title: 'FilterMatches',
            matches,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { filters } = req.body;
        const matches = await Matches.getMatches(filters);
        res.render('matches', {
            layout: 'default',
            title: 'FilterMatches',
            pic: filters.main_photo,
            cont: filters.contacts_exchanged,
            fav: filters.favourite,
            matches,
            min_compatibility: filters.compatibility_score.min,
            max_compatibility: filters.compatibility_score.max,
            min_age: filters.age.min,
            max_age: filters.age.max,
            min_height: filters.height_in_cm.min,
            max_height: filters.height_in_cm.max,
            distance: filters.distance

        });
    } catch (err) {
        next(err);
    }
});
export default router;
