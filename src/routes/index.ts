import { Router } from "express";
import { IngredientController } from "../controllers/ingredient.controller";
import { RecipeController } from "../controllers/recipe.controller";
import { register } from "../metrics"; // Importa o registro de métricas

const router = Router();

// Ingredients
router.post("/ingredients", IngredientController.create);
router.get("/ingredients", IngredientController.list);
router.get("/ingredients/:id", IngredientController.get);
router.get("/ingredients/name/:name", IngredientController.getByName);
router.put("/ingredients/:id", IngredientController.update);
router.delete("/ingredients/:id", IngredientController.delete);

// Recipes
router.post("/recipes", RecipeController.create);
router.get("/recipes", RecipeController.list);
router.get("/recipes/name/:name", RecipeController.getByName);
router.get("/recipes/:id", RecipeController.get);
router.put("/recipes/:id", RecipeController.update);
router.delete("/recipes/:id", RecipeController.delete);


// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Metrics Endpoint
router.get("/metrics", async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

export default router;
