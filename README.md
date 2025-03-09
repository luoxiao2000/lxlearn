# Video Learning Platform

A modern, clean, and user-friendly video learning website built with Next.js and Tailwind CSS. This platform focuses on essential features that enhance the learning experience without unnecessary complexity.

## Features

### Authentication
- Simple login system with hardcoded credentials
- Secure user sessions
- Username: `admin`, Password: `password123`

### Dashboard/Home Page
- Learning summary showing progress across courses
- "Continue Learning" section highlighting recently accessed courses
- Clean course catalog organized by subject

### Video Player
- Full-featured video playback of course content
- Remembers playback position for each course
- Simple playback controls (play/pause, volume, fullscreen, speed)

### Learning History
- Tracks and displays user's learning history
- Records watch progress for each video
- Shows completion status for courses

## Technical Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: localStorage for user authentication state and learning progress
- **Video Player**: react-player

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and data handling
- `/src/styles`: Global styles and Tailwind configuration
- `/public`: Static assets

## Login Credentials

- Username: `admin`
- Password: `password123`

## License

This project is licensed under the MIT License. 