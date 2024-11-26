const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController'); // To access authentication

// Create recipe (protected)
router.post('/', userController.authenticateToken, recipeController.createRecipe); // Changed from '/recipes' to '/'

// Get all recipes (public)
router.get('/', recipeController.getAllRecipes); // Add this line

// Get recipe by ID (public)
router.get('/:id', recipeController.getRecipeById); // Changed from '/recipes/:id' to '/:id'

// Update recipe (protected)
router.put('/:id', userController.authenticateToken, recipeController.updateRecipe); // Changed from '/recipes/:id' to '/:id'

// Delete recipe (protected)
router.delete('/:id', userController.authenticateToken, recipeController.deleteRecipe); // Changed from '/recipes/:id' to '/:id'



module.exports = router;
