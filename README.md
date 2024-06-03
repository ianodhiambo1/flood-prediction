# Flood Prediction Application

This project is a web application designed to predict floods in specific locations and notify users about potential flood risks. It includes features for user registration, login, and receiving notifications based on flood predictions.

## Features

- **User Registration**: Users can sign up for an account by providing their email, password, location, and notification preferences.
- **User Authentication**: Registered users can log in to their accounts using their username and password.
- **Flood Prediction**: The application uses sensor data to predict flood risks in specific locations.
- **Notifications**: Users receive notifications about potential flood risks based on their selected notification preferences.
- **Responsive Design**: The application is designed to be responsive and accessible across various devices and screen sizes.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Password Hashing**: bcrypt
- **Session Management**: express-session

## Installation

1. Clone the repository:

```
git clone https://github.com/ianodhiambo1/flood-prediction
```

2. Install dependencies:

```
npm install
```

3. Set up MySQL database:

- Create a MySQL database and update the database configuration in `login.js` file.
- Run the SQL script provided in `database.sql` to create the required tables.

4. Start the application:

```
node app.js
```

5. Access the application in your web browser:

```
http://localhost:3000/
```

## Usage

- Navigate to the registration page (`/signup`) to create a new account.
- Log in to your account using the login page (`/`).
- After logging in, you will be redirected to the home page (`/home`), where you can view flood predictions and manage your account settings.
- You will receive notifications about potential flood risks based on your selected notification preferences.

## Contributing

Contributions are welcome! Please feel free to submit bug reports, feature requests, or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

---
