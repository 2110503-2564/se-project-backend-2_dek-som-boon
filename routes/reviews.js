const express = require('express');

const {getReview,getReviews,createReview,updateReview,deleteReview} = require('../controllers/reviews');

/**
* @swagger
* components:
*   schemas:
*     Review:
*       type: object
*       required:
*         - score
*         - user
*         - massageShop
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The auto-generated ID of the review
*           example: 661d7d51b2f4b2d7bc90b8d2
*         score:
*           type: integer
*           description: Score given by the user (0-5). Must be an integer.
*           minimum: 0
*           maximum: 5
*           example: 4
*         comment:
*           type: string
*           description: Optional comment (maximum 250 words)
*           example: Great service, very relaxing environment.
*         user:
*           type: string
*           format: uuid
*           description: ID of the user who wrote the review
*           example: 661d7d51b2f4b2d7bc90b8d1
*         massageShop:
*           type: string
*           format: uuid
*           description: ID of the massage shop being reviewed
*           example: 661d7d51b2f4b2d7bc90b8d0
*         createdAt:
*           type: string
*           format: date-time
*           description: Date and time when the review was created
*           example: 2025-04-28T12:00:00.000Z
*       example:
*         id: 661d7d51b2f4b2d7bc90b8d2
*         score: 5
*         comment: The best massage I've ever had!
*         user: 661d7d51b2f4b2d7bc90b8d1
*         massageShop: 661d7d51b2f4b2d7bc90b8d0
*         createdAt: 2025-04-28T12:00:00.000Z
*/

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manage reviews for massage shops, including ratings and comments.
 */

/**
 * @swagger
 * /massage-shops/{massageShopId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific massage shop
 *     tags: [Reviews]
 *     description: Retrieve all reviews or filter by a specific massage shop ID
 *     parameters:
 *       - in: path
 *         name: massageShopId
 *         schema:
 *           type: string
 *           default: 67e1bf352ecfb1084bd572d4
 *         required: true
 *         description: ID of the massage shop to retrieve reviews for
 *     responses:
 *       200:
 *         description: Successful response with a list of reviews
 *         content:
 *           application/json:
 *              schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by its ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to fetch
 *     responses:
 *       200:
 *         description: Review found and returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
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
 *                   example: "Review not found"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /massage-shops/{massageShopId}/reviews:
 *   post:
 *     summary: Create a new review for a specific massage shop
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []  # <-- Indicates JWT token is required
 *     parameters:
 *       - in: path
 *         name: massageShopId
 *         required: true
 *         schema:
 *           type: string
 *           default: 67e1bf352ecfb1084bd572d4
 *         description: ID of the massage shop for which the review is being created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: integer
 *                 description: Score for the review, must be between 0 and 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Review comment (optional, max 250 words)
 *                 example: "Great massage experience, very relaxing!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input or error creating review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Review validation failed: score: Path `score` (0) is less than minimum allowed value (1)."
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
 *       401:
 *         description: Unauthorized to create this review
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
 *                   example: "Not authorize to access this route"
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update an existing review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []  # <-- JWT is required for this route
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 description: Updated score for the review, must be between 0 and 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Updated review comment (optional, max 250 words)
 *                 example: "Updated comment: Great massage experience, very relaxing!"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input or error updating review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Review validation failed: score: Path `score` (0) is less than minimum allowed value (1)."
 *       404:
 *         description: Review or Massage Shop not found
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
 *                   example: "Review not found"
 *       403:
 *         description: Unauthorized to update this review
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
 *                   example: "Not authorized to update this review"
 *       401:
 *         description: JWT is missing or invalid
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
 *                   example: "Not authorized to access this route"
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []  # <-- JWT is required for this route
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *       404:
 *         description: Review or Massage Shop not found
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
 *                   example: "Review not found"
 *       403:
 *         description: Unauthorized to delete this review
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
 *                   example: "Not authorized to delete this review"
 *       401:
 *         description: JWT is missing or invalid
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
 *                   example: "Not authorized to access this route"
 */






const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
  
router.route('/')
    .get(getReviews)
    .post(protect,authorize('admin', 'user'), createReview);
router.route('/:id')
    .get(getReview)
    .put(protect,authorize('admin', 'user'), updateReview)
    .delete(protect,authorize('admin', 'user'), deleteReview);

module.exports = router;