# Auth Module Documentation

**Base URL**: `/api/v1/users`

## Endpoints

### 1. Register User
- **Method**: `POST`
- **URL**: `/register`
- **Description**: Registers a new user with avatar and optional cover image.
- **Content-Type**: `multipart/form-data`
- **Body**:
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `fullName` | text | Yes | User's full name |
    | `email` | text | Yes | User's email address |
    | `username` | text | Yes | Unique username |
    | `password` | text | Yes | User's password |
    | `avatar` | file | Yes | Profile picture |
    | `coverImage` | file | No | Cover image for profile |

- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "fullName": "John Doe",
        "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
        "coverImage": "https://res.cloudinary.com/demo/image/upload/cover.jpg",
        "watchHistory": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      "message": "User created Successfully",
      "success": true
    }
    ```

### 2. Login User
- **Method**: `POST`
- **URL**: `/login`
- **Description**: Logs in a user and returns access/refresh tokens.
- **Content-Type**: `application/json`
- **Body**:
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `email` | string | No* | User's email (*required if username not provided) |
    | `username` | string | No* | User's username (*required if email not provided) |
    | `password` | string | Yes | User's password |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "user": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "email": "johndoe@example.com",
          "fullName": "John Doe",
          "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
          "coverImage": "https://res.cloudinary.com/demo/image/upload/cover.jpg",
          "watchHistory": [],
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJmdWxsTmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA1MzE0MjAwLCJleHAiOjE3MDUzMTc4MDB9.xxxxx",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDUzMTQyMDAsImV4cCI6MTcwNjE3ODIwMH0.xxxxx"
      },
      "message": "User logged In Successfully",
      "success": true
    }
    ```
- **Cookies Set**:
    - `accessToken`: HTTP-only, secure cookie
    - `refreshToken`: HTTP-only, secure cookie

### 3. Logout User
- **Method**: `POST`
- **URL**: `/logout`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Description**: Logs out the current user and clears tokens.
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
- **Description**: Refreshes access token using refresh token from cookies or body.
- **Body** (JSON, Optional if refresh token in cookies):
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `refreshToken` | string | No | Refresh token (if not in cookies) |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      "message": "Access Token refreshed Successfully",
      "success": true
    }
    ```

### 5. Change Password
- **Method**: `POST`
- **URL**: `/change-password`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Body** (JSON):
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `oldPassword` | string | Yes | Current password |
    | `newPassword` | string | Yes | New password |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "Password Changed Successfully",
      "success": true
    }
    ```

## Error Responses

All endpoints may return the following error responses:

| Status Code | Message | Description |
|-------------|---------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Invalid credentials or token |
| 409 | Conflict | User already exists |
| 500 | Internal Server Error | Server error |

**Error Response Format**:
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "success": false,
  "errors": []
}
```
