# Like Module Documentation

**Base URL**: `/api/v1/like`

## Endpoints

### 1. Toggle Video Like
- **Method**: `GET` (Using GET to toggle as per routes, though POST is conventional)
- **URL**: `/toggle/video/:videoId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
- **Description**: Likes a video if not liked, or unlikes if already liked.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": null, // or like object
      "message": "Successfully Liked Video", // or Toggled video Like successfully
      "success": true
    }
    ```

### 2. Toggle Comment Like
- **Method**: `GET`
- **URL**: `/toggle/comment/:commentId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `commentId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": null,
      "message": "Successfully Liked Comment",
      "success": true
    }
    ```

### 3. Toggle Tweet Like
- **Method**: `GET`
- **URL**: `/toggle/tweet/:tweetId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `tweetId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": null,
      "message": "Successfully Liked Tweet",
      "success": true
    }
    ```

### 4. Get Liked Videos
- **Method**: `GET`
- **URL**: `/videos`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Fetches all videos liked by the current user.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "_id": "...",
              "likedBy": { ... },
              "videoDetails": [ ... ]
          }
      ],
      "message": "SuccessFully fetched Liked Videos",
      "success": true
    }
    ```
