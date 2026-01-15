# Tweet Module Documentation

**Base URL**: `/api/v1/tweet`

## Endpoints

### 1. Create Tweet
- **Method**: `POST`
- **URL**: `/`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Body** (JSON):
    - `content` (string, required)
- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": { ...tweetObject },
      "message": "Tweet created successfully",
      "success": true
    }
    ```

### 2. Get User Tweets
- **Method**: `GET`
- **URL**: `/user`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Description**: Gets all tweets for the currently logged-in user.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "content": "Hello World",
              "owner": "userId",
              "createdAt": "..."
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
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `tweetId` (string)
- **Body** (JSON):
    - `content` (string, required)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...tweetObject },
      "message": "Tweet updated successfully",
      "success": true
    }
    ```

### 4. Delete Tweet
- **Method**: `DELETE`
- **URL**: `/:tweetId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `tweetId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "Tweet deleted successfully",
      "success": true
    }
    ```
