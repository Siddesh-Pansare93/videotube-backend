# User Module Documentation

**Base URL**: `/api/v1/users`

## Endpoints

### 1. Get Current User
- **Method**: `GET`
- **URL**: `/current-user`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Retrieves details of the currently logged-in user.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "...",
        "username": "...",
        "email": "...",
        "fullName": "...",
        "avatar": "...",
        "coverImage": "...",
        "watchHistory": [],
        "createdAt": "...",
        "updatedAt": "..."
      },
      "message": "Current user fetched Successfully",
      "success": true
    }
    ```

### 2. Update Account Details
- **Method**: `PATCH`
- **URL**: `/update-profile`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Body** (JSON):
    - `fullName` (string, required)
    - `email` (string, required)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...userObject },
      "message": "Account details updated succesfully",
      "success": true
    }
    ```

### 3. Update Avatar
- **Method**: `POST`
- **URL**: `/update-avatar`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**:
    - `avatar` (file, required)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...userObject },
      "message": "Avatar updated Succesfully",
      "success": true
    }
    ```

### 4. Update Cover Image
- **Method**: `POST`
- **URL**: `/update-coverimage`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**:
    - `coverImage` (file, required)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...userObject },
      "message": "Cover Image updated Succesfully",
      "success": true
    }
    ```

### 5. Get Channel Profile
- **Method**: `GET`
- **URL**: `/channelprofile/:username`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `username` (string)
- **Description**: Gets public profile of a user (channel), including subscriber count.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {
        "username": "...",
        "fullName": "...",
        "avatar": "...",
        "coverImage": "...",
        "subscriberCount": 10,
        "channelsubscribedToCount": 5,
        "isSubscribed": false
      },
      "message": "User channel fetched Successfully",
      "success": true
    }
    ```

### 6. Get Watch History
- **Method**: `GET`
- **URL**: `/watchhistory`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Gets list of videos watched by current user.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "_id": "...",
              "videoFile": "...",
              "thumbnail": "...",
              "title": "...",
              "owner": { ... }
          }
      ],
      "message": "User watch history fetched Successfully",
      "success": true
    }
    ```
