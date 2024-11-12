# BaJuTi_Gaming

Productbacklog : https://docs.google.com/spreadsheets/d/1tCEmYaCuT7FTPfnBtTO3C-UFRd74kOSfOGGBVd1SDcI/edit?gid=585685019#gid=585685019

### Changelog 12.11.24

### Brian

- Die Datenbank MongoDB lokal installiert um sich mit dem Backend-Server (express) zu verbinden.
- User.js editiert um eine Unique userID hinzuzufügen , register.js dementsprechen überarbeitet für das AutoIncrement.
- Frontend erstellt um die jeweiligen Funktion wie Register und Login zu testen um Fehler dementsprechen zu beheben.

### Julian

- Lokalen Server mit verknüpfung zu Mongo DB eingerichtet
- Waffenschema und Rüstungsschema in der weapons.js erstellt im weapon branch

## Ordnerstruktur

BaJuTi_Gaming/
├── backend/ # Node.js Express backend
│ ├── data/ # JSON files (weapons.json, player.json, enemy.json)
│ ├── app.js # Main Express server file
│ ├── routes/ # API routes (battle.js, levelup.js, etc.)
│ └── utils.js # Utility functions (e.g., for file I/O)
├── frontend/ # Frontend project (React or Vue)
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── App.js # Main React app file
│ │ ├── index.js # Entry point for React
│ └── package.json # Frontend dependencies
└── package.json # Project dependencies (both backend and frontend)
