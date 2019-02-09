

const chai = require('chai')
chai.use(require('chai-fs'));
const assert = chai.assert;

describe('Node JS Routes', () => {
    it('matches.hbs should exist', async () => {
        const path = './server/views/pages/matches.hbs';
        assert.isFile(path);
    });

    it('filters.hbs should exist', async () => {
        const path = './server/views/elements/filters.hbs';
        assert.isFile(path);
    });

    it('cards.hbs should exist', async () => {
        const path = './server/views/elements/cards.hbs';
        assert.isFile(path);
    });

    it('default.hbs should exist', async () => {
        const path = './server/views/default.hbs';
        assert.isFile(path);
    });

});
