const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { deleteTherapist } = require('../controllers/therapists');
const Therapist = require('../models/Therapist');
const MassageShop = require('../models/MassageShop');
const Reservation = require('../models/Reservation');

describe('deleteTherapist', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const mockReservation = new Reservation({    
            _id: '645e326c3aa5866f7784fa99',
            reserveDate: '2025-04-30T10:00:00.000Z',
            user: '645e326c3aa5866f7784fa91',
            massageShop: '645e326c3aa5866f7784fa93',
            therapist: '645e326c3aa5866f7784fa91',
            createdAt: '2025-04-25T20:00:00.000Z'                        
        });
        await mockReservation.save();

        const mockMassageShops1 = new MassageShop({
            _id: '645e326c3aa5866f7784fa93',
            name: 'Relaxation Haven',
            address: '123 Main St',
            tel: '123-456-7890',
            openTime: '09:00',
            closeTime: '21:00',
            averageRating: 4.5,
            reviewerCount: 10,
        });
        await mockMassageShops1.save();

        const mockTherapist1 = new Therapist({
            _id: '645e326c3aa5866f7784fa91',
            name: 'John Doe',
            tel: '123-456-7890',
            birthDate: '1985-04-25T00:00:00.000Z',
            sex: 'male',
            specialty: ['Swedish Massage', 'Deep Tissue', 'Aromatherapy'],
            available: ['Monday', 'Wednesday', 'Friday'],
            massageShop: '645e326c3aa5866f7784fa93'
        });
        await mockTherapist1.save();

        const mockTherapist2 = new Therapist({
            _id: '645e326c3aa5866f7784fa92',
            tel: '987-654-3210',
            name: 'Jane Smith',
            birthDate: '1990-07-15T00:00:00.000Z',
            sex: 'female',
            specialty: ['Reflexology', 'Hot Stone Therapy'],
            available: ['Tuesday', 'Thursday', 'Saturday'],
            massageShop: '645e326c3aa5866f7784fa93'
        });
        await mockTherapist2.save();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        // Clean up the database between tests
        await Therapist.deleteMany({});
    });

    describe('DELETE /api/v1/therapists/:id', () => {
        it('should return a 200 status code', async () => {
            const req = {
                params: {
                    id: '645e326c3aa5866f7784fa92',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await deleteTherapist(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data : {}
                }),
            );
        });
    });

    describe('DELETE /api/v1/therapists/:id with therapist that have reservation', () => {
        it('should return a 400 status code', async () => {
            const req = {
                params: {
                    id: '645e326c3aa5866f7784fa91',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            await deleteTherapist(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Cannot delete therapist with existing reservations'
                }),
            );
        });
    });

    describe('DELETE /api/v1/therapists/:id with no therapist ID found', () => {
        it('should return a 404 status code', async () => {
            const req = {
                params: {
                    id: '645e326c3aa5866f7784fa99',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteTherapist(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Therapist not found'
                }),
            );
        });
    });

    describe('DELETE /api/v1/therapists/:id with wrong therapist ID format', () => {
        it('should return a 500 status code', async () => {
            const req = {
                params: {
                    id: 'invalid-id',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deleteTherapist(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    error: expect.any(String)
                }),
            );
        });
    });
});