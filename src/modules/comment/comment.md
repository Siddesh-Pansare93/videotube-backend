# Comment Module Documentation

**Base URL**: `/api/v1/comment`

## Endpoints

### 1. Get Video Comments
- **Method**: `GET`
- **URL**: `/:videoId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
- **Query Params**:
    - `page` (number, default: 1)
    - `limit` (number, default: 10)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "content": "Nice video!",
              "video": "...",
              "owner": { ... },
              "createdAt": "..."
          }
      ],
      "message": "Successfully fetched Comment for this Video",
      "success": true
    }
    ```

### 2. Add Comment
- **Method**: `POST`
- **URL**: `/:videoId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `videoId` (string)
- **Body** (JSON):
    - `content` (string, required)
- **Response**: `201 Created`
    ```json
    {
      "statusCode": 201,
      "data": {
          "_id": "...",
          "content": "Nice video!",
          "video": "...",
          "owner": "..."
      },
      "message": "Successfully added Comment",
      "success": true
    }
    ```

### 3. Update Comment
- **Method**: `PATCH`
- **URL**: `/c/:commentId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `commentId` (string)
- **Body** (JSON):
    - `content` (string, required)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { ...commentObject },
      "message": "Successfully updated comment",
      "success": true
    }
    ```

### 4. Delete Comment
- **Method**: `DELETE`
- **URL**: `/c/:commentId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `commentId` (string)
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": {},
      "message": "Successfully deleted comment",
      "success": true
    }
    ```
