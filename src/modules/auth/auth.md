# Auth Module Documentation

**Base URL**: `/api/v1/users`

## Endpoints

### 1. Register User
- **Method**: `POST`
- **URL**: `/register`
- **Description**: Registers a new user with avatar and optional cover image.
- **Content-Type**: `multipart/form-data`
- **Body**:
    - `fullName` (text, required)
    - `email` (text, required)
    - `username` (text, required)
    - `password` (text, required)
    - `avatar` (file, required)
    - `coverImage` (file, optional)
- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": {
        "_id": "678...",
        "username": "exampleUser",
        "email": "example@email.com",
        "fullName": "Example User",
        "avatar": "http://...",
        "coverImage": "http://...",
        "watchHistory": [],
        "createdAt": "...",
        "updatedAt": "..."
      },
      "message": "User created Successfully",
      "success": true
    }
    ```

### 2. Login User
- **Method**: `POST`
- **URL**: `/login`
- **Description**: Logs in a user.
- **Content-Type**: `application/json`
- **Body**:
    - `email` (string, optional if username provided)
    - `username` (string, optional if email provided)
    - `password` (string, required)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "user": { ... },
        "accessToken": "ey...",
        "refreshToken": "ey..."
      },
      "message": "User logged In Successfully",
      "success": true
    }
    ```

### 3. Logout User
- **Method**: `POST`
- **URL**: `/logout`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Logs out the current user (clears cookies/token).
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "User Logged Out",
      "success": true
    }
    ```

### 4. Refresh Token
- **Method**: `POST`
- **URL**: `/refresh-token`
- **Description**: Refreshes access token using refresh token in cookies or body.
- **Body** (JSON, Optional if in cookies):
    - `refreshToken` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "accessToken": "ey...",
        "refreshToken": "ey..."
      },
      "message": "Access Token refreshed Successfully",
      "success": true
    }
    ```

### 5. Change Password
- **Method**: `POST`
- **URL**: `/change-password`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Body** (JSON):
    - `oldPassword` (string)
    - `newPassword` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "Password Changed Successfully",
      "success": true
    }
    ```
