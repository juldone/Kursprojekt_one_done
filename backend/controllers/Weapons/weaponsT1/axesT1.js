// Erklärung der Werte:
// tier -> Unterscheidung der Waffenattribute folgt aus "Tier"-Stufen. Bekannt aus MMO´s, RPG´s usw, je höher das Tier ist in dem ich mich befinde
// desto mehr Attribute haben meine Waffen.
// name -> Name der Waffe
// durability: Haltbarkeit der Waffe bis man sie nicht mehr verwenden kann. Wenn wir fies sein wollen wird eine defekte Waffe gelöscht
// wenn man den Wert auf 0 gehen lässt.
// minDamage -> der Mindestwert an Schaden der pro Angriff ausgegeben wird.
// maxDamage -> der Maximalwert an Schaden der pro Angriff ausgegeben wird.
//attackSpeed -> Angriffsgeschwindigkeit. Skala von 0 (ultra langsam) bis 5 (ultra schnell).

const t1Axes = [
  {
    tier: "T1",
    name: "Rostige Holzfälleraxt",
    durability: 20,
    minDamage: 3,
    maxDamage: 7,
    attackSpeed: 0.3,
  },
  {
    tier: "T1",
    name: "Angebrochene Steinaxt",
    durability: 20,
    minDamage: 4,
    maxDamage: 5,
    attackSpeed: 0.5,
  },
  {
    tier: "T1",
    name: "Abgenutzte Kampfaxt",
    durability: 10,
    minDamage: 5,
    maxDamage: 8,
    attackSpeed: 0.7,
  },
  {
    tier: "T1",
    name: "Alte Schaufel",
    durability: 30,
    minDamage: 1,
    maxDamage: 3,
    attackSpeed: 1.2,
  },
  {
    tier: "T1",
    name: "Bronzene Kriegsaxt",
    durability: 10,
    minDamage: 6,
    maxDamage: 9,
    attackSpeed: 1.0,
  },
];
