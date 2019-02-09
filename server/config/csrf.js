import Express from 'express';
import csrf from 'csurf';
import app from "../index";
require('dotenv').config({path: '.env'});

const router = new Express.Router();

// CSRF Middleware
router.use(csrf({ cookie: true }));

// This middleware automatically inject the CSRF token in the request locals
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
