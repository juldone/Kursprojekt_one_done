// Erklärung der Werte:
// tier -> Unterscheidung der Waffenattribute folgt aus "Tier"-Stufen. Bekannt aus MMO´s, RPG´s usw, je höher das Tier ist in dem ich mich befinde
// desto mehr Attribute haben meine Waffen.
// name -> Name der Waffe
// durability: Haltbarkeit der Waffe bis man sie nicht mehr verwenden kann. Wenn wir fies sein wollen wird eine defekte Waffe gelöscht
// wenn man den Wert auf 0 gehen lässt.
// minDamage -> der Mindestwert an Schaden der pro Angriff ausgegeben wird.
// maxDamage -> der Maximalwert an Schaden der pro Angriff ausgegeben wird.
//attackSpeed -> Angriffsgeschwindigkeit. Skala von 0 (ultra langsam) bis 5 (ultra schnell).

const t1Swords = [
  {
    tier: "T1",
    name: "Rostiges Kampfschwert",
    durability: 10,
    minDamage: 4,
    maxDamage: 6,
    attackSpeed: 0.8,
  },
  {
    tier: "T1",
    name: "Offiziersschwert",
    durability: 15,
    minDamage: 2,
    maxDamage: 4,
    attackSpeed: 0.6,
  },
  {
    tier: "T1",
    name: "Bronzesäbel",
    durabilty: 12,
    minDamage: 3,
    maxDamage: 5,
    attackSpeed: 0.6,
  },
  {
    tier: "T1",
    name: "Holzschwert",
    durability: 8,
    minDamage: 1,
    maxDamage: 2,
    attackSpeed: 1,
  },
  {
    tier: "T1",
    name: "Ausbilderschwert",
    durability: 20,
    minDamage: 6,
    maxDamage: 9,
    attackSpeed: 1.2,
  },
];
