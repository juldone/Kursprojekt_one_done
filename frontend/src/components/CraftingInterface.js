import React, { useState, useEffect } from "react";

const CraftingInterface = () => {
  const [weaponRecipes, setWeaponRecipes] = useState([]);
  const [armorRecipes, setArmorRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [materials] = useState({ Holz: 0, Stein: 0, Metall: 0 });

  const accountId = localStorage.getItem("accountId");

  useEffect(() => {
    if (!accountId) {
      // Rückgabe im useEffect, wenn accountId nicht vorhanden ist
      console.error("Account ID ist nicht gesetzt!");
      return;
    }

    // Waffenrezepte laden
    fetch(`http://localhost:3000/user/${accountId}/crafting/wpnrecipes`)
      .then((res) => res.json())
      .then((data) => setWeaponRecipes(data))
      .catch((err) =>
        console.error("Fehler beim Laden der Waffenrezepte:", err)
      );

    // Rüstungsrezepte laden
    fetch(`http://localhost:3000/user/${accountId}/crafting/armrecipes`)
      .then((res) => res.json())
      .then((data) => setArmorRecipes(data))
      .catch((err) =>
        console.error("Fehler beim Laden der Rüstungsrezepte:", err)
      );
  }, [accountId]); // accountId als Abhängigkeit hinzufügen

  const craftItem = (recipeId, type) => {
    const endpoint =
      type === "Kopf" || type === "Brust" || type === "Hand" || type === "Füße"
        ? `http://localhost:3000/user/${accountId}/crafting/armcraft`
        : `http://localhost:3000/user/${accountId}/crafting/wpncraft`;

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: accountId, // accountId hier im Body
        recipeId: recipeId,
        materials: materials,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Serverfehler: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message); // Antwort vom Backend anzeigen
      })
      .catch((err) => console.error("Fehler beim Craften:", err));
  };

  if (!accountId) {
    return <div>Bitte logge dich ein!</div>; // Hier wird dem Benutzer eine Nachricht angezeigt, wenn kein AccountId vorhanden ist
  }

  return (
    <div>
      <h1>Crafting Interface</h1>

      {/* Waffenrezepte */}
      <h2>Waffenrezepte</h2>
      <ul>
        {weaponRecipes.map((recipe) => (
          <li key={recipe.recipeId} onClick={() => setSelectedRecipe(recipe)}>
            {recipe.name} - Typ: {recipe.type}, Schaden: {recipe.damage}
          </li>
        ))}
      </ul>

      {/* Rüstungsrezepte */}
      <h2>Rüstungsrezepte</h2>
      <ul>
        {armorRecipes.map((recipe) => (
          <li key={recipe.recipeId} onClick={() => setSelectedRecipe(recipe)}>
            {recipe.name} - Typ: {recipe.type}, Rüstung: {recipe.armor}
          </li>
        ))}
      </ul>

      {/* Ausgewähltes Rezept */}
      {selectedRecipe && (
        <div>
          <h3>Ausgewähltes Rezept: {selectedRecipe.name}</h3>
          <p>Typ: {selectedRecipe.type}</p>
          <p>Material kosten :</p>
          <ul>
            {Object.entries(selectedRecipe.materials).map(
              ([material, amount]) => (
                <li key={material}>
                  {material}: {amount}
                </li>
              )
            )}
          </ul>

          {/* Crafting-Button */}
          <button
            onClick={() =>
              craftItem(selectedRecipe.recipeId, selectedRecipe.type)
            }
          >
            Craften
          </button>
        </div>
      )}
    </div>
  );
};

export default CraftingInterface;
