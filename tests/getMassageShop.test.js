const mongoose = require('mongoose');
const MassageShop = require('../models/MassageShop');
const { getMassageShop } = require('../controllers/massage-shops');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('getMassageShops', () => {
    let mongoServer;
    let app;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const mockMassageShops1 = new MassageShop({
            _id: '65e326c3aa5866f7784fa911',
            name: 'Relaxation Haven',
            address: '123 Main St',
            tel: '123-456-7890',
            openTime: '09:00',
            closeTime: '21:00',
            averageRating: 4.5,
            reviewerCount: 10,
        });
        await mockMassageShops1.save();

        const mockMassageShops2 = new MassageShop({
            _id: '65e326d0aa5866f7784fa917',
            name: 'Serenity Spa',
            address: '456 Elm St',
            tel: '987-654-3210',
            openTime: '10:00',
            closeTime: '20:00',
            averageRating: 4.0,
            reviewerCount: 5,
        });
        await mockMassageShops2.save();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('GET /api/v1/massage-shops/:id with appeared ID', () => {
        it('should return a 200 status code', async () => {
            const req = {
                params: {
                    id: '65e326c3aa5866f7784fa911',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getMassageShop(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        name: 'Relaxation Haven',
                    }),
                }),
            );
        });
    });

    describe('GET /api/v1/massage-shops/:id with Disappeared id', () => {
        it('should return a 404 status code', async () => {
            const req = {
                params: {
                    id: '65e326c3aa5866f7784fa900',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getMassageShop(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    // message: 'Error occurred',
                }),
            );
        });
    });

    describe('GET /api/v1/massage-shops/:id with wrong ID format', () => {
        it('should handle errors and return a 500 status code', async () => {
            const req = {
                params: {
                    id: 'invalid-id', // Invalid format to trigger error
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getMassageShop(req, res);

            expect(res.status).toHaveBeenCalledWith(500); 
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                }),
            );
        });
    });
});
