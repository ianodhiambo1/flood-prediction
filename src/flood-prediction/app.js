const mysql = require("mysql2");
const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require('dotenv').config();
const fs = require('fs');
// Parse the database URL
const uri = process.env.DATABASE_URI;
const fields = new URL(uri);

// Build the connection configuration
const connectionConfig = {
  host: fields.hostname,
  port: fields.port,
  user: fields.username,
  password: fields.password,
  database: 'flood',
  ssl: {
    ca: fs.readFileSync(process.env.SSL_CA_PATH)
  }
};
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
const connection = mysql.createPool(connectionConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "views", "/index.html"));
});
app.get("/login", function (request, response) {
  response.sendFile(path.join(__dirname, "views", "/login.html"));
});
app.get("/admin-login", function (request, response) {
  response.sendFile(path.join(__dirname, "views", "/admin-login.html"));
});
app.get("/met-login", function (request, response) {
  response.sendFile(path.join(__dirname, "views", "/met-login.html"));
});

app.get("/signup", function (request, response) {
  response.sendFile(path.join(__dirname, "views", "/signup.html"));
});
app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.render("plain");
  } else {
    response.redirect("/login");
  }
});
app.get("/admin-home", function (request, response) {
  if (request.session.loggedin) {
    response.sendFile(path.join(__dirname, "views", "/admin-home.html"));
  } else {
    response.sendFile(path.join(__dirname, "views", "/admin-login.html"));
  }
});
app.get("/met-home", function (request, response) {
  if (request.session.loggedin) {
    response.sendFile(path.join(__dirname, "views", "/met-home.html"));
  } else {
    response.sendFile(path.join(__dirname, "views", "/met-login.html"));
  }
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

app.post("/auth", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    connection.query(
      "SELECT * FROM users WHERE Username = ?",
      [username],
      function (error, results, fields) {
        if (error) {
          console.error("Database query error:", error);
          return response.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
          bcrypt.compare(password, results[0].Password, function (err, result) {
            if (err) {
              console.error("Error comparing passwords:", err);
              return response.status(500).send("Internal Server Error");
            }
            if (result) {
              request.session.loggedin = true;
              request.session.username = username;
              request.session.email = results[0].Email;
              return response.redirect("/home");
            } else {
              return response.send("Incorrect Username and/or Password!");
            }
          });
        } else {
          return response.send("Incorrect Username and/or Password!");
        }
      }
    );
  } else {
    response.send("Please enter Username and Password!");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    } else {
      res.redirect("/login");
    }
  });
});
app.post("/auth-admin", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    connection.query(
      "SELECT * FROM admin WHERE Username = ?",
      [username],
      function (error, results, fields) {
        if (error) {
          console.error("Database query error:", error);
          return response.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
          bcrypt.compare(password, results[0].Password, function (err, result) {
            if (err) {
              console.error("Error comparing passwords:", err);
              return response.status(500).send("Internal Server Error");
            }
            if (result) {
              request.session.loggedin = true;
              request.session.username = username;
              request.session.email = results[0].Email;
              return response.redirect("/admin-home");
            } else {
              return response.send("Incorrect Username and/or Password!");
            }
          });
        } else {
          return response.send("Incorrect Username and/or Password!");
        }
      }
    );
  } else {
    response.send("Please enter Username and Password!");
  }
});
app.post("/auth-met", function (request, response) {
  let username = request.body.username;
  let password = request.body.password;

  if (username && password) {
    connection.query(
      "SELECT * FROM metreologist WHERE Username = ?",
      [username],
      function (error, results, fields) {
        if (error) {
          console.error("Database query error:", error);
          return response.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
          bcrypt.compare(password, results[0].Password, function (err, result) {
            if (err) {
              console.error("Error comparing passwords:", err);
              return response.status(500).send("Internal Server Error");
            }
            if (result) {
              request.session.loggedin = true;
              request.session.username = username;
              request.session.email = results[0].Email;
              return response.redirect("/met-home");
            } else {
              return response.send("Incorrect Username and/or Password!");
            }
          });
        } else {
          return response.send("Incorrect Username and/or Password!");
        }
      }
    );
  } else {
    response.send("Please enter Username and Password!");
  }
});
app.get("/logout-admin", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    } else {
      res.redirect("/admin-login");
    }
  });
});
app.get("/logout-met", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    } else {
      res.redirect("/met-login");
    }
  });
});

app.post("/register", function (request, response) {
  let username = request.body.username;
  let email = request.body.email;
  let phoneNumber = request.body.phoneNumber;
  let location = request.body.location;
  let password = request.body.password;
  let notificationPreference = request.body.notificationPreference;

  if (
    username &&
    email &&
    phoneNumber &&
    location &&
    password &&
    notificationPreference
  ) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) throw err;
      connection.query(
        "INSERT INTO users (Username, Email, PhoneNumber, Location, Password, NotificationPreference) VALUES (?, ?, ?, ?, ?, ?)",
        [username, email, phoneNumber, location, hash, notificationPreference],
        function (error, results, fields) {
          if (error) throw error;
          response.redirect("/login");
        }
      );
    });
  } else {
    response.send("Please fill all the fields!");
    response.end();
  }
});
app.get("/register-met", function (request, response) {
  let id=1;
  let username = "met1";
  let password = "met1";


  if (
    username &&
    password
  ) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) throw err;
      connection.query(
        "INSERT INTO metreologist (metid, Username, Password) VALUES (?,?, ?)",
        [id, username, hash],
        function (error, results, fields) {
          if (error) throw error;
          response.redirect("/met-login");
        }
      );
    });
  } else {
    response.send("Please fill all the fields!");
    response.end();
  }
});
app.post("/urgency", function (request, response) {
  let username = request.body.username;
  let phoneNumber = request.body.phoneNumber;
  let location = request.body.location;
  let urgency = request.body.urgency;

  if (
    username &&
    phoneNumber &&
    location &&
    urgency
  ) {
    connection.query(
        "INSERT INTO UserRequest (Username, PhoneNumber, Location, Urgency) VALUES (?, ?, ?, ?)",
        [username, phoneNumber, location, urgency],
        function (error, results, fields) {
          if (error) throw error;
          response.redirect("/disastermanagement");
        }
      );
  } else {
    response.send("Please fill all the fields!");
    response.end();
  }
});
app.post('/update', function (request, response) {
  const username = request.body.username;
  const location = request.body.location;
  const updates = request.body.updates;  

  if (username && location && updates) {
    connection.query(
      'INSERT INTO Updates (Username, Location, Updates) VALUES (?, ?, ?)',
      [username, location, updates],
      function (error, results, fields) {
        if (error) throw error;
        response.redirect('/disastermanagement');
      }
    );
  } else {
    response.send('Please fill all the fields!');
  }
});

app.get('/weather-updates', function (request, response) {
  connection.query(
    'SELECT Username, Location, Updates, Timestamp FROM Updates ORDER BY UpdateID DESC LIMIT 3', // Assuming you want the latest 3 updates
    function (error, results, fields) {
      if (error) throw error;
      response.json(results);
    }
  );
});
app.get("/flood-warnings", (req, res) => {
  const query = "SELECT * FROM predictions ORDER BY CreatedAt DESC LIMIT 4";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.send("Error fetching data");
      return;
    }
    
    res.render("flood-warnings", { data: results });
  });
});
app.get("/user", (req, res) => {
  if (req.session.loggedin) {
    res.send(req.session.username);
  } else {
    res.status(401).send("Unauthorized");
  }
});
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "xtrovertlucas@gmail.com",
    pass: "bnmokiwprmvujusi",
  },
});

const sendNotification = (userEmail,prediction) => {
  const mailOptions = {
    from: "xtrovertlucas@gmail.com",
    to: userEmail,
    subject: "Flood Warning Notification",
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Flood Alert Notification</title>
    <style type="text/css">
      img { max-width: 100%; }
      body { -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; }
      body { background-color: #f6f6f6; }
      @media only screen and (max-width: 640px) {
        body { padding: 0 !important; }
        h1, h2, h3, h4 { font-weight: 800 !important; margin: 20px 0 5px !important; }
        h1 { font-size: 22px !important; }
        h2 { font-size: 18px !important; }
        h3 { font-size: 16px !important; }
        .container { padding: 0 !important; width: 100% !important; }
        .content { padding: 0 !important; }
        .content-wrap { padding: 10px !important; }
        .invoice { width: 100% !important; }
      }
    </style>
    </head>
    <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
    <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
      <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
        <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
          <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
            <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff">
              <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                <td class="alert alert-warning" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: #FF9F00; margin: 0; padding: 20px;" align="center" bgcolor="#FF9F00" valign="top">
                  Flood Warning
                </td>
              </tr>
              <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                        <strong>Location:</strong> ${prediction.Location}
                      </td>
                    </tr>
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                        <strong>Updated at:</strong> ${prediction.PredictionTime}
                      </td>
                    </tr>
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                        Please take necessary precautions and stay safe.
                      </td>
                    </tr>
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                        <a href="http://www.yourwebsite.com" class="btn-primary" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Visit our website</a>
                      </td>
                    </tr>
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                        Thank you for using our services.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
              <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                  <td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                    <a href="http://www.yourwebsite.com/unsubscribe" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">Unsubscribe</a> from these alerts.
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </td>
        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
      </tr>
    </table>
    </body>
    </html>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

app.get("/notification", (req, res) => {
  const query = "SELECT * FROM predictions ORDER BY CreatedAt DESC LIMIT 2";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Error retrieving data from database.");
    }
    const userEmail = req.session.email;
    results.forEach((prediction) => {
      sendNotification(userEmail, prediction);
    });
    res.redirect("/home");
  });
});


// Fetch users
app.get('/users', (req, res) => {
    let sql = 'SELECT * FROM users';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
});
app.get('/users/:id', (req, res) => {
    let sql = `SELECT * FROM users WHERE UserID = ${req.params.id}`;
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(results);
    });
});

// Create user
app.post('/users', (req, res) => {
    let newUser = req.body;
    let sql = 'INSERT INTO users SET ?';
  connection.query(sql, newUser, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        res.send(result);
    });
});

// Edit user
app.put('/users/:id', (req, res) => {
    let updatedUser = req.body;
    let sql = `UPDATE users SET ? WHERE UserID = ${req.params.id}`;
    connection.query(sql, updatedUser, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// Delete user
app.delete('/users/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE UserID = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

// Fetch sensor data
app.get('/sensor-data', (req, res) => {
  let sql = 'SELECT * FROM sensordata';
  connection.query(sql, (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(results);
  });
});

app.get('/sensor-data/:id', (req, res) => {
  let sql = `SELECT * FROM sensordata WHERE SensorDataID = ${req.params.id}`;
  connection.query(sql, (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(results);
  });
});

// Create sensor data
app.post('/sensor-data', (req, res) => {
  let newSensorData = req.body;
  let sql = 'INSERT INTO sensordata SET ?';
  connection.query(sql, newSensorData, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result);
  });
});

// Edit sensor data
app.put('/sensor-data/:id', (req, res) => {
  let updatedSensorData = req.body;
  let sql = `UPDATE sensordata SET ? WHERE SensorDataID = ${req.params.id}`;
  connection.query(sql, updatedSensorData, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result);
  });
});

// Delete sensor data
app.delete('/sensor-data/:id', (req, res) => {
  let sql = `DELETE FROM sensordata WHERE SensorDataID = ${req.params.id}`;
  connection.query(sql, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(result);
  });
});
// Fetch user requests
app.get('/user-requests', (req, res) => {
  connection.query('SELECT * FROM UserRequest', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
  });
});

// Fetch updates
app.get('/updates', (req, res) => {
  connection.query('SELECT * FROM Updates', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
  });
});

// Delete user request
app.delete('/user-requests/:id', (req, res) => {
  connection.query('DELETE FROM UserRequest WHERE UserID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
  });
});

// Delete update
app.delete('/updates/:id', (req, res) => {
  connection.query('DELETE FROM Updates WHERE UpdateID = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
  });
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
