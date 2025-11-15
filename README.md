# Nuit de l'Info - Registration Form

A modern, lightweight web application for collecting participant registrations with duplicate prevention.

## Features

- ✅ Form validation
- ✅ Duplicate matricule prevention (both client and server-side)
- ✅ Google Sheets integration (FREE - using Google Apps Script)
- ✅ Modern, responsive UI/UX
- ✅ Local storage persistence (backup)
- ✅ Clean and simple design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Form Fields

- **Matricule**: Unique identifier (required, case-insensitive)
- **Name**: Full name (required)
- **Work Area**: Choose from Front-end, Back-end, Documentation, or Deployment
- **Technologies**: Select multiple technologies you know

## Google Sheets Integration (FREE)

The app can send submissions directly to your Google Sheet. Here's how to set it up:

### Step 1: Deploy Google Apps Script

1. Open your Google Sheet: [https://docs.google.com/spreadsheets/d/1Z_27ttnn6Gv2NHz3niSL0BrL2nm7YgtRifLEOl8HZG0/edit](https://docs.google.com/spreadsheets/d/1Z_27ttnn6Gv2NHz3niSL0BrL2nm7YgtRifLEOl8HZG0/edit)

2. Go to **Extensions** > **Apps Script**

3. Delete any existing code and paste the contents of `google-apps-script.js` from this project

4. Click **Deploy** > **New deployment**

5. Click the gear icon (⚙️) next to "Select type" and choose **"Web app"**

6. Configure:
   - **Description**: "Nuit de l'Info Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"

7. Click **Deploy**

8. **Copy the Web app URL** that appears (it looks like: `https://script.google.com/macros/s/.../exec`)

### Step 2: Configure the React App

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Paste your Google Apps Script URL into `.env`:
```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

3. Restart your development server:
```bash
npm run dev
```

Now all form submissions will be automatically sent to your Google Sheet!

## Data Storage

- **Primary**: Submissions are sent to Google Sheets (if configured)
- **Backup**: Submissions are also stored in browser's localStorage
- **Duplicate Prevention**: Works on both client-side (localStorage) and server-side (Google Sheets)

## Technologies Used

- React 18
- Vite
- CSS3 (no external UI libraries)

