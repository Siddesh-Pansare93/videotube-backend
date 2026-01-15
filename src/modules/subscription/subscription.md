# Subscription Module Documentation

**Base URL**: `/api/v1/subscription`

## Endpoints

### 1. Toggle Subscription
- **Method**: `POST`
- **URL**: `/c/:channelId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `channelId` (string, the ID of the channel to subscribe/unsubscribe)
- **Description**: Subscribes to a channel if not subscribed, or unsubscribes if already subscribed.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": { "subscribed": true }, // or false
      "message": "Subscription toggled successfully",
      "success": true
    }
    ```

### 2. Get User Channel Subscribers
- **Method**: `GET`
- **URL**: `/c/:channelId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `channelId` (string)
- **Description**: Returns a list of users who have subscribed to the given channel.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "username": "subscriberUser",
              "avatar": "...",
              "fullName": "..."
          }
      ],
      "message": "user channel subscribers fetched Successfully",
      "success": true
    }
    ```

### 3. Get Subscribed Channels
- **Method**: `GET`
- **URL**: `/u/:subscriberId`
- **Headers**:
    - `Authorization`: `Bearer <accessToken>`
- **Params**:
    - `subscriberId` (string)
- **Description**: Returns a list of channels that the given user has subscribed to.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": [
          {
              "username": "channelUser",
              "avatar": "...",
              "fullName": "..."
          }
      ],
      "message": "SuccessFully fetched user Subscribed Channels",
      "success": true
    }
    ```
