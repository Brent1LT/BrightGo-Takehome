# Event Scheduler API

## Overview

This is an Express-based API for managing event schedules. The API allows you to:
- Create, update, and retrieve event schedules.
- Print event schedules for a given date range.
- Use mock event data for testing.

## Prerequisites

- **Node.js** and **npm** should be installed on your machine. You can download and install Node.js from [here](https://nodejs.org/).

- This project uses Express.js as a backend framework.

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/Brent1LT/BrightGo-Takehome.git
    cd BrightGo-Takehome
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. **Mock Data (Optional)**:
   - You can use mock event data by including the `MOCK_EVENTS` object in the code. This is especially useful for testing and running the API without needing a database.

## Running the Application

1. **Start the server**:
   - Run the following command to start the server:

    ```bash
    npm start
    ```

    This will start the Express server on port `8080`.

2. **Verify the server is running**:
   - You can test if the server is running by visiting `http://localhost:8080/` in your browser or using a tool like [Postman](https://www.postman.com/) or `curl`.

    Example response:
    
    ```json
    {
      "message": "This is the Home page!"
    }
    ```

## Endpoints

Once the server is live, any of the endpoints are avaiable to take requests at `http://localhost:8080/` which can be done in Postman or via a curl request.
I will provide example curl requests for each endpoint.

### 1. **POST /events/schedule**

This endpoint allows you to schedule a new event. Analogous to `schedule_event_for_employee`

#### Request Body:

```json
{
  "employee_id": 1,
  "start_date": "2024-12-28",
  "end_date": "2024-12-30"
}
```

#### Response:
Returns an event object as JSON with some properties on that event object.

```json
{
  "id": 1,
  "employee_id": 1,
  "start_date": "2024-12-28T00:00:00.000Z",
  "end_date": "2024-12-30T00:00:00.000Z",
  "schedule": {}
}
```

#### Example curl request:
```bash
curl -X POST http://localhost:8080/events/schedule \
-H "Content-Type: application/json" \
-d '{
  "employee_id": 1,
  "start_date": "2024-12-28",
  "end_date": "2024-12-30"
}'
```

### 2. **PATCH /events/override**

This endpoint allows you to override an existing event schedule. Analogous to `schedule_override_for_event`

#### Request Body:

```json
{
  "event_id": 1,
  "override_employee_id": 2,
  "override_start_date": "2024-12-29",
  "override_end_date": "2024-12-31",
  "override_type": "TODAY_ONLY"
}
```

#### Response:

```json
{
  "id": 1,
  "employee_id": 2,
  "start_date": "2024-12-28T00:00:00.000Z",
  "end_date": "2024-12-30T00:00:00.000Z",
  "schedule": {
    "2024-12-29": 3
  }
}
```

#### Example curl request:
```bash
curl -X POST http://localhost:8080/events/override \
-H "Content-Type: application/json" \
-d '{
  "event_id": 1,
  "override_employee_id": 2,
  "override_start_date": "2024-12-29",
  "override_end_date": "2024-12-31",
  "override_type": "TODAY_ONLY"
}'
```

### 3. **POST /events/print**

This endpoint allows you to print the schedule for a given date range. Analogous to `print_events_for_range`

#### Request Body:

```json
{
  "start_date": "2024-12-28",
  "num_days": 14
}
```

#### Response:

```json
{
  "response": "Printing the schedule for 2024-12-28 to 2025-01-10\n==========2024-12-28==========\nEvent 1 | 2024-12-28 | Employee 1\n==========2024-12-29==========\nEvent 1 | 2024-12-29 | Employee 1\n==========2024-12-30==========\nEvent 1 | 2024-12-30 | Employee 1"
}
```

#### Example curl request:
```bash
curl -X POST http://localhost:8080/events/print \
-H "Content-Type: application/json" \
-d '{
  "start_date": "2024-12-28",
  "num_days": 14
}'
```

## Mock Events Data

There is a file `mockEvents.js` that has mock data for a handful of events which can then be used to do operations on by the existing endpoints.
It is setup to start from scratch each time the server is started but if you wanted to use the mock events, change line 10 of `index.js` to:

```
const EVENTS = MOCK_EVENTS;
```
Don't forget to restart the server if it was running. 