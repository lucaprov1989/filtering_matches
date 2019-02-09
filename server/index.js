require('dotenv').config({path: '.env'});

import babelPolyfill from "babel-polyfill";
import path from 'path';
import Express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import matches from './Matches/api';
import http from 'http';
import viewEngineSetup from './config/view-engine';
import SessionMiddleware from './config/session';
import CookieMiddleware from './config/cookie';
import CsrfMiddleware from './config/csrf';
import getHTMLAssets from './config/html-assets';
import MongoDB from './config/mongo';

const app = new Express();

const index = http.createServer(app);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(CookieMiddleware());

if(process.env.NODE_ENV !== 'test') {
    app.use(CsrfMiddleware);
}


app.use(SessionMiddleware);

app.use(Express.static(path.join(__dirname, '../public'), { maxAge: '30 days' }));
app.use(getHTMLAssets);


app.use(matches);


viewEngineSetup(app);

const port = process.env.PORT || 5000;

index.listen(port, () => {
    MongoDB.connect();
    console.log(`Server listening on ${process.env.FRONTEND_URL}:${port}`);
});

export default app;


