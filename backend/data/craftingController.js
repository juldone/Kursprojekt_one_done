const Material = require("./materials"); // Importiert die Materialdaten
const CraftingRecipe = require("./crafting"); // Importiert die Rezepte

// Funktion, um zu prüfen, ob genug Materialien für das Rezept vorhanden sind
async function canCraft(recipeId, playerMaterials) {
  const recipe = await CraftingRecipe.findById(recipeId).populate(
    "ingredients.material"
  );
  let canCraft = true;

  recipe.ingredients.forEach((ingredient) => {
    const playerMaterial = playerMaterials.find(
      (material) => material.name === ingredient.material.name
    );
    if (!playerMaterial || playerMaterial.amount < ingredient.amount) {
      canCraft = false;
    }
  });

  return canCraft;
}

// Funktion, um das Crafting durchzuführen
async function craftItem(recipeId, playerMaterials) {
  const recipe = await CraftingRecipe.findById(recipeId).populate(
    "ingredients.material"
  );

  if (await canCraft(recipeId, playerMaterials)) {
    // Materialien aus dem Inventar des Spielers abbauen
    recipe.ingredients.forEach((ingredient) => {
      const playerMaterial = playerMaterials.find(
        (material) => material.name === ingredient.material.name
      );
      playerMaterial.amount -= ingredient.amount;
    });

    // Neues Item hinzufügen
    console.log(`Item ${recipe.resultItem} erstellt!`);
    return {
      success: true,
      item: recipe.resultItem,
      amount: recipe.resultAmount,
    };
  } else {
    console.log("Nicht genug Materialien!");
    return { success: false };
  }
}

module.exports = { craftItem };
