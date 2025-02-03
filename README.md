# User Authentication System

This project implements the backend logic for handling user login, registration, and logout. It includes API endpoints for authentication, user management, and basic error handling, with a focus on security and integration with the frontend.

## Features

- **Login API**: Authenticates users based on username/email and password.
- **Logout API**: Logs out users by invalidating sessions or tokens.
- **User Registration API**: Allows new users to register.
- **Error Handling**: Provides error messages for invalid credentials, unauthorized access, and non-existent routes.
- **Security**: Implements input validation, rate limiting
- **Frontend Integration**: Compatible with frontend applications for user login, register and logout functionalities.

## Endpoints

### Authentication Routes (`/auth`)

- **POST `/register`**: Register a new user.

  - Request Body:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - Response:

    ```json
    {
      "AccessToken": "string",
      "user": {
        "id": 1,
        "name": "string",
        "email": "string"
      }
    }
    ```

  - Error Response (User already exists):
    ```json
    {
      "message": "User already exists"
    }
    ```

- **POST `/login`**: Log in a user.

  - Request Body:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "AccessToken": "string",
      "user": {
        "id": 1,
        "name": "string",
        "email": "string"
      }
    }
    ```
  - Error Response (Invalid credentials):
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- **POST `/logout`**: Log out a user by invalidating their session/token.

  - Response:

    ```json
    {
      "message": "Logged out"
    }
    ```

  - Error Response (Unauthorized):
    ```json
    {
      "message": "Unauthorized"
    }
    ```

- **POST `/auth/*`**: For any other unmatched routes under `/auth`, returns `404`.
  - Response:
    ```json
    {
      "error": "Not Found"
    }
    ```

### Security & Authentication Features

- **Token-based Authentication**:

  - JWT is used for authenticating and securing user sessions.
  - The login process generates an **AccessToken** with a 15-minute expiration.
  - A **RefreshToken** is stored in a secure cookie (with the `httpOnly`, `secure`, and `sameSite: 'none'` flags) to enable session persistence and token renewal.
  - The **RefreshToken** expires in 7 days.

- **Logout Process**:

  - The **logout** endpoint invalidates the user's session by clearing the refresh token cookie.
  - The response will be a confirmation message upon successful logout.

- **Error Handling**:
  - Both login and registration return specific error messages (e.g., "Invalid credentials" or "User already exists") to help guide users through any issues during authentication.

## Security Considerations

- **Input Validation**: All input fields (e.g., username, password) are validated and sanitized to prevent SQL injection, XSS, and other forms of attack.
- **HTTPS**: Ensure the server uses HTTPS to encrypt communication and protect sensitive user data.
- **Rate Limiting**: Implement rate limiting for login attempts to prevent brute-force attacks.
- **Token-based Authentication**: JWT (JSON Web Tokens) are used for maintaining user sessions after login. The **RefreshToken** is stored in a secure cookie to allow users to stay logged in without re-entering their credentials frequently.

<hr>

## Set up environment variables (e.g., database credentials, JWT secret, etc.) in a .env file:

```bash
PORT =
DB_PASSWORD =
DB_USER =
DB_NAME =
DB_HOST =
DB_PORT =

ACCESS_TOKEN =
REFRESH_TOKEN =
```

## Demo Video
