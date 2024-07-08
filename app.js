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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/index.html'));
});
app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/login.html'));
});
app.get('/signup', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/signup.html'));
});
app.get('/home', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/plain.html'));
});
app.get('/map', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/map.html'));
});
app.get('/disastermanagement', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/disastermanagement.html'));
});
app.get('/weather', function(request, response) {
	response.sendFile(path.join(__dirname, 'views', '/weather.html'));
});

app.post('/auth', function(request, response) {
    let username = request.body.username;
    let password = request.body.password;
    
    if (username && password) {
        connection.query('SELECT * FROM Users WHERE Username = ?', [username], function(error, results, fields) {
            if (error) {
                console.error('Database query error:', error);
                return response.status(500).send('Internal Server Error');
            }
            
            if (results.length > 0) {
                bcrypt.compare(password, results[0].Password, function(err, result) {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return response.status(500).send('Internal Server Error');
                    }
                
                    if (result) {
                        request.session.loggedin = true;
                        request.session.username = username;
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


app.post('/register', function(request, response) {
    let username = request.body.username;
    let email = request.body.email;
    let phoneNumber = request.body.phoneNumber;
    let location = request.body.location;
    let password = request.body.password;
    let notificationPreference = request.body.notificationPreference;
    
    if (username && email && phoneNumber && location && password && notificationPreference) {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) throw err;
            connection.query('INSERT INTO Users (Username, Email, PhoneNumber, Location, Password, NotificationPreference) VALUES (?, ?, ?, ?, ?, ?)', 
                [username, email, phoneNumber, location, hash, notificationPreference], function(error, results, fields) {
                if (error) throw error;
                response.redirect('/login');
            });
        });
    } else {
        response.send('Please fill all the fields!');
        response.end();
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
