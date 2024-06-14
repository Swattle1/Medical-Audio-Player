# Medical Consultation Audio Player

Medical Consultation Audio player built to play audio files of doctor - robot - patient consultations, and display them in a suitable manner.

## Features

- Audio Player: Play audio files of doctor - robot - patient consultations.

- Consultation page: Select a consultation to play.

- Settings: Change the conversation party combination for playback of audio files and dark mode toggle.

## Prerequisites

- NET 6.0 Long Term Support SDK
- Node.js version 20.12.2 or later.
- Visual Studio for backend development
- Visual Studio Code or another preferred editor for frontend development

## Installation

### Clone the Repository
First, clone the repository to your local machine:

https://github.com/Swattle1/Medical-Audio-Player.git

- cd Medical-Audio-Player

### Backend Setup
Navigate to the backend directory and restore the .NET dependencies or run in Visual Studio:

- cd backend

- dotnet restore

Run the backend server:

- dotnet run

- Upon Starting the backend it should display the ports it is listening on:
![alt text](image.png)

### Frontend Setup
Before starting the frontend, ensure that the backend server is running and note the port it is listening on (e.g., 7205, 5001, or another default value). You may need to manually update the `REACT_APP_API_URL` value in the frontend `.env` file to match the backend port before proceeding.

Navigate to the frontend directory within the cloned repository.

- cd frontend

- npm install

This will install all necessary dependencies.

Now start the Application frontend:

- npm start

This should show you something like this: 

![alt text](image-1.png)

## Usage

Once the server backend is running, you can access the API at the following endpoints:

- React App: (http://localhost:3000)
- SwaggerUI Documentation: (https://localhost:7205/index.html) or (https://localhost:7205/) or (https://localhost:5001/index.html)

