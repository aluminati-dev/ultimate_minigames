# System Breach Prank App

A full-stack "hacker" prank application built with React, Express, and Firebase.

## 🚀 Features
- **Minigame:** A fast-paced "Mega Play" button-clicking game.
- **Hacker Interface:** Immersive CRT-style terminal effect with realistic system breach logs.
- **IP Logging:** Automatically captures and logs user IP addresses to Firestore.
- **Admin Panel:** Secure dashboard for viewing captured logs (Google Auth required).
- **Real-time Updates:** Uses Firestore `onSnapshot` for live log monitoring.

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Motion (framer-motion), Lucide Icons.
- **Backend:** Node.js, Express.
- **Database:** Firebase Firestore.
- **Auth:** Firebase Authentication (Google Login).

## 📦 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a `firebase-applet-config.json` in the root directory with your Firebase project credentials.
   - Example structure:
     ```json
     {
       "projectId": "your-project-id",
       "appId": "your-app-id",
       "apiKey": "your-api-key",
       "authDomain": "your-auth-domain",
       "firestoreDatabaseId": "your-database-id"
     }
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔒 Security
- **Firestore Rules:** Included in `firestore.rules`.
- **Admin Access:** Hardcoded to specific email addresses in `src/App.tsx`.

## 📜 License
MIT
