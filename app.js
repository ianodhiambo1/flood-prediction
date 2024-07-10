const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
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

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
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
      "SELECT * FROM Users WHERE Username = ?",
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
        "INSERT INTO Users (Username, Email, PhoneNumber, Location, Password, NotificationPreference) VALUES (?, ?, ?, ?, ?, ?)",
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
//   app.locals.getIconSvg = (floodPrediction) => {
//     let svgColor = '#00a4cd'; // Default color

//     if (floodPrediction < 0.3) {
//       svgColor = '#f18700';
//     } else if (floodPrediction < 0.7) {
//       svgColor = '#ffff00'; // Change to your desired color for this range
//     }

//     return `
//       <svg role="img" focusable="false" width="38" height="38" viewBox="0 0 38 38" fill-rule="evenodd"
//         stroke-linejoin="round" stroke-miterlimit="1.41421">
//         <title>Flood alert</title>
//         <path d="M19.037 2.791c.69.018 1.345.408 1.689 1.007l15.353 28.466c.602 1.188-.261 2.848-1.722 2.883H3.65c-1.335-.032-2.377-1.591-1.721-2.883L17.282 3.798a1.95 1.95 0 0 1 1.755-1.007z"
//           fill="${svgColor}"></path>
//         <path d="M19.083 1.064h-.032c-1.435-.011-2.6.71-3.268 1.875l-.015.027L.402 31.456l-.014.027c-1.225 2.416.723 5.331 3.22 5.391l.028.001h30.735l.028-.001c2.732-.066 4.347-3.169 3.22-5.391l-.014-.027-15.366-28.49a.6.6 0 0 0-.015-.026c-.639-1.115-1.858-1.842-3.141-1.876zm-.046 1.727c.69.018 1.345.408 1.689 1.007l15.353 28.466c.602 1.188-.261 2.848-1.722 2.883H3.65c-1.335-.032-2.377-1.591-1.721-2.883L17.282 3.798a1.95 1.95 0 0 1 1.755-1.007zm-.36 2.706a.37.37 0 0 1 .327-.195c.136 0 .262.075.327.195l14.6 27.089c.062.116.059.255-.008.367s-.189.181-.319.181h-29.2a.37.37 0 0 1-.327-.548l14.6-27.089z"
//           fill="#fff"></path>
//         <path d="M16.309 17.718v1.196l2.116-2.434c.124-.142.305-.224.494-.224s.369.083.493.226l6.125 7.081h.001c.235.273.205.685-.067.921s-.686.206-.922-.067l-.559-.646v3.725c-.192.015-.286.066-.454.171-.188.116-.436.345-.839.531a2.36 2.36 0 0 1-.978.203h-.027a2.34 2.34 0 0 1-1.291-.399c-.306-.204-.49-.362-.652-.432a.89.89 0 0 0-.395-.079c-.26.006-.357.056-.55.176s-.435.345-.839.531c-.268.122-.602.204-.977.203-.547.004-.997-.192-1.306-.388l-.667-.442c-.101-.048-.164-.066-.271-.068-.205-.009-.557.136-.958.356v-4.052l-.561.645a.65.65 0 0 1-.494.225c-.151 0-.304-.053-.428-.16-.272-.237-.301-.65-.064-.922l2.542-2.923v-2.954h1.528z"
//           fill="#181c1b"></path>
//         <path d="M21.054 23.852h1.954v2.15h-1.954z" fill="#fff"></path>
//         <path d="M32.292 31.961H5.708l1.437-2.652h.422c.286.243.638.519 1.009.757.214.137.434.262.663.36a1.94 1.94 0 0 0 .761.179c.751-.019 1.299-.38 1.826-.647.521-.285.995-.491 1.316-.481.162.001.272.034.415.103.212.1.475.322.855.562s.906.468 1.561.463a2.8 2.8 0 0 0 1.165-.24c.481-.22.786-.499 1.036-.656.257-.16.421-.241.785-.248a1.3 1.3 0 0 1 .568.116c.234.1.472.307.844.553.366.244.902.482 1.573.475.452.001.846-.096 1.166-.24.482-.22.786-.499 1.037-.656.257-.16.421-.242.784-.248.246-.003.537.101.757.222.11.06.202.121.262.165l.067.05.059.047c.372.277.969.66 1.807.66h.034c.76-.014 1.408-.365 1.967-.715a7.58 7.58 0 0 0 .725-.53l.062-.051h.188l1.433 2.652z"
//           fill="${svgColor}"></path>
//         <path d="M19.037 3.009c.69.018 1.345.408 1.689 1.007l15.353 28.466c.602 1.188-.261 2.848-1.722 2.883H3.65c-1.335-.032-2.377-1.591-1.721-2.883L17.282 4.016a1.95 1.95 0 0 1 1.755-1.007z"
//           fill="none" stroke="#f18700" stroke-width="1.15"></path>
//       </svg>
//     `;
//   };

app.listen(port, () => console.log(`App listening on port ${port}!`));
