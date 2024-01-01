/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate admin user
 *     description: Authenticate admin user with username and password
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Admin username
 *               password:
 *                 type: string
 *                 description: Admin password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               admin:
 *                 // Specify the structure of the admin object here
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid credentials
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: An error occurred during login. Check the server logs for details.
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user with username and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User username
 *               password:
 *                 type: string
 *                 description: User password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Successful user authentication
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found!
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: An error occurred during user login.
 */

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: API for admin operations
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new admin
 *     description: Register a new admin with the provided information
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Admin username
 *               password:
 *                 type: string
 *                 description: Admin password
 *               name:
 *                 type: string
 *                 description: Admin name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin email address
 *             required:
 *               - username
 *               - password
 *               - name
 *               - email
 *     responses:
 *       '201':
 *         description: Admin registration successful
 *         content:
 *           application/json:
 *             example:
 *               message: Registration successful!
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: An error occurred during registration.
 */

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: API for user operations
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User username
 *               password:
 *                 type: string
 *                 description: User password
 *               name:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *             required:
 *               - username
 *               - password
 *               - name
 *               - email
 *     responses:
 *       '201':
 *         description: User registration successful
 *         content:
 *           application/json:
 *             example:
 *               message: User registration successful!
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: An error occurred during user registration.
 */

/**
 * @swagger
 * /visitorsRegistration:
 *   post:
 *     tags:
 *       - Visitor
 *       - Admin
 *       - User
 *     summary: "Register a new visitor"
 *     description: "Register a new visitor with their details."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VisitorsInformation"
 *     responses:
 *       200:
 *         description: "Visitor registration successful"
 *       400:
 *         description: "Incomplete visitor registration data"
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 * 
 */

/**
 * @swagger
 * /visitorsRead:
 *   get:
 *     tags:
 *       - Admin
 *     summary: "Get all visitor information"
 *     description: "Retrieve all information about registered visitors. Requires a valid JWT token."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "List of all visitor information"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/VisitorsInformation"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             example:
 *               message: "An error occurred while retrieving visitor information"
 */

/**
 * @swagger
 * /visitorsUpdate/{visitorId}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: "Update visitor information"
 *     description: "Update information about a registered visitor. Requires a valid admin JWT token."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: visitorId
 *         in: path
 *         description: "ID of the visitor to update"
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VisitorDataInput"
 *     responses:
 *       200:
 *         description: "Visitor information updated successfully"
 *       404:
 *         description: "Visitor not found"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * /visitorsRegistration/{visitorId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: "Delete visitor registration"
 *     description: "Delete a registered visitor based on their ID. Requires a valid admin JWT token."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: visitorId
 *         in: path
 *         description: "ID of the visitor to delete"
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Visitor registration deleted successfully"
 *       404:
 *         description: "Visitor registration not found"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VisitorsInformation:
 *       type: object
 *       properties:
 *         visitorInfo:
 *           $ref: "#/components/schemas/VisitorsInfoInput"
 *         visitorAddress:
 *           $ref: "#/components/schemas/VisitorsAddressInput"
 *         otherDetails:
 *           $ref: "#/components/schemas/OtherDetailsInput"
 *         visitDetails:
 *           $ref: "#/components/schemas/VisitDetailsInput"
 *         addInfo:
 *           $ref: "#/components/schemas/AddInfoInput"
 *         blacklistStatus:
 *           $ref: "#/components/schemas/BlacklistStatusInput"
 *
 *     VisitorsInfoInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phoneNumber:
 *           type: string
 *
 *     VisitorsAddressInput:
 *       type: object
 *       properties:
 *         streetAddress:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         postalCode:
 *           type: string
 *         country:
 *           type: string
 *
 *     OtherDetailsInput:
 *       type: object
 *       properties:
 *         telephoneNumber:
 *           type: string
 *         vehicleNumber:
 *           type: string
 *         vehicleType:
 *           type: string
 *         visitorCategory:
 *           type: string
 *         company:
 *           type: string
 *         passNumber:
 *           type: string
 *
 *     VisitDetailsInput:
 *       type: object
 *       properties:
 *         noOfVisitors:
 *           type: integer
 *         purpose:
 *           type: string
 *         visitLimitHours:
 *           type: integer
 *         visitLimitMinutes:
 *           type: integer
 *         host:
 *           type: string
 *         location:
 *           type: string
 *         unitNo:
 *           type: integer
 *         permitNo:
 *           type: string
 *         deliveryOrder:
 *           type: string
 *         remark:
 *           type: string
 *
 *     AddInfoInput:
 *       type: object
 *       properties:
 *         fever:
 *           type: boolean
 *
 *     BlacklistStatusInput:
 *       type: object
 *       properties:
 *         blacklist:
 *           type: boolean
 *         blacklistRemarks:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VisitorDataInput:
 *       type: object
 *       properties:
 *         visitorInfo:
 *           $ref: "#/components/schemas/VisitorsInfoInput"
 *         visitorAddress:
 *           $ref: "#/components/schemas/VisitorsAddressInput"
 *         otherDetails:
 *           $ref: "#/components/schemas/OtherDetailsInput"
 *         visitDetails:
 *           $ref: "#/components/schemas/VisitDetailsInput"
 *         addInfo:
 *           $ref: "#/components/schemas/AddInfoInput"
 *         blacklistStatus:
 *           $ref: "#/components/schemas/BlacklistStatusInput"
 */

/**
 * @swagger
 * definitions:
 *   Error:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *         example: "An error occurred"
 */