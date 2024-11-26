// models/recipe.js
const db = require('../connectionDb.js');

// Function to create a new recipe
function createRecipe(recipe, callback) {
    const { title, ingredients, instructions, time, coverImage, createdBy } = recipe;
    db.run(
        `INSERT INTO recipes (title, ingredients, instructions, time, coverImage, createdBy) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, JSON.stringify(ingredients), instructions, time, coverImage, createdBy],
        function (err) {
            callback(err, this ? this.lastID : null);
        }
    );
}

// Function to retrieve a recipe by ID
const saveRecipe = (data, callback) => {
    const ingredients = JSON.stringify(data.ingredients);
    db.run(
        `INSERT INTO recipes (title, ingredients, instructions, time, coverImage) VALUES (?, ?, ?, ?, ?)`,
        [data.title, ingredients, data.instructions, data.time, data.coverImage],
        function (err) {
            callback(err, { id: this.lastID });
        }
    );
};

// Retrieve ingredients and parse as JSON only if it’s a valid JSON string
const getRecipeById = (id, callback) => {
    db.get(`SELECT * FROM recipes WHERE id = ?`, [id], (err, row) => {
        if (row && row.ingredients) {
            try {
                row.ingredients = JSON.parse(row.ingredients);
            } catch (e) {
                console.error("Invalid JSON format for ingredients:", e);
            }
        }
        callback(err, row);
    });
};

// Function to update a recipe
function updateRecipe(id, recipeData, callback) {
    const { title, ingredients, instructions, time, coverImage } = recipeData;

    // Construct the SQL update statement
    const updates = [];
    const params = [];

    if (title) {
        updates.push(`title = ?`);
        params.push(title);
    }
    if (ingredients) {
        updates.push(`ingredients = ?`);
        params.push(ingredients);
    }
    if (instructions) {
        updates.push(`instructions = ?`);
        params.push(instructions);
    }
    if (time) {
        updates.push(`time = ?`);
        params.push(time);
    }
    if (coverImage) {
        updates.push(`coverImage = ?`);
        params.push(coverImage);
    }

    // Add the recipe ID to the parameters
    params.push(id);

    const query = `UPDATE recipes SET ${updates.join(', ')} WHERE id = ?`;

    db.run(query, params, function (err) {
        if (err) return callback(err);
        callback(null, this.changes); // this.changes gives the number of rows updated
    });
}


// Function to delete a recipe
function deleteRecipe(id, callback) {
    db.run(
        `DELETE FROM recipes WHERE id = ?`,
        [id],
        function (err) {
            callback(err, this.changes); // Returns number of rows affected
        }
    );
}
function getAllRecipes(callback) {
    const query = `SELECT * FROM recipes`;
    db.all(query, [], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows); // Return the recipes
    });
}

// Export the CRUD functions
module.exports = {
    createRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getAllRecipes
};
