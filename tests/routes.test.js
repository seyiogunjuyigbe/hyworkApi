const request = require('supertest');
// const initRoutes =  require('../src/routes/routes');
const app = require('../src/routes/routes');
// const server = initRoutes(app);

describe('Get Endpoints', async () => {
    it('should fetch an organisation', async() => {
        const res = await request(app)
        .get('/organization/touchcore')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('name')
    })
})