// controllers/recipeController.js
const recipeModel = require('../models/recipe');
const db = require('../connectionDb'); // Adjust the path based on your project structure


// Controller to create a new recipe
function createRecipe(req, res) {
    console.log("Received data:", req.body); // Log the incoming request body

    const { title, ingredients, instructions } = req.body;

    if (!title || !ingredients || !instructions) {
        console.error("Validation error: Missing required fields"); // Log error
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Proceed with creating the recipe
    recipeModel.createRecipe(req.body, (err, recipeId) => {
        if (err) {
            console.error("Database error:", err.message); // Log database error
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: recipeId, message: "Recipe created successfully" });
    });
}


// Controller to get a recipe by ID
function getRecipeById(req, res) {
    recipeModel.getRecipeById(req.params.id, (err, recipe) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!recipe) return res.status(404).json({ error: "Recipe not found 0" });
        res.json(recipe);
    });
}

// Controller to update a recipe
function updateRecipe(req, res) {
    const recipeId = req.params.id;
    const updatedData = req.body;

    recipeModel.updateRecipe(recipeId, updatedData, (err, changes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (changes === 0) return res.status(404).json({ error: "Recipe not found 1" });
        res.json({ message: "Recipe updated successfully" });
    });
}

// Controller to delete a recipe
function deleteRecipe(req, res) {
     console.log("Attempting to delete recipe with id:", id);
    recipeModel.deleteRecipe(req.params.id, (err, changes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (changes === 0) return res.status(404).json({ error: "Recipe not found 2" });
        res.json({ message: "Recipe deleted successfully" });
    });
}
function getAllRecipes(req, res) {
    const query = `SELECT * FROM recipes`; // Adjust the query as necessary
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Send back the array of recipes
    });
}

module.exports = {
    createRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getAllRecipes
};

