const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const {MongoClient, ObjectId} = require('mongodb');
const MongoURI = process.env.MongoDB
const port = process.env.PORT || 1947;
//const port = 1947;
app.use(cors());

//const swaggerDocument = require('./swagger-api.json');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apartment Visitor Management System',
      version: '1.0.0',
    },
  },
  apis: ['./swagger.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

// MongoDB connection URI
const uri = 'mongodb+srv://aziffarhan:AyamGuring%401947@aziffarhan.ddoxdkj.mongodb.net/?retryWrites=true&w=majority'


// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');

    // Get the admin and visitors collections
    const db = client.db('ApartmentVisitorManagementSystem');
    const adminCollection = db.collection('admin');
    const userCollection = db.collection('user');
    const visitorsRegistrationCollection = db.collection('visitorsRegistration');

    // Helper functions
    function login(reqUsername, reqPassword) {
        console.log('Login request:', reqUsername, reqPassword);
        return adminCollection.findOne({ username: reqUsername, password: reqPassword })
          .then(matchAdmin => {
            console.log('Matched admin:', matchAdmin);
            if (!matchAdmin) {
              return {
                success: false,
                message: "Admin not found!"
              };
            } else {
              return {
                success: true,
                admin: matchAdmin
              };
            }
          })
          .catch(error => {
            console.error('Error in login:', error);
            return {
              success: false,
              message: "An error occurred during login. Check the server logs for details."
            };
          });          
      }
      

    // User login function
    function loginUser(reqUsername, reqPassword) {
      return userCollection.findOne({ username: reqUsername, password: reqPassword })
        .then(matchUser => {
          if (!matchUser) {
            return {
              success: false,
              message: "User not found!"
            };
          } else {
            return {
              success: true
            };
          }
        })
        .catch(error => {
          console.error('Error in user login:', error);
          return {
            success: false,
            message: "An error occurred during user login."
          };
        });
    }
    
    // Admin registration function
    function register(reqUsername, reqPassword, reqName, reqEmail) {
      return adminCollection.insertOne({
        username: reqUsername,
        password: reqPassword,
        name: reqName,
        email: reqEmail
      })
        .then(() => {
          return "Registration successful!";
        })
        .catch(error => {
          console.error('Error in register:', error);
          return "An error occurred during registration.";
        });
    }

    // User registration function
    function registerUser(reqUsername, reqPassword, reqName, reqEmail) {
      return userCollection.insertOne({
        username: reqUsername,
        password: reqPassword,
        name: reqName,
        email: reqEmail
      })
        .then(() => {
          return "User registration successful!";
        })
        .catch(error => {
          console.error('Error in user registration:', error);
          return "An error occurred during user registration.";
        });
    }

    function generateToken(adminData) {
      const token = jwt.sign(
        adminData,
        'ayamguring',
        { expiresIn: '1h' }
      );
      return token;
    }    

    function verifyToken(req, res, next) {
      let header = req.headers.authorization;
    
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).send('Invalid Token');
      }
    
      let token = header.split(' ')[1];
    
      jwt.verify(token, 'ayamguring', function (err, decoded) {
        if (err) {
          return res.status(401).send('Invalid Token');
        }
        req.admin = decoded;
        next();
      });
    }
    

    // Login route
    app.post('/login', async (req, res) => {
        console.log(req.body);
    
        try {
        const response = await login(req.body.username, req.body.password);
        if (response.success) {
            const token = generateToken(response.admin);
            res.send(token);
        } else {
            res.status(401).send(response.message);
        }
        } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).send("An error occurred during login.");
        }
    });
  

    // User login route
    app.post('/user/login', (req, res) => {
      console.log(req.body);

      let result = loginUser(req.body.username, req.body.password);
      result.then(response => {
        if (response.success) {
          res.send('User login successful!');
        } else {
          res.status(401).send(response.message);
        }
      }).catch(error => {
        console.error('Error in user login route:', error);
        res.status(500).send("An error occurred during user login.");
      });
    });

    // Register route
    app.post('/register', (req, res) => {
      console.log(req.body);

      let result = register(req.body.username, req.body.password, req.body.name, req.body.email);
      result.then(response => {
        res.send(response);
      }).catch(error => {
        console.error('Error in register route:', error);
        res.status(500).send("An error occurred during registration.");
      });
    });

    // Create user route
    app.post('/user/register', (req, res) => {
      console.log(req.body);

      let result = registerUser(req.body.username, req.body.password, req.body.name, req.body.email);
      result.then(response => {
        res.send(response);
      }).catch(error => {
        console.error('Error in user registration route:', error);
        res.status(500).send("An error occurred during user registration.");
      });
    });

    // // Create visitorsRegistration route without token verification
    // app.post('/visitorsRegistration', (req, res) => {
    //     const visitorRegistrationData = req.body || {};

    //     const visitorInfo = visitorRegistrationData.visitorInfo || {};
    //     const visitorAddress = visitorRegistrationData.visitorAddress || {};
    //     const otherDetails = visitorRegistrationData.otherDetails || {};
    //     const visitDetails = visitorRegistrationData.visitDetails || {};
    //     const addInfo = visitorRegistrationData.addInfo || {};
    //     const blacklistStatus = visitorRegistrationData.blacklistStatus || {};

    //     console.log('Data received:', visitorRegistrationData);

    //     // Insert each piece of data into its respective collection and save the IDs
    //     Promise.all([
    //         visitorsInfoCollection.insertOne(visitorInfo),
    //         visitorsAddressCollection.insertOne(visitorAddress),
    //         otherDetailsCollection.insertOne(otherDetails),
    //         visitDetailsCollection.insertOne(visitDetails),
    //         additionalInfoCollection.insertOne(addInfo),
    //         blacklistStatusCollection.insertOne(blacklistStatus)
    //     ])
    //     .then(result => {
    //         // The result array contains the results of each insert operation
    //         const [visitorInfoResult, visitorAddressResult, otherDetailsResult, visitDetailsResult, addInfoResult, blacklistStatusResult] = result;

    //         // Access _id properties after successful insertion
    //         const visitorsRegistrationData = {
    //             visitorInfoId: visitorInfoResult.insertedId,
    //             visitorAddressId: visitorAddressResult.insertedId,
    //             otherDetailsId: otherDetailsResult.insertedId,
    //             visitDetailsId: visitDetailsResult.insertedId,
    //             addInfoId: addInfoResult.insertedId,
    //             blacklistStatusId: blacklistStatusResult.insertedId,
    //             // Save the actual data along with the IDs
    //             visitorInfo: visitorInfo,
    //             visitorAddress: visitorAddress,
    //             otherDetails: otherDetails,
    //             visitDetails: visitDetails,
    //             addInfo: addInfo,
    //             blacklistStatus: blacklistStatus
    //         };

    //         console.log('Data inserted successfully:', visitorsRegistrationData);

    //         // Insert visitorsRegistrationData into the main collection
    //         return visitorsRegistrationCollection.insertOne(visitorsRegistrationData);
    //     })
    //     .then(() => {
    //         res.send('Visitor registration created successfully');
    //     })
    //     .catch(error => {
    //         console.error('Error creating visitor registration:', error);
    //         res.status(500).send('An error occurred while creating the visitor registration');
    //     });
    // });

    // Create visitorsRegistration route without token verification
    app.post('/visitorsRegistration', (req, res) => {
        const visitorRegistrationData = req.body || {};

        console.log('Request body:', req.body);  // Log the request body

        // Check if visitorRegistrationData is present
        if (!visitorRegistrationData) {
            return res.status(400).send('Incomplete visitor registration data');
        }

        console.log('Data received:', visitorRegistrationData);

        // Insert all details into visitorsRegistration collection
        visitorsRegistrationCollection.insertOne(visitorRegistrationData)
            .then(result => {
                console.log('Insert result:', result);

                if (result.insertedId) {
                    console.log('Data inserted successfully:', result.insertedId);
                    res.send('Visitor registration created successfully');
                } else {
                    console.error('Error creating visitor registration: No documents inserted');
                    console.log('Inserted Id:', result.insertedId); // Log the insertedId
                    res.status(500).json({
                        error: 'An error occurred while creating the visitor registration',
                        details: 'No documents inserted'
                    });
                }
            })
            .catch(error => {
                console.error('Error creating visitor registration:', error);
                res.status(500).send('An error occurred while creating the visitor registration');
            });
    });

    // Read the visitorsRegistration route "*"
    app.get('/visitorsRead', verifyToken, (req, res) => {
        visitorsRegistrationCollection.find().toArray()
          .then(visitors => {
            res.json(visitors);
          })
          .catch(error => {
            console.error('Error retrieving visitor information:', error);
            res.status(500).json({ message: 'An error occurred while retrieving visitor information' });
          });
      });

    const { ObjectId } = require('mongodb');

    // Update visitorsRegistration route
    app.patch('/visitorsUpdate/:id', verifyToken, (req, res) => {
        const visitorId = req.params.id;
        const updateData = req.body;
    
        // Validate that updateData contains fields that should be updated
        const validFields = ['visitorInfo', 'visitorAddress', 'otherDetails', 'visitDetails', 'addInfo', 'blacklistStatus'];
        const isValidUpdate = Object.keys(updateData).every(field => validFields.includes(field));
    
        if (!isValidUpdate) {
        return res.status(400).send('Invalid fields for update');
        }
    
        visitorsRegistrationCollection
        .updateOne({ _id: new ObjectId(visitorId) }, { $set: updateData })
        .then(result => {
            if (result.modifiedCount === 1) {
            res.send('Visitor information updated successfully');
            } else {
            res.status(404).send('Visitor not found');
            }
        })
        .catch(error => {
            console.error('Error updating visitor information:', error);
            res.status(500).send('An error occurred while updating the visitor information');
        });
    });
    
    // Delete visitorsRegistration route
    app.delete('/visitorsRegistration/:id', verifyToken, (req, res) => {
        const visitorRegistrationId = req.params.id;
    
        // Find the visitor registration document
        visitorsRegistrationCollection.findOne({ _id: new ObjectId(visitorRegistrationId) })
        .then(visitorRegistration => {
            if (!visitorRegistration) {
            return res.status(404).send('Visitor registration not found');
            }
    
            // Delete the visitor registration document
            visitorsRegistrationCollection.deleteOne({ _id: new ObjectId(visitorRegistrationId) })
            .then(deleteResult => {
                if (deleteResult.deletedCount === 0) {
                console.log('No documents deleted during visitor registration deletion');
                res.status(200).send('Visitor registration not found, but no documents deleted');
                } else {
                console.log('Visitor registration deleted successfully');
                res.status(200).send('Visitor registration deleted successfully');
                }
            })
            .catch(error => {
                console.error('Error deleting visitor registration:', error);
                res.status(500).send('An error occurred while deleting the visitor registration');
            });
        })
        .catch(error => {
            console.error('Error finding visitor registration:', error);
            res.status(500).send('An error occurred while finding the visitor registration');
        });
    });
  
      
      
    // Start the server
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });