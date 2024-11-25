
           
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

### Changelog 25.11.24

### Tim
- Login Bereich Designed und Eingebunden
- Crafting Bereich Designed und Eingebunden
- Angefangen Struktur in der Account.js zu schaffen (JSX Teil Auslagern)


### Brian
- BattleArena.js überarbeitet damit es etwas mehr engagement beim Kampfablauf gibt
- Disable button beim Weapon Equipment eingebaut
- Mit Julian zusammen Die andwendung in die Cloud zu bringen

### Julian
- Mit Brian zusammengearbeitet und die Anwendung in die Cloud gebracht
- NGINX installiert als Webserver
- EC2 Instanz aufgesetzt
- DocumentDB als MongoDB initialisiert und sie mit der EC2 Instanz verbunden

### Changelog 22.11.24

### Tim
-Remodel der Battlelogik zu machen, teilweise Progress der aber leider zunichte gemacht wurde weil ich vorhandene Funktionen die im Backend vorhanden sind nicht richtig angesprochen habe
-Am Wochenende nochmal Schritt für Schritt versuchen das hin zu bekommen, für heute ist die Luft raus. 

### Brian
-Zusammen mit Julian die Account.js fehler behoben
-Mit Tim angefangen ein kleines remodel der Battlelogik zu machen einige dinge im Backend laufen im Frontend ab noch einige Fehler beim Ablauf des Kampfes


### Julian
- Frontend in der Account.js Fehler bearbeitet und Funktionen hinzugefügt
- Unequip und equip größtenteils berabetitet
- Ein-Waffen/Rüstungs-Regel implementiert: Charaktere können jetzt nur eine Waffe oder Rüstung gleichzeitig ausrüsten. Bei Rüstungen noch mit Fehler
- Prüfung auf ausgerüstete Waffe: Überprüfung, ob der Charakter bereits eine Waffe trägt, bevor eine neue ausgerüstet wird.
- Benachrichtigungen eingebaut: Anzeige einer Nachricht (mit alert), wenn der Nutzer versucht, eine zweite Waffe auszurüsten. Alerts für Ungültige Items hinzugefügt
- Logik zur Ausrüstung beibehalten: Die bestehende Funktionalität von Brian für das Ausrüsten wurde ergänzt
 

### Changelog 21.11.24

### Tim
- Unequip und Equip Frontend Basis mit Julian erarbeitet.
- Großteil meiner heutigen arbeit wurde Reduntant dadurch das 1 Feature 3 Dev´s "gefressen" hat. Hier unbedingt besser kommunizieren und vor allem => Absprachen einhalten, bei nicht verstehen nachfragen.
- Um noch auf etwas messbares zu kommen vorhandene BattleArena.js Datei (Frontend) von Brian in revamp-battle-arena gebranched, gepublished und erste verbesserung implementiert.
- Die Hp Bars fangen bei einem erneuten Kampf jetzt immer wieder bei 100/100 an. Hierbei ist die Loot/Reward Funktion flöten gegangen.
- ### REMINDER - Morgen JSX-Teil aus der Main abgleichen. Glaube da liegt der Fehler.

### Brian
- Unequip und Equip im Frontend implementiert Basis von Julian und Tim 
- Mit Websocket beschäftigt und versucht zu implementieren funktioniert noch nicht wird eventuell wieder gedroppt das Feature.


### Julian
- Anpassung der Button-Stile (Hover-, Klick- und Standardzustände).
  Hinzufügen von visuellen dynamische Listen
- Implementierung versucht der Account.js-Komponente: nur mit Bugs und try and error
- Benutzerinformationen laden (z.B. Name, Materialien, Inventar, Charaktere).
- Dynamisches Umschalten der Sichtbarkeit von Waffen- und Rüstungslisten.
- Hinzufügen von Buttons und Event-Handlern für Aktionen (z.B. "Waffe ausrüsten", "In den Kampf") Ergebnis fehlgeschlagen 
 nur mit bugs
- Überprüfung der API-Endpunkte auf Richtigkeit
- Überprüfung der API-Route /equipment/equip im Backend


### Changelog 20.11.24

### Tim
- in der waffen_rezepte.json bei allen rezepten den type zu "Waffe" geändert. (Datenbank struktur)
- equipmentController.js if (type === "Fernkampf") zu if (type === "Waffe") geändert
- Testing gestartet, bis zur Funktion Rüstung ablegen gekommen
- Rest des equipmentControllers mit Brian Debugged, Items an und ablegen funktioniert. (Kleiner Bug - unendliches Armor Scaling möglich, beim Rüstung ablegen werden alle Stats in die Rüstung geschoben) - Erstmal hinnehmen, Funktion gegeben. Äh und ist n´Feature.

### Brian
- BattleArena.js überarbeitet HP Leisten funktionieren halbwegs
- Mit Tim die equipmentLogik überarbeitet sodass gegenstände ordentlich an und abgelegt werden hurray for exploit ( findet eh keiner raus :) )
- Angefangen versucht die eine Websocket aufzubauen (habs aufgegeben ) vllt morgen.
   

### Julian
- Kämpfen button in kombination mit einer weiterleitung auf den endgültigen fight button bearbeitet
- equipment bzw. items anlegen ( dem character hinzuzufügen ) im frontend visualisiert, leider mit bugs
- app.js im backend mit cors blocked die use/post abfrage des eqiups verändert und freigegeben
- account_js unverändert // Account_js_iteminsert_ Items dem character via click hinzufügen funktioniert. Ausser beim anlegen der Rüstungen wird es im Frontend nicht angezeigt.



### Changelog 19.11.24

### Tim
- equipmentController logik geschrieben, equipmentRoutens geschrieben, in app.js eingebunden
- Mit Brian equipmentController.js logik überarbeitet, getestet was mit Items passiert welche vom Inventar an den Character gelegt werden -> diese verschwinden aus dem Inventar = sehr gut!
- Dann versucht die Stats, also Momentan den DMG im Insgesamten zu erhöhen je nach Waffe welche angelegt wird -> Funktioniert bei Waffen.
- Im equipmentController.js character.stats.armor += item.armor bei Zeile 69 und allen anderen types hinzugefügt, gleiches prinzip wie bei den Waffen nur umgeschrieben. Sollte klappen.
- Testing Durchlauf gestartet, Probleme gehabt den Body der Post Anfrage zu füllen, accountId, characterName, itemName, type gebe ich an aber nicht richtig. Entweder heute Abend oder Morgen früh um Hilfe fragen.
### REMINDER - Morgen als erstes Stat Changes für Armor zum laufen bringen -> Dann testen -> Rdy To Merge (Meiner Meinung nach)
### REMINDERCEPTION - Brian fixxed it <3

### Brian
- Tägliche Besprechung für weiteres vorgehen geplant
- Equipmentlogik mit Tim überarbeitet
- Bugs gefixt ( Equipmentcontroller wieder zum laufen bekommen , Fight.js hat falschen Wert genommen als im Backend)
- Userstruktur ein weiteres mal überarbeitet
- Battle-Arena für den Interaktiven Kampf angefangen ist aber noch Fehlerbehaftet

### Julian 
- Hauptsächlich Front und Backend bearbeitet
- FightRouting_js erstellt // Account_js überarbeitet // Fight_js erstellt // Codes überarbeitet
- app_js überarbeitet_fighting_route überarbeitet
- Buttons erstellt und bearbeitet
- neue componente Fight.js zsm. mit Brian geroutet
- Fight_js erweitert durch neues "fightwindow" eigener_char links, gegner rechts angeordnet, in die mitte ein fight button. BUG: nach klick auf Fight werden namen nicht         aktualisiert ansonsten funktioniert die Kampflogik 

### Changelog 18.11.24

### Tim 
- Crafting Branch in Main gemerged (yes!)
- armor_rezepte.json mit Sets gefüllt. (Holzset: Kopf, Hand, Brust, Füße, Steinset: Kopf, Hand, Brust, Füße, Metallset: Kopf, Hand, Brust, Füße)
- enemy.json -> Gegner Schema befüllt und in die Datenbank eingespeißt.
- Readme.txt für Enemies erstellt und Beschreibungen der einzelnen Charaktere eingefügt. (Maybe Eastereggs?)
- craftingfunc.js überarbeitet, diese wählt jetzt einen random gegner aus sobald der kampf gestartet wird.
- ABER: vorerst eingestellt, da in der User.js inventory daten eingebunden werden und in die user datei erst noch verknüpfungen kommen müssen mit denen ich weiter arbeiten kann

### Brian
- Funktionen auf den Branches getestet und gemerged
- Craftingfunc und app.js routen überarbeitet
- Crack geraucht
- CraftingInterface erstellt und in Betrieb genommen funktioniert super Waffen udn Rüstungsrezepte werden per get request ins Frontend gerendert.
- Mehere kleine Bugs gefixt
- Character Creation läuft jetzt auch Character kann erstellt werden wenn keiner vorhanden ist und bleibt dann auch dort vorhanden , keiner neuer char kann erstellt werden nur wenn man seinen Character löschen tut
- Demensprechend wurde auch eine neue Route hinzugefügt damit der Character auch gelöscht werden kann.

### Julian
- Frontend überarbeitet
- Hauptproblem bearbeitet, dass nach einem Login, der Account alle "Neu Registrierten" CHaractere anhand eines Chard-ID checks anzeigt. In der Entwicklerconsole wurden mir      die CharIDS angezeigt, jedoch nicht im Frontend. Leider ohne Erfolg. 
- User_js verändert, characters hinzugefuegt //  Account_js bearbeitet, regeln fuer 1 charactererstellung pro Acc. ID hinzugefuegt // Bug: in der Entwicklerconsole wird die 
  CharID angezeigt und ausgelesen, aber das Frontend setzt diese Regel nicht um.
- stand: funktionfähig mit dem BUG das der char nicht angezeigt wird.
- GoToFight Button erstellt, dahinterliegendes Backend erstellt mit FightRouting.js, Fight.js. 

### Changelog 15.11.24

### Tim
- waffen_recipeschema.js mit Brian ausgearbeitet, so wie waffen_rezepte.json befüllt
- armor_rezepte.json befüllt, armor_recipeschema.js geschrieben
- armor_recipeimport.js und waffen_recipeimport.js geschrieben
- Datenbankfehler behoben bei dem im Import von Waffen/Armor zwei mal Recipe importiert werden wollte was zu einem Fehler führte nicht zwei mal der gleiche Import durchgeführt werden kann.
- switch-anweisung in der craftingfunc.js geschrieben
- ### REMINDER AM WOCHENENDE MIT NEUEM USER CRAFTING TESTEN OB SKALIERUNG FUNKTIONIERT, Habe gerade Brainlag

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
