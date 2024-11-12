# Text-to-Speech Web Application

This is a full-stack web application that converts text to speech. The application allows users to input text, provide a URL, or upload a file to convert the text content into audio. The project is divided into two main parts: **Frontend** and **Backend**.

## Features
- **User Authentication**: Users can log in to access the text-to-speech features.
- **Text Input**: Users can type in text to convert to speech.
- **URL Input**: Users can provide a URL to fetch and convert its text content to speech.
- **File Upload**: Users can upload a text file, and its content will be converted to speech.
- **Audio Playback**: The converted text is played back as audio.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, React
- **Backend**: Node.js, Express
- **API**: Google Text-to-Speech API
- **Database**: To store user credentials (e.g., MongoDB or SQL database, depending on implementation)
- **Axios**: For making HTTP requests to the backend

---

## Project Structure

### Backend (`TTS_Backend`)
The backend handles user authentication, fetches text content from URLs, and interacts with the Google Text-to-Speech API to generate audio.

#### Key Files and Folders
- `app.js`: Main application file that sets up the Express server.
- `routes/`: Contains the API routes for user authentication, text-to-speech conversion, and more.
- `helpers/`: Contains helper functions for processing and interacting with the API.
- `package.json`: Lists backend dependencies (e.g., `express`, `axios`, `dotenv`).

### Frontend (`TTS_Frontend`)
The frontend provides the user interface for the application, where users can log in, input text, provide a URL, or upload a file.

#### Key Files and Folders
- `src/`: Contains React components and pages.
- `public/`: Contains static files and the base HTML template.
- `package.json`: Lists frontend dependencies (e.g., `react`, `axios`).

---

## Setup and Installation

### Prerequisites
- Node.js and npm installed on your machine
- A Google Cloud account and access to the Google Text-to-Speech API

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/username/TTS_Backend.git
   cd TTS_Backend
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a .env file in the root directory and add your environment variables (e.g., API keys, database credentials). Start the server:
    ```bash
     npm start
    ```

### Frontend Setup
1. Clone the frontend repository:
    ```bash
    git clone https://github.com/username/TTS_Frontend.git
    cd TTS_Frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm start
    ```

---

## Usage
- Register or log in to the application.
- Enter text, a URL, or upload a file to convert it to speech.
- Click "Convert" to generate the audio, which will be played back in the browser.
  
## Future Improvements
- Implement real-time text-to-speech for larger text inputs.
- Improve UI for better user experience.
