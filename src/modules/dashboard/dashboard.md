# Dashboard Module Documentation

**Base URL**: `/api/v1/dashboard`

## Endpoints

### 1. Get Channel Stats
- **Method**: `GET`
- **URL**: `/stats`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Returns total views, subscribers, videos, and likes for the user's channel.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "totalViews": 100,
        "totalSubscribers": 5,
        "totalVideos": 10,
        "totalLikes": 50
      },
      "message": "User channel stats fetched Successfully",
      "success": true
    }
    ```

### 2. Get Channel Videos
- **Method**: `GET`
- **URL**: `/videos`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Returns all videos uploaded by the user.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "_id": "65a...",
              "videoFile": "http://...",
              "thumbnail": "http://...",
              "title": "My Video",
              "isPublished": true,
              "createdAt": "..."
          }
      ],
      "message": "Channel videos fetched successfully",
      "success": true
    }
    ```
