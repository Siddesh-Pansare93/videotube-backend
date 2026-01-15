# HealthCheck Module Documentation

**Base URL**: `/api/v1/healthcheck`

## Endpoints

### 1. Health Check
- **Method**: `GET`
- **URL**: `/`
- **Description**: Returns the operational status of the service.
- **Response**: `200 OK`
    ```json
    {
      "statusCode": 200,
      "data": "OK",
      "message": "Health Check Passed",
      "success": true
    }
    ```
