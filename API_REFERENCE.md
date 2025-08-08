# Osoora AI Chatbot - API Reference

This document provides a detailed reference for the Osoora AI Chatbot backend API.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Most endpoints require authentication using a Bearer token. The token must be included in the `Authorization` header of your requests.

**Example:** `Authorization: Bearer <your-token>`

---

## Authentication Endpoints

### 1. Register a New User

*   **Endpoint:** `POST /api/auth/register`
*   **Description:** Creates a new user account.
*   **Authentication:** Not required.
*   **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": "User registered successfully",
      "token": "string",
      "user": {
        "username": "string",
        "email": "string",
        "user_id": "string"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Missing required fields.
    *   `409 Conflict`: User with this email or username already exists.

### 2. Log In a User

*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates a user and returns a token.
*   **Authentication:** Not required.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "Login successful",
      "token": "string",
      "user": {
        "user_id": "string",
        "username": "string",
        "email": "string",
        "preferences": {
          "theme": "string",
          "last_active_conversation": "string"
        }
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Email or password not provided.
    *   `401 Unauthorized`: Invalid credentials.

---

## Conversation Endpoints

### 1. Get All Conversations

*   **Endpoint:** `GET /api/conversations`
*   **Description:** Retrieves all conversations for the authenticated user.
*   **Authentication:** Required.
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "string",
        "topic": "string",
        "preview": "string",
        "timestamp": "date",
        "messages": [
          {
            "role": "string",
            "content": "string"
          }
        ]
      }
    ]
    ```

### 2. Get a Single Conversation

*   **Endpoint:** `GET /api/conversations/:conversationId`
*   **Description:** Retrieves a specific conversation by its ID.
*   **Authentication:** Required.
*   **Response (200 OK):**
    ```json
    {
      "id": "string",
      "topic": "string",
      "preview": "string",
      "timestamp": "date",
      "messages": [
        {
          "role": "string",
          "content": "string"
        }
      ]
    }
    ```
*   **Error Responses:**
    *   `404 Not Found`: Conversation not found.

### 3. Save Conversations

*   **Endpoint:** `POST /api/conversations/save`
*   **Description:** Saves the entire list of conversations for the authenticated user. This will overwrite any existing conversations.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
      "conversations": [
        {
          "id": "string",
          "topic": "string",
          "preview": "string",
          "timestamp": "date",
          "messages": [
            {
              "role": "string",
              "content": "string"
            }
          ]
        }
      ]
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "Conversations saved successfully",
      "count": "number"
    }
    ```

### 4. Clear All Conversations

*   **Endpoint:** `DELETE /api/conversations/clear`
*   **Description:** Deletes all conversations for the authenticated user.
*   **Authentication:** Required.
*   **Response (200 OK):**
    ```json
    {
      "message": "All conversations deleted successfully",
      "deletedCount": "number"
    }
    ```

---

## User Preferences Endpoints

### 1. Get User Preferences

*   **Endpoint:** `GET /api/user/preferences`
*   **Description:** Retrieves the preferences for the authenticated user.
*   **Authentication:** Required.
*   **Response (200 OK):**
    ```json
    {
      "preference_id": "string",
      "user_id": "string",
      "theme": "string",
      "last_active_conversation": "string",
      "created_at": "date",
      "updated_at": "date"
    }
    ```

### 2. Update User Preferences

*   **Endpoint:** `PUT /api/user/preferences`
*   **Description:** Updates the preferences for the authenticated user.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
      "theme": "string", // "light", "dark", or "system"
      "last_active_conversation": "string"
    }
    ```
*   **Response (200 OK):** The updated preferences object.

---

## User Profile Endpoints

### 1. Update User Profile

*   **Endpoint:** `PUT /api/user/profile`
*   **Description:** Updates the username and/or password for the authenticated user.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
      "username": "string", // Optional
      "current_password": "string", // Optional, required if changing password
      "new_password": "string" // Optional
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "user_id": "string",
        "username": "string",
        "email": "string"
      }
    }
    ```

---

## Chat Proxy Endpoint

### 1. Send a Message to the Chatbot

*   **Endpoint:** `POST /api/chat`
*   **Description:** Sends a message to the Dashscope AI service and streams the response back.
*   **Authentication:** Not required (but recommended to associate with a user).
*   **Request Body:**
    ```json
    {
      "message": "string",
      "conversationId": "string" // Optional
    }
    ```
*   **Response:** A stream of Server-Sent Events (SSE). Each event will contain a `data` field with a JSON object in the following format:
    ```json
    {
      "choices": [
        {
          "message": {
            "content": "string"
          }
        }
      ]
    }
    ```
    The stream is terminated by a `data: [DONE]` event.
