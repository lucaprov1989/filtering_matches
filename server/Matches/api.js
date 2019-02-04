import express from 'express';
import { Matches } from '.';
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {

        const matches = await Matches.getAll();

        res.render('matches', {
            layout: 'default',
            title: 'FilterMatches',
            matches

        });
    } catch (err) {
        next(err);
    }
});
export default router;
