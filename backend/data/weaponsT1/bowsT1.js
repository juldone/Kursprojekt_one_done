// Erklärung der Werte:
// tier -> Unterscheidung der Waffenattribute folgt aus "Tier"-Stufen. Bekannt aus MMO´s, RPG´s usw, je höher das Tier ist in dem ich mich befinde
// desto mehr Attribute haben meine Waffen.
// name -> Name der Waffe
// durability: Haltbarkeit der Waffe bis man sie nicht mehr verwenden kann. Wenn wir fies sein wollen wird eine defekte Waffe gelöscht
// wenn man den Wert auf 0 gehen lässt.
// minDamage -> der Mindestwert an Schaden der pro Angriff ausgegeben wird.
// maxDamage -> der Maximalwert an Schaden der pro Angriff ausgegeben wird.
//attackSpeed -> Angriffsgeschwindigkeit. Skala von 0 (ultra langsam) bis 5 (ultra schnell).

const t1Bows = [
  {
    tier: "T1",
    name: "Spröder Jagdbogen",
    durability: 10,
    minDamage: 3,
    maxDamage: 5,
    attackSpeed: 0.6,
  },
  {
    tier: "T1",
    name: "Angebrochener Kriegsbogen",
    durability: 5,
    minDamage: 5,
    maxDamage: 7,
    attackSpeed: 0.4,
  },
  {
    tier: "T1",
    name: "Selbstgebaute Steinschleuder",
    durability: 10,
    minDamage: 1,
    maxDamage: 3,
    attackSpeed: 1.2,
  },
  {
    tier: "T1",
    name: "Lehrlingsbogen",
    durability: 30,
    minDamage: 2,
    maxDamage: 4,
    attackSpeed: 0.7,
  },
  {
    tier: "T1",
    name: "Vikingerbogen",
    durability: 35,
    minDamage: 5,
    maxDamage: 8,
    attackSpeed: 1.2,
  },
];
