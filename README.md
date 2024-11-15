
           
           _                 _                       _        _                      _                 _                                 _                 _                  _   _                 _              _                   _        
          / /\              / /\                    /\ \     /\_\                   /\ \              /\ \                              /\ \              / /\               /\_\/\_\ _            /\ \           /\ \     _          /\ \      
         / /  \            / /  \                   \ \ \   / / /         _         \_\ \             \ \ \                            /  \ \            / /  \             / / / / //\_\          \ \ \         /  \ \   /\_\       /  \ \     
        / / /\ \          / / /\ \                  /\ \_\  \ \ \__      /\_\       /\__ \            /\ \_\                          / /\ \_\          / / /\ \           /\ \/ \ \/ / /          /\ \_\       / /\ \ \_/ / /      / /\ \_\    
       / / /\ \ \        / / /\ \ \                / /\/_/   \ \___\    / / /      / /_ \ \          / /\/_/                         / / /\/_/         / / /\ \ \         /  \____\__/ /          / /\/_/      / / /\ \___/ /      / / /\/_/    
      / / /\ \_\ \      / / /  \ \ \      _       / / /       \__  /   / / /      / / /\ \ \        / / /                           / / / ______      / / /  \ \ \       / /\/________/          / / /        / / /  \/____/      / / / ______  
     / / /\ \ \___\    / / /___/ /\ \    /\ \    / / /        / / /   / / /      / / /  \/_/       / / /                           / / / /\_____\    / / /___/ /\ \     / / /\/_// / /          / / /        / / /    / / /      / / / /\_____\ 
    / / /  \ \ \__/   / / /_____/ /\ \   \ \_\  / / /        / / /   / / /      / / /             / / /           ___________     / / /  \/____ /   / / /_____/ /\ \   / / /    / / /          / / /        / / /    / / /      / / /  \/____ / 
   / / /____\_\ \    / /_________/\ \ \  / / /_/ / /        / / /___/ / /      / / /          ___/ / /__      ___/__________/\   / / /_____/ / /   / /_________/\ \ \ / / /    / / /       ___/ / /__      / / /    / / /      / / /_____/ / /  
  / / /__________\  / / /_       __\ \_\/ / /__\/ /        / / /____\/ /      /_/ /          /\__\/_/___\    /__________    \ \ / / /______\/ /   / / /_       __\ \_\\/_/    / / /       /\__\/_/___\    / / /    / / /      / / /______\/ /   
  \/_____________/  \_\___\     /____/_/\/_______/         \/_________/       \_\/           \/_________/    \____\/    \____\/ \/___________/    \_\___\     /____/_/        \/_/        \/_________/    \/_/     \/_/       \/___________/    
                                                                                                                                                                                                                                                



Productbacklog : https://docs.google.com/spreadsheets/d/1tCEmYaCuT7FTPfnBtTO3C-UFRd74kOSfOGGBVd1SDcI/edit?gid=585685019#gid=585685019

### Changelog 15.11.24

### Tim
- waffen_recipeschema.js mit Brian ausgearbeitet, so wie waffen_rezepte.json befüllt
- armor_rezepte.json befüllt, armor_recipeschema.js geschrieben
- armor_recipeimport.js und waffen_recipeimport.js geschrieben
- Datenbankfehler behoben bei dem im Import von Waffen/Armor zwei mal Recipe importiert werden wollte was zu einem Fehler führte nicht zwei mal der gleiche Import durchgeführt werden kann.
- 

### Brian
- Frontend erstellt und eine Route geschaffen von Login zu Accountdetails
- Dementsprechend app.js angepasst darunter  cors() funktion
- authMiddleware angepasst
- mit Tim zusammen recipes für Waffen und Armor besprochen erstellt und programmiert
- User.js unterscheidung zwischen Waffen und Armor Inventory umgebaut
- Mit Julian weiteres vorgehen des Frontend besprochen in der Account.js im Frontend versucht die Inventare zu unterscheiden
- Crafting ins Inventory Funktioniert derzeit Prima Equiplogik muss nochmal überarbeitet werden durch anderen approach 

### Julian
- Frontend Account.js code überarbeitet. Charactererstellung/button verfügbar, falls eingeloggte ID keinen character hat. Character kann via Button erstellt werden / char_Id wird automatisch zugewiesen und in Mongo_DB importiert
- mit Hilfe von Brian komplette routevebindung zum char und id frontendimport angepasst &  den "geheimen Token import " überarbeitet und angepasst
- buttons erweitert und angepasst
- Char_ID wird nicht unmittelbar nach Char Erstellung angezeigt. ( Only… nach eroflgreichen LogIN ) /// Zurück-Button funktioniert, Go-to Fight, Crafting button erstellt ohne Funktion.


### Changelog 14.11.24

### Tim

- Crafting System:
- MongoDB importierung der waffenimport.js in MongoDB hat geklappt
- craftingController.js Datei mehrmals überarbeitet, Logik evtl. morgen überdenken
- User.js Datei kleine änderung um die doppelte Kompilierung des Modells zu verhindern
- ** Reminder morgen die materialimport.js und armorimport.js so verwenden wie heute die weaponimport.js **
- ** Rezepte.json schreiben und einbinden **
- ** Kompletten Crafting Vorgang zum laufen bekommen **

### Brian
- User.js hat ein Inventar bekommen
- charactercontroller.js erstellt und getestet damit waffen / rüstungen ausgerüstet werden kann oder wieder entfernt wird
- zusätzlich existiert noch eine statupdater.js um auch die stats neu zu berechnen also dazurechnen oder abziehen
- dementsprechend auch neue routen zum testen im postman geschaffen
- neue kommentare hinterlassen damit jeder weiß wie er was benutzen kann in der app.js

### Julian
- Fehlerbehebung in Dateien / Datenbanken
- importe für weapons, armor funktionieren mit messages-codes programmiert. ( kein disconnect ) 
- importe für enemys fehlterhaft //// importe für items nur mit 1 message nach get-abfrage danach dissconnect backend
- itemimport überarbeitet: Server response bug gefixed. Problem: 1 Bug ( Postman log benachrichtigt nicht über den Import bestehender item IDS )
- React im frontend angewendet 
- Frontend Ordnerstruktur analysiert und versucht aufzubauen
- Login/Logout Seiten weiterleitung Logik versucht zu überarbeiten

### Changelog 13.11.24

- ### Tim
- MongoDB richtig initialisiert
- lokale Probleme mit MSI-Setup behoben
- characterCreation.js getestet
- ordnerstruktur in der Branch erstellt
- Branch auf Merge Vorgang vorbereitet.
- Strukturierungsfehler behoben und die "crafting" Branch in der ich den character ordner 
  erstellt hatte und an der character.js und characterCreation.js gearbeitet habe zu "character" 
  umbenannt, den vorerst nicht mehr benötigten branch crafting gelöscht und im Anschluss neu 
  initialisiert. Funktioniert
- initialisieren der "crafting"-branch
- crafting ordner erstellt
- account.js erstellt
- crafting.js erstellt
- craftingController.js erstellt
- craftingItem.js erstellt
- auf Testdurchläufe morgen vorbereitet, mit letztem Commit reminder gesetzt
- Alf Over and Out
⠀⠀⠀⠀⠀⠀⠀⠀⢠⡖⠀⠀⢀⣠⡤⠶⠶⢦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡄⠀⣰⢻⣇⡴⠛⠉⠀⡀⠀⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣷⢠⡏⢸⢏⠄⠀⡔⠉⣀⡴⢋⣁⣐⣢⡈⢷⡀⠀⠀⠀⠀⠀⠀⠀
⢀⣀⣀⡀⢸⡟⣿⠀⠈⢸⣀⣮⣤⣤⣟⣰⣷⣶⣶⣌⡙⠦⣝⠲⣤⣤⡀⠀⠀⠀
⣞⠀⢄⠉⠻⢧⡈⠀⠀⢸⣿⣿⣿⠟⠉⠉⠉⢉⣙⢻⣖⡂⠈⠉⠉⠉⠀⠀⠀⠀
⢹⡄⠀⠑⣄⠀⠈⠳⣤⣾⣿⣿⠃⠖⠒⣄⠀⡧⢾⡏⢻⡗⠂⠀⠀⠀⠀⠀⠀⠀
⠀⢳⡀⠀⢸⠳⣄⠀⢸⢿⣿⢿⡀⡚⢹⣿⠀⠀⣘⠷⠶⣷⣤⣀⠀⠀⠀⠀⠀⠀
⠀⠀⢷⡀⠘⣧⡸⠃⠀⣼⠋⣸⠁⠀⠒⠋⢀⡰⠁⠀⡼⠁⠀⠉⠛⢦⡀⠀⠀⠀
⠀⠀⣸⠁⠀⡼⠁⠴⢾⡇⢀⡏⠀⠀⠤⠖⢫⡇⠀⢠⠃⠀⠀⣀⣀⣀⠿⢦⡀⠀
⠀⠀⢹⡀⠀⠁⠀⣾⡿⢁⡞⠀⠀⠀⠀⠀⢸⡅⠀⠘⡄⠀⢸⠁⡶⡄⢺⣳⠹⣆
⠀⠀⠀⠓⠦⣶⠋⠀⠇⣸⠁⠀⠀⢸⡀⠀⠈⡇⠀⠀⢧⠀⠸⡄⠙⠋⠀⠀⠀⣿
⠀⠀⠀⠀⢰⣣⠀⠀⠀⣿⠀⠀⠀⠈⣇⠀⠀⢳⠀⠀⠈⢧⡀⢱⣄⠀⠀⠀⢀⡿
⠀⠀⠀⠀⣸⠃⠀⠀⠀⢹⡄⠀⠀⠀⠘⢦⣄⡠⠷⡖⠲⠚⣍⠙⢏⠓⠦⠴⠛⠁
⠀⠀⠀⢠⠏⡀⠀⠀⠀⠀⠙⠳⠤⠤⠴⠋⠣⡀⠀⠘⠀⠑⣈⣧⡜⣧⠀⠀⠀⠀
⠀⠀⠀⣾⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⣄⢀⣆⠀⢹⠑⢴⢸⡆⠀⠀⠀
⠀⠀⠈⢀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠼⣄⣸⡤⠎⢀⡇⠀⠀⠀
⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣠⠄⢀⠀⠀⠀⠀⢀⡤⠟⠀⠀⠀⠀
⠀⠀⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠐⠛⣺⢿⣾⡤⠴⠚⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠳⣦⡀⣄⣀⠀⠀⠀⢻⣖⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⠿⠉⠉⠉⠉⠉⠁⠀⠀⠀

### Brian
- Fehler behoben in einigen Datein
- User.js überarbeitet und in der DB überprüft
- materialsimport.js erstellt und materialen dem spieler hinzugefügt
- battlecontroller geschrieben damit der user gegen einen bot kämpfen kann.
- authenticator geschrieben damit man nur zugang zu bestimmten bereichen hat sowohl mit testtoken als auch mit logintoken geprüft
- ID´s des User accounts angepasst.
- alle prototyp branches geprüft und in main gemerged und nachträglich nochmal auf funktion gestestet
### Julian
- armor.js items.js und weapons.js überarbeitet / neue ID-Struktur hinzugefügt / Attribute entfernt
- Datenbanken bearbeitet 
- eingeständige DB.js erstellt um zu MongoDB zu connecten ( Abrufen einzelner connectes zur MongDB von Datenbanken 
  gebündelte und in DB.js eingefügt )
- verwaltung der DB.js implementiert
-  Sicherheitslücke für Dauerhaften aktiven DB-Serverzugang geschlossen
-  ID Struktur  für MONGODB angepasst
-  importdateien ( armor, weapons, items ) überprüfung hinzugefügt (von existierenden IDs in der DB / Implementierung zur überprüfung von neuen IDs zu existierenden / Listenabgleich falls keine neuen Daten hinzugefügt werden = benachrichtigung

### Changelog 12.11.24

### Tim

- character.js erstellt, accountId hinzugefügt Feld hinzugefügt
- characterCreation.js erstellt, Beschreibung hinzugefügt, Eindeutige Charakter-ID generiert und mit Account ID verbunden
- Arbeitsbranch "Crafting" erstellt folgende Punkte sind in der Branch passiert:
- chanceTable erstellt mit welches Seltenheitsgrade und ihre Wahrscheinlichkeiten enthält
- crafting.js erstellt und ein Schema für ein Crafting-Rezept geschrieben
- craftingController.js erstellt und eine Funktion geschrieben die überprüft ob genug Materialien für das Rezept vorhanden sind, das Crafting durchführt und welches Item erstellt wurde.
- craftingSystem.js erstellt
- ### REMINDER - MORGEN FUNKTIONEN TESTEN

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
