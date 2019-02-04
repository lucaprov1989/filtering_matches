import Express from 'express';
import ExpressSession from 'express-session';
import { settings as cookieSettings } from './cookie';

const router = new Express.Router();

router.use(ExpressSession({
    secret: 'Wn4QxWQ6zUaXjLs4FXDGQNZ8N2gXUR9H',
    secure: true,
    proxy: true,
    saveUninitialized: true,
    resave: true,
    cookie: cookieSettings,

}));

export default router;
