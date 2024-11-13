# Das data in Databank

- Some thoughts.
- Basically brauchen wir eine Datenbank für das speichern bzw. ablegen der user mit passwort
- diese müssen wiederum auf den char verweisen
- der char muss auf das inv verweisen sofern wir eins haben
- jedenfalls sieht das auch nach jeder menge arbeit aus.
- wir müssen von vers. items unterscheiden
- armor worunter brust , kopf , hände und beine zählt
- waffen 1H ,2H , ranged oder magical
- User brauch noch ein Inventar
- beim craften müssen die mats abgezogen werden , die rarität ausgewürfelt werden und der gegenstand ins spieler inventar gepackt werden.
- zusätzlich brauch der character noch eine funktion damit die gecrafteten Sachen angelegt werden können ( kann man sicherlich mit einer - funktion machen.)
- Übersicht der stats des characters. sprich alle stats müssen zusammengerechnet werden.

## Laut recherche könnte das so aussehen

### User und Password

{
"\_id": "unique*user_id",
"username": "player1",
"passwordHash": "hashed_password",
"characterId": "unique_character*### Character

{
"\_id": "unique_character_id",
"name": "BraveKnight",
"level": 5,
"stats": {
"hp": 100,
"attack": 15,
"defense": 10,
"speed": 8
},
"equipment": {
"armor": {
"head": "item_id_head_armor",
"chest": "item_id_chest_armor",
"hands": "item_id_hand_armor",
"legs": "item_id_leg_armor"
},
"weapon": "item_id_weapon"
},id"
}

"inventory": ["item_id_1", "item_id_2", "item_id_3"]
}

### Inventar

{
"\_id": "item_id_1",
"name": "Steel Sword",
"type": "weapon",
"subType": "1H",
"stats": {
"attackBonus": 10,
"speedPenalty": -1
}
},
{
"\_id": "item_id_2",
"name": "Iron Helmet",
"type": "armor",
"part": "head",
"stats": {
"defenseBonus": 5,
"speedPenalty": -2
}
}

- Generell müssten wir uns eine Item Datenbank überlegen die unique item id´s hat
- Tims Langschwert mit der ID 1 ( können wir dann ID 1 nochmal übergeben???? :thinkemote:)
