# Tweet Module Documentation

**Base URL**: `/api/v1/tweet`

## Endpoints

### 1. Create Tweet
- **Method**: `POST`
- **URL**: `/`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Body** (JSON):
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `content` | string | Yes | Tweet content |

- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": {
        "_id": "507f1f77bcf86cd799439015",
        "content": "Hello everyone! This is my first tweet. 🚀",
        "owner": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      "message": "Tweet created successfully",
      "success": true
    }
    ```

### 2. Get User Tweets
- **Method**: `GET`
- **URL**: `/user`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Description**: Gets all tweets for the currently logged-in user.

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
        {
          "_id": "507f1f77bcf86cd799439015",
          "content": "Hello everyone! This is my first tweet. 🚀",
          "owner": {
            "_id": "507f1f77bcf86cd799439011",
            "username": "johndoe",
            "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
          },
          "createdAt": "2024-01-15T10:30:00.000Z",
          "updatedAt": "2024-01-15T10:30:00.000Z"
        },
        {
          "_id": "507f1f77bcf86cd799439016",
          "content": "Another day, another tweet! ☀️",
          "owner": {
            "_id": "507f1f77bcf86cd799439011",
            "username": "johndoe",
            "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
          },
          "createdAt": "2024-01-16T09:00:00.000Z",
          "updatedAt": "2024-01-16T09:00:00.000Z"
        }
      ],
      "message": "User tweets found",
      "success": true
    }
    ```

### 3. Update Tweet
- **Method**: `PATCH`
- **URL**: `/:tweetId`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Params**:
    | Param | Type | Description |
    |-------|------|-------------|
    | `tweetId` | string | MongoDB ObjectId of the tweet |
- **Body** (JSON):
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `content` | string | Yes | Updated tweet content |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "507f1f77bcf86cd799439015",
        "content": "Updated tweet content! 📝",
        "owner": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      },
      "message": "Tweet updated successfully",
      "success": true
    }
    ```

### 4. Delete Tweet
- **Method**: `DELETE`
- **URL**: `/:tweetId`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Params**:
    | Param | Type | Description |
    |-------|------|-------------|
    | `tweetId` | string | MongoDB ObjectId of the tweet |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "507f1f77bcf86cd799439015",
        "content": "Updated tweet content! 📝",
        "owner": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      },
      "message": "Tweet deleted successfully",
      "success": true
    }
    ```

## Error Responses

| Status Code | Message | Description |
|-------------|---------|-------------|
| 400 | Bad Request | Content is empty or invalid |
| 404 | Not Found | Tweet not found |
| 500 | Internal Server Error | Server error |
