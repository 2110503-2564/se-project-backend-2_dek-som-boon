const express = require('express');

const {getTherapists,getTherapist,createTherapist,updateTherapist,deleteTherapist} = require('../controllers/therapists');

/**
 * @swagger
 * components:
 *   schemas:
 *     Therapist:
 *       type: object
 *       required:
 *         - name
 *         - tel
 *         - birthDate
 *         - sex
 *         - specialty
 *         - available
 *         - massageShop
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the therapist
 *           example: "680f2c41412006b5eecd9ffa"
 *         name:
 *           type: string
 *           description: Name of the therapist
 *           example: "John Doe"
 *         tel:
 *           type: string
 *           description: Contact telephone number of the therapist
 *           example: "0123456789"
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Date of birth of the therapist (must be 18 or older)
 *           example: "2005-08-20T00:00:00.000Z"
 *         sex:
 *           type: string
 *           enum: [male, female, gay, queer, lesbian, bisexual, other]
 *           description: Gender/sex of the therapist
 *           example: "male"
 *         specialty:
 *           type: array
 *           items:
 *             type: string
 *           description: List of therapist's specialties (1-5 items)
 *           example: ["Aromatherapy massage", "Thai Traditional massage"]
 *         available:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *           description: Days of the week the therapist is available
 *           example: ["Monday", "Wednesday", "Friday"]
 *         massageShop:
 *           type: string
 *           description: ID of the associated massage shop
 *           example: "5f8d0d55a5b2b5b1f7c6e5d7"
 *         age:
 *           type: number
 *           description: Therapist age
 *           example: 29
 *       additionalProperties: false
 */

/**
 * @swagger
 * tags:
 *   name: Therapists
 *   description: Manage therapists, including profiles, skills, and availability.
 */

/**
 * @swagger
 * /massage-shops/{massageShopId}/therapists:
 *   get:
 *     summary: Get all therapists for a specific massage shop
 *     tags: [Therapists]
 *     description: Retrieve all therapists for a specific massage shop.
 *     parameters:
 *       - in: path
 *         name: massageShopId
 *         schema:
 *           type: string
 *           default: 67e1bf352ecfb1084bd572d4
 *         required: true
 *         description: ID of the massage shop to retrieve therapists for
 *     responses:
 *       200:
 *         description: Successful response with a list of therapists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Therapist'
 */

/**
 * @swagger
 * /therapists/{id}:
 *   get:
 *     summary: Get a single therapist by ID
 *     tags: [Therapists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the therapist to fetch
 *         schema:
 *           type: string
 *           default: 680f2c41412006b5eecd9ffa
 *     responses:
 *       200:
 *         description: Successfully fetched therapist data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Therapist'
 */

/**
 * @swagger
 * /massage-shops/{massageShopId}/therapists:
 *   post:
 *     summary: Create new therapist for a specific massage shop
 *     description: Create and assign a new therapist to a massage shop by ID.
 *     tags:
 *       - Therapists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: massageShopId
 *         required: true
 *         schema:
 *           type: string
 *           default: 67e1bf352ecfb1084bd572d4
 *         description: ID of the massage shop to assign the therapist to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tel
 *               - birthDate
 *               - sex
 *               - specialty
 *               - available
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               tel:
 *                 type: string
 *                 example: "0123456789"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               sex:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               specialty:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Thai Traditional massage", "Sports massage"]
 *               available:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                 example: ["Monday", "Wednesday", "Friday"]
 *     responses:
 *       201:
 *         description: Therapist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Therapist'
 *       404:
 *         description: Massage shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Massage shop not found"
 */

/**
 * @swagger
 * /therapists/{id}:
 *   put:
 *     summary: Update therapist
 *     description: Update an existing therapist by ID.
 *     tags:
 *       - Therapists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the therapist to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated John Doe"
 *               tel:
 *                 type: string
 *                 example: "0987654321"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1991-05-15"
 *               sex:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               specialty:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Deep Tissue massage", "Swedish massage"]
 *               available:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                 example: ["Tuesday", "Thursday"]
 *     responses:
 *       200:
 *         description: Therapist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Therapist'
 *       404:
 *         description: Therapist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Therapist not found"
 */

/**
 * @swagger
 * /therapists/{id}:
 *   delete:
 *     summary: Delete therapist
 *     description: Delete an existing therapist by ID. Therapist cannot be deleted if they have existing reservations.
 *     tags:
 *       - Therapists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the therapist to delete
 *     responses:
 *       200:
 *         description: Therapist deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Cannot delete therapist with existing reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot delete therapist with existing reservations"
 *       404:
 *         description: Therapist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Therapist not found"
 */



const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
  
router.route('/')
    .get(getTherapists)
    .post(protect,authorize('admin'), createTherapist);
router.route('/:id')
    .get(getTherapist)
    .put(protect,authorize('admin'), updateTherapist)
    .delete(protect,authorize('admin'), deleteTherapist);

module.exports = router;