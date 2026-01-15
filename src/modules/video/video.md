# Video Module Documentation

**Base URL**: `/api/v1/video`

## Endpoints

### 1. Get All Videos
- **Method**: `GET`
- **URL**: `/`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Query Params**:
    - `page` (number, default: 1)
    - `limit` (number, default: 10)
    - `query` (string, search term)
    - `sortBy` (string: `latest`, `oldest`, `views`)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "videos": [ ... ],
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
    - `Authorization`: `Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**:
    - `title` (text, required)
    - `description` (text, required)
    - `video` (file, required)
    - `thumbnail` (file, required)
- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": {
        "_id": "...",
        "videoFile": "http://...",
        "thumbnail": "http://...",
        "title": "Example Video",
        "description": "...",
        "duration": 120,
        "views": 0,
        "isPublished": true,
        "owner": "..."
      },
      "message": "Video Published Successfully",
      "success": true
    }
    ```

### 3. Get Video By ID
- **Method**: `GET`
- **URL**: `/:videoId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...videoObject },
      "message": "Video Found Successfully",
      "success": true
    }
    ```

### 4. Update Video
- **Method**: `PATCH`
- **URL**: `/:videoId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**:
    - `title` (text, required)
    - `description` (text, required)
    - `thumbnail` (file, required)
- **Params**:
    - `videoId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...videoObject },
      "message": "Video Details Updated Successfully",
      "success": true
    }
    ```

### 5. Delete Video
- **Method**: `DELETE`
- **URL**: `/:videoId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
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
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...videoObject, "isPublished": false },
      "message": "Toggled Publish status successfully",
      "success": true
    }
    ```
