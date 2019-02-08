import chai from 'chai';
import chaiHttp from 'chai-http';
const expect = chai.expect;
chai.use(chaiHttp);
const app = 'http://localhost:5000';

describe('getAllMatchesHttpCall', () => {
    it('should return 200 on GET /', function (done) {
        const request = chai.request(app);
        request
            .get('/')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

