# Video Module Documentation

**Base URL**: `/api/v1/video`

## Endpoints

### 1. Get All Videos
- **Method**: `GET`
- **URL**: `/`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Query Params**:
    | Param | Type | Default | Description |
    |-------|------|---------|-------------|
    | `page` | number | 1 | Page number |
    | `limit` | number | 10 | Items per page |
    | `query` | string | - | Search term for title/description |
    | `sortBy` | string | latest | Sort order: `latest`, `oldest`, `views` |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "videos": [
          {
            "_id": "507f1f77bcf86cd799439012",
            "videoFile": "https://res.cloudinary.com/demo/video/upload/sample.mp4",
            "thumbnail": "https://res.cloudinary.com/demo/image/upload/thumb.jpg",
            "title": "My First Video",
            "description": "This is a sample video description",
            "duration": 125.5,
            "views": 1500,
            "isPublished": true,
            "owner": {
              "_id": "507f1f77bcf86cd799439011",
              "username": "johndoe",
              "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
            },
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
          }
        ],
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "totalVideos": 50
      },
      "message": "Successfully fetched all videos",
      "success": true
    }
    ```

### 2. Publish Video
- **Method**: `POST`
- **URL**: `/create`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Content-Type**: `multipart/form-data`
- **Body**:
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `title` | text | Yes | Video title |
    | `description` | text | Yes | Video description |
    | `video` | file | Yes | Video file |
    | `thumbnail` | file | Yes | Thumbnail image |

- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": {
        "_id": "507f1f77bcf86cd799439012",
        "videoFile": "https://res.cloudinary.com/demo/video/upload/sample.mp4",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/thumb.jpg",
        "title": "My Awesome Video",
        "description": "This is a detailed description of my awesome video.",
        "duration": 180.25,
        "views": 0,
        "isPublished": true,
        "owner": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      "message": "Video Published Successfully",
      "success": true
    }
    ```

### 3. Get Video By ID
- **Method**: `GET`
- **URL**: `/:videoId`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Params**:
    | Param | Type | Description |
    |-------|------|-------------|
    | `videoId` | string | MongoDB ObjectId of the video |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "507f1f77bcf86cd799439012",
        "videoFile": "https://res.cloudinary.com/demo/video/upload/sample.mp4",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/thumb.jpg",
        "title": "My First Video",
        "description": "This is a sample video description",
        "duration": 125.5,
        "views": 1500,
        "isPublished": true,
        "owner": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "avatar": "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      "message": "Video Found Successfully",
      "success": true
    }
    ```

### 4. Update Video
- **Method**: `PATCH`
- **URL**: `/:videoId`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Content-Type**: `multipart/form-data`
- **Params**:
    | Param | Type | Description |
    |-------|------|-------------|
    | `videoId` | string | MongoDB ObjectId of the video |
- **Body**:
    | Field | Type | Required | Description |
    |-------|------|----------|-------------|
    | `title` | text | Yes | Updated title |
    | `description` | text | Yes | Updated description |
    | `thumbnail` | file | Yes | New thumbnail image |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "507f1f77bcf86cd799439012",
        "videoFile": "https://res.cloudinary.com/demo/video/upload/sample.mp4",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/new_thumb.jpg",
        "title": "Updated Video Title",
        "description": "Updated video description.",
        "duration": 125.5,
        "views": 1500,
        "isPublished": true,
        "owner": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      },
      "message": "Video Details Updated Successfully",
      "success": true
    }
    ```

### 5. Delete Video
- **Method**: `DELETE`
- **URL**: `/:videoId`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Params**:
    | Param | Type | Description |
    |-------|------|-------------|
    | `videoId` | string | MongoDB ObjectId of the video |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "video deleted successfully",
      "success": true
    }
    ```

### 6. Toggle Publish Status
- **Method**: `PATCH`
- **URL**: `/toggle/publish/:videoId`
- **Headers**:
    | Header | Value |
    |--------|-------|
    | `Authorization` | `Bearer <accessToken>` |
- **Params**:
    | Param | Type | Description |
    |-------|------|-------------|
    | `videoId` | string | MongoDB ObjectId of the video |

- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "507f1f77bcf86cd799439012",
        "videoFile": "https://res.cloudinary.com/demo/video/upload/sample.mp4",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/thumb.jpg",
        "title": "My First Video",
        "description": "This is a sample video description",
        "duration": 125.5,
        "views": 1500,
        "isPublished": false,
        "owner": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T12:00:00.000Z"
      },
      "message": "Toggled Publish status successfully",
      "success": true
    }
    ```

## Error Responses

| Status Code | Message | Description |
|-------------|---------|-------------|
| 400 | Bad Request | Missing required fields |
| 403 | Forbidden | Not authorized to modify this video |
| 404 | Not Found | Video not found |
| 500 | Internal Server Error | Server error |
