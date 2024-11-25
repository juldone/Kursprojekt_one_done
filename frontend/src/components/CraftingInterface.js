import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CraftingInterface.css";

const CraftingInterface = () => {
  const [weaponRecipes, setWeaponRecipes] = useState([]);
  const [armorRecipes, setArmorRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [materials] = useState({ Holz: 0, Stein: 0, Metall: 0 });
  const APP_URL = "http://172.31.44.193:3000";
  //  const APP_URL = "http://local:3000";

  const accountId = localStorage.getItem("accountId");
  const navigate = useNavigate();

  useEffect(() => {
    // Füge die Klasse zu body hinzu
    document.body.classList.add("crafting-background");

    // Bereinigung nach Verlassen der Seite
    return () => {
      document.body.classList.remove("crafting-background");
    };
  }, []);

  useEffect(() => {
    if (!accountId) {
      console.error("Account ID ist nicht gesetzt!");
      return;
    }

    fetch(`${APP_URL}/user/${accountId}/crafting/wpnrecipes`)
      .then((res) => res.json())
      .then((data) => setWeaponRecipes(data))
      .catch((err) =>
        console.error("Fehler beim Laden der Waffenrezepte:", err)
      );

    fetch(`${APP_URL}/user/${accountId}/crafting/armrecipes`)
      .then((res) => res.json())
      .then((data) => setArmorRecipes(data))
      .catch((err) =>
        console.error("Fehler beim Laden der Rüstungsrezepte:", err)
      );
  }, [accountId]);

  const craftItem = (recipeId, type) => {
    const endpoint =
      type === "Kopf" || type === "Brust" || type === "Hand" || type === "Füße"
        ? `${APP_URL}/user/${accountId}/crafting/armcraft`
        : `${APP_URL}/user/${accountId}/crafting/wpncraft`;

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: accountId,
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
        alert(data.message);
      })
      .catch((err) => console.error("Fehler beim Craften:", err));
  };

  if (!accountId) {
    return <div>Bitte logge dich ein!</div>;
  }

  return (
    <div className="crafting-container">
      <h1 className="crafting-title">Crafting Interface</h1>

      {/* Waffen- und Rüstungsrezepte nebeneinander */}
      <div className="recipes-container">
        <div className="recipes-column">
          <h2 className="recipe-title">Waffenrezepte</h2>
          <ul className="recipe-list">
            {weaponRecipes.map((recipe) => (
              <li
                key={recipe.recipeId}
                onClick={() => setSelectedRecipe(recipe)}
                className="recipe-item"
              >
                {recipe.name} - Typ: {recipe.type}, Schaden: {recipe.damage}
              </li>
            ))}
          </ul>
        </div>
        <div className="recipes-column">
          <h2 className="recipe-title">Rüstungsrezepte</h2>
          <ul className="recipe-list">
            {armorRecipes.map((recipe) => (
              <li
                key={recipe.recipeId}
                onClick={() => setSelectedRecipe(recipe)}
                className="recipe-item"
              >
                {recipe.name} - Typ: {recipe.type}, Rüstung: {recipe.armor}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedRecipe && (
        <div className="selected-recipe">
          <h3 className="selected-recipe-title">
            Ausgewähltes Rezept: {selectedRecipe.name}
          </h3>
          <p className="selected-recipe-detail">Typ: {selectedRecipe.type}</p>
          <p className="selected-recipe-detail">Material kosten :</p>
          <ul className="materials-list">
            {Object.entries(selectedRecipe.materials).map(
              ([material, amount]) => (
                <li key={material} className="material-item">
                  {material}: {amount}
                </li>
              )
            )}
          </ul>
          <button onClick={() => navigate("/account")} className="back-button">
            Zurück zur Account-Seite
          </button>
          <button
            onClick={() =>
              craftItem(selectedRecipe.recipeId, selectedRecipe.type)
            }
            className="craft-button"
          >
            Craften
          </button>
        </div>
      )}
    </div>
  );
};

export default CraftingInterface;
