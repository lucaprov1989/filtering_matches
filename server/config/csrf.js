import Express from 'express';
import csrf from 'csurf';
require('dotenv').config({path: '.env'});

const router = new Express.Router();

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

if (process.env.NODE_ENV !== 'production') {
    router.get('/csrf', async (req, res, next) => {
        res.json( {csrf: req.csrfToken() });
    })
}

export default router;
