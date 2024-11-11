// Weiteführende Waffentabelle
// Hier beginnt der T2 Bereich des jeweiligen Waffenarrays
// In der T2 Stufen werden die Attribute kritischer Trefferschaden und verschiedene Buffs
// (z.B. 'Kampfschrei' -> "Regeneriere alle 3 Sekunden 5% HP für 9 Sekunden") oder Debuffs (z.B. 'Angsteinflösendes Gebrüll' -> "Deine Chance zu Blocken ist um 50% vermindert.")
// Waffen können bis zu zwei extra Werte bekommen (seltener Fund eines T2 Items)
//
//
// Erklärung neuer Werte:
// hitChance -> 1 = 100%, 0.5 = 50% usw. Beschreibt die Trefferchance einer Waffe
// specialEffect -> chance = die Wahrscheinlichkeit mit welcher der Effekt ausgelöst wird, type = der Schadenstyp (Feuer, Gift, Fluch usw.)
// description = die Beschreibung des jeweiligen Effekts.
//
// Eine Beispielewaffe würde unten z.B. so aussehen.

const t2Bows = [
  {
    tier: "T2",
    name: "Brandbogen des Leutnants",
    durability: 25,
    minDamage: 7,
    maxDamage: 11,
    attackSpeed: 1.0,
    hitChance: 0.7, // 70 % Trefferchance
    specialEffect: {
      chance: 0.08, // 8% Chance, Effekt auszulösen
      type: "Burn",
      description:
        "Verursacht Brand. Ziel erleidet für 6 Sekunden alle 2 Sekunden 2 Schadenspunkte.",
    },
  },
];
