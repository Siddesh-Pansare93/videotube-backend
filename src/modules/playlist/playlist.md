# Playlist Module Documentation

**Base URL**: `/api/v1/playlist`

## Endpoints

### 1. Create Playlist
- **Method**: `POST`
- **URL**: `/`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Body** (JSON):
    - `name` (string, required)
    - `description` (string, required)
- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": { ...playlistObject },
      "message": "Playlist created Successfully",
      "success": true
    }
    ```

### 2. Get User Playlists
- **Method**: `GET`
- **URL**: `/user/:userId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `userId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "name": "My Playlist",
              "playlistVideos": [ ... ],
              "playlistOwnerName": "johndoe",
              "description": "..."
          }
      ],
      "message": "User Playlist successfully found",
      "success": true
    }
    ```

### 3. Get Playlist By ID
- **Method**: `GET`
- **URL**: `/:playlistId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `playlistId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...playlistObject },
      "message": "Playlist found Successfully",
      "success": true
    }
    ```

### 4. Update Playlist
- **Method**: `PATCH`
- **URL**: `/:playlistId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Body** (JSON):
    - `name` (string, required)
    - `description` (string, required)
- **Params**:
    - `playlistId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...playlistObject },
      "message": "Successfully updated Playlist details",
      "success": true
    }
    ```

### 5. Delete Playlist
- **Method**: `DELETE`
- **URL**: `/:playlistId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `playlistId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "SuccessFully deleted Playlist",
      "success": true
    }
    ```

### 6. Add Video to Playlist
- **Method**: `PATCH`
- **URL**: `/add/:videoId/:playlistId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
    - `playlistId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...playlistObject },
      "message": "Video added to playlist successfully",
      "success": true
    }
    ```

### 7. Remove Video from Playlist
- **Method**: `PATCH`
- **URL**: `/remove/:videoId/:playlistId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
    - `playlistId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...playlistObject },
      "message": "Video removed successfully from playlist",
      "success": true
    }
    ```
