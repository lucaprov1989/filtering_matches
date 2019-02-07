import exphbs from 'express-handlebars';
import handlebarsHelpers from 'handlebars-helpers';
import path from 'path';

/** Handlebars configuration */
const Createhbs = (settings) => {
    const hbs = exphbs.create({
        layoutsDir: path.join(__dirname, '../views'),
        partialsDir: path.join(__dirname, '../views/elements'),
        defaultLayout: 'default',
        extname: '.hbs',

        helpers: {
            formatPercentage: (float) => {
                const int = float * 100;
                return `${int} %`;
            },
            formatKm: (number) => {
                const kms = parseInt(Math.round((number/1000)));
                return `${kms} km`;
            }
        },

    });

    // Import the helpers
    handlebarsHelpers({ handlebars: hbs.handlebars });


    return hbs;
};

/** Expose the setup method
 * @param {ExpressApplication} app
 */
export default (app) => {
    const hbs = Createhbs();
    app.engine(hbs.extname, hbs.engine);
    app.set('view engine', hbs.extname);
    app.set('views', path.join(__dirname, '../views/pages'));
    app.set('trust proxy', 1);
};
