const { getRandomRarity } = require("./chanceTable");

describe("getRandomRarity", () => {
  // Mock für Math.random
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5); // Mock für kontrollierbare Zufallszahlen
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Mock wiederherstellen
  });

  it("soll den korrekten Seltenheitsgrad basierend auf der Wahrscheinlichkeit zurückgeben", () => {
    // Simulierte Wahrscheinlichkeiten durch spezifische Mock-Werte
    jest.spyOn(Math, "random").mockReturnValueOnce(0.3); // Zufallszahl = 30
    expect(getRandomRarity()).toBe("common");

    jest.spyOn(Math, "random").mockReturnValueOnce(0.6); // Zufallszahl = 60
    expect(getRandomRarity()).toBe("uncommon");

    jest.spyOn(Math, "random").mockReturnValueOnce(0.85); // Zufallszahl = 85
    expect(getRandomRarity()).toBe("rare");

    jest.spyOn(Math, "random").mockReturnValueOnce(0.97); // Zufallszahl = 97
    expect(getRandomRarity()).toBe("epic");

    jest.spyOn(Math, "random").mockReturnValueOnce(0.99); // Zufallszahl = 99
    expect(getRandomRarity()).toBe("legendary");
  });

  it("soll immer 'common' zurückgeben, wenn die Zufallszahl unter 50 liegt", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.4); // Zufallszahl = 40
    expect(getRandomRarity()).toBe("common");
  });

  it("soll 'legendary' zurückgeben, wenn die Zufallszahl nahe 100 ist", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.999); // Zufallszahl = 99.9
    expect(getRandomRarity()).toBe("legendary");
  });
});
