# BaJuTi_Gaming

Productbacklog : https://docs.google.com/spreadsheets/d/1tCEmYaCuT7FTPfnBtTO3C-UFRd74kOSfOGGBVd1SDcI/edit?gid=585685019#gid=585685019

### Changelog 12.11.24

### Tim

- character.js erstellt, accountId hinzugefügt Feld hinzugefügt
- characterCreation.js erstellt, Beschreibung hinzugefügt, Eindeutige Charakter-ID generiert und mit Account ID verbunden

### Brian

- Die Datenbank MongoDB lokal installiert um sich mit dem Backend-Server (express) zu verbinden.
- User.js editiert um eine Unique userID hinzuzufügen , register.js dementsprechen überarbeitet für das AutoIncrement.
- Frontend erstellt um die jeweiligen Funktion wie Register und Login zu testen um Fehler dementsprechen zu beheben.
- weapon- und armorimport überarbeitet und gesplittet sodass beides modular läuft.
- weapon.js und armor.js voneinander getrennt für modularität
- Überprüft ob beides in der Datenbank importiert wird über waffen.json und armor.json
- Fehler bei der ID muss noch überarbeitet werden.
- **Datenbankverbindung muss nochmal überprüft werden derzeit ein Sicherheitsproblem**

### Julian

- Lokalen Server mit verknüpfung zu Mongo DB eingerichtet
- Waffenschema und Rüstungsschema in der weapons.js erstellt im weapon branch
- Armor und Weapons.js sind überarbeitet,  GET - Abfragen laufen jetzt dauerhaft jetzt ohne fehlermeldung
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
