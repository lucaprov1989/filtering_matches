import chai from 'chai';
import chaiHttp from 'chai-http';
const expect = chai.expect;
chai.use(chaiHttp);
import server from '../server';
import {mockedFilters} from "./test-matchesClass";

describe('getAllMatchesHttpCall', () => {
    it('should return 200 on GET /', (done) => {
        const request = chai.request(server);
        request
            .get('/')
            .end( (err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 200 on POST /', (done) => {
        const request = chai.request(server);
        request
            .post('/')
            .type('form')
            .send({filters: mockedFilters})
            .end( (err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

