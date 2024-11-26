const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file

describe('Recipe API - Professional Standards', () => {
    let token;
    let createdRecipeId;

    // Before running tests, obtain a valid JWT token and create a recipe
    beforeAll(async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({ username: 'testuser', password: 'password123' });
        token = response.body.token;

        // Create a recipe to ensure it exists for other tests
        const recipeResponse = await request(app)
            .post('/api/recipes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Recipe',
                ingredients: 'Ingredient1, Ingredient2',
                instructions: 'Step 1, Step 2',
                time: '30 minutes',
                coverImage: 'image_url'
            });
        createdRecipeId = recipeResponse.body.id;
    });

    // Test for Consistent Naming and REST Standards
    describe('Endpoint Naming and REST Standards', () => {
        test('GET /api/recipes returns status 200', async () => {
            const response = await request(app).get('/api/recipes');
            expect(response.statusCode).toBe(200);
        });

        test('GET /api/recipes/:id returns status 200 if found', async () => {
            const response = await request(app).get(`/api/recipes/${createdRecipeId}`);
            expect(response.statusCode).toBe(200);
        });

        test('POST /api/recipes returns status 201 on creation', async () => {
            const response = await request(app).post('/api/recipes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'New Test Recipe',
                    ingredients: 'Ingredient1, Ingredient2',
                    instructions: 'Step 1, Step 2',
                    time: '30 minutes',
                    coverImage: 'image_url'
                });
            expect(response.statusCode).toBe(201);
        });
    });

    // Test for Error Handling and Validation
    describe('Error Handling and Validation', () => {
        test('POST /api/recipes returns 400 for invalid data', async () => {
            const response = await request(app).post('/api/recipes')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: '', ingredients: '', time: '' }); // Invalid data
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toMatch(/missing required fields/i);
        });
    });

    // Test for Authentication and Authorization
    describe('Authentication and Authorization', () => {
        test('POST /api/recipes returns 401 if no token is provided', async () => {
            const response = await request(app).post('/api/recipes')
                .send({
                    title: 'Unauthorized Test',
                    ingredients: 'Ingredient1, Ingredient2',
                    instructions: 'Step 1, Step 2',
                    time: '30 minutes',
                    coverImage: 'image_url'
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toMatch(/access denied/i);
        });
    });
});
