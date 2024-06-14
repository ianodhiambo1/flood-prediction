const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const connection = mysql.createConnection({
	host     : 'localhost',
    port     : '3308',
	user     : 'root',
	password : 'root',
	database : 'flood'
});
const app = express();
const port = 3000;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});
// http://localhost:3000/auth
app.post('/auth', function(request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    
    // Ensure the input fields exist and are not empty
    if (username && password) {
        // Execute SQL query to select the account from the database based on the specified username
        connection.query('SELECT * FROM Users WHERE Username = ?', [username], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) {
                console.error('Database query error:', error);
                return response.status(500).send('Internal Server Error');
            }
            
            // If the account exists
            if (results.length > 0) {
                // Compare the hashed password
                bcrypt.compare(password, results[0].Password, function(err, result) {
                    if (err) {
                        // Handle the error appropriately
                        console.error('Error comparing passwords:', err);
                        return response.status(500).send('Internal Server Error');
                    }
                
                    if (result) {
                        // Authenticate the user
                        request.session.loggedin = true;
                        request.session.username = username;
                        // Redirect to home page
                        return response.redirect('/home');
                    } else {
                        return response.send('Incorrect Username and/or Password!');
                    }
                });
            } else {
                return response.send('Incorrect Username and/or Password!');
            }
        });
    } else {
        response.send('Please enter Username and Password!');
    }
});

// Render sign-up page
app.get('/signup', function(request, response) {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

// Handle user registration
app.post('/register', function(request, response) {
    // Capture the input fields
    let username = request.body.username;
    let email = request.body.email;
    let phoneNumber = request.body.phoneNumber;
    let location = request.body.location;
    let password = request.body.password;
    let notificationPreference = request.body.notificationPreference;
    
    // Ensure the input fields exists and are not empty
    if (username && email && phoneNumber && location && password && notificationPreference) {
        // Hash the password before storing it
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) throw err;
            // Execute SQL query to insert new user into the database
            connection.query('INSERT INTO Users (Username, Email, PhoneNumber, Location, Password, NotificationPreference) VALUES (?, ?, ?, ?, ?, ?)', 
                [username, email, phoneNumber, location, hash, notificationPreference], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                // Redirect to login page
                response.redirect('/');
            });
        });
    } else {
        response.send('Please fill all the fields!');
        response.end();
    }
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(port, () => console.log(`App listening on port ${port}!`));