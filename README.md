# Osoora AI Chatbot

Osoora AI Chatbot is a full-stack web application that provides a user-friendly interface for interacting with an AI-powered chatbot. It features user authentication, chat history management, and a real-time, streaming chat experience. The backend is built with Node.js, Express, and MongoDB, and it uses the Dashscope AI service for chat functionality.

## Key Features

*   **User Authentication:** Secure user registration and login system with password hashing.
*   **Persistent Chat History:** Conversations are saved to a MongoDB database and can be accessed across sessions.
*   **Real-time Chat:** Messages are sent and received in real-time, with a typing indicator for a better user experience.
*   **Streaming Responses:** AI responses are streamed from the backend, providing immediate feedback to the user.
*   **Markdown Support:** The chatbot can format its responses using Markdown, including support for code blocks with syntax highlighting.
*   **Theme Customization:** Users can switch between light and dark themes.
*   **RESTful API:** A well-defined API for managing users, conversations, and preferences.

## Project Architecture

The application is divided into two main parts:

*   **Frontend:** A vanilla JavaScript single-page application that handles the user interface and interacts with the backend API.
*   **Backend:** A Node.js server built with Express.js that provides a RESTful API and acts as a proxy to the Dashscope AI service.

### Technologies Used

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   Vanilla JavaScript (ES6+)
    *   [axios](https://axios-http.com/) for HTTP requests
    *   [marked](https://marked.js.org/) for Markdown rendering
    *   [highlight.js](https://highlightjs.org/) for syntax highlighting

*   **Backend:**
    *   [Node.js](https://nodejs.org/)
    *   [Express.js](https://expressjs.com/)
    *   [MongoDB](https://www.mongodb.com/) with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    *   [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
    *   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for authentication
    *   [Dashscope AI](https://help.aliyun.com/product/2587624.html) for chat functionality

## Setup and Installation

To run the Osoora AI Chatbot locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd osoora-ai-chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:
    ```
    PORT=5101
    MONGODB_USERNAME=<your-mongodb-username>
    MONGODB_PASSWORD=<your-mongodb-password>
    MONGODB_CLUSTER_URL=<your-mongodb-cluster-url>
    DASHSCOPE_API_KEY=<your-dashscope-api-key>
    DASHSCOPE_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```

5.  **Open the application:**
    Open your web browser and navigate to `http://localhost:5101`.
