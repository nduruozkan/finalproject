// eslint-disable-next-line no-unused-vars
import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'

// Fetch all recipes
const getAllRecipes = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/recipes");
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Get recipes created by the logged-in user
const getMyRecipes = async () => {
  // Retrieve user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
 console.log("user", user);
  // If no user is found, handle the case (e.g., return empty array or show login prompt)
  if (!user) {
    console.error("User not found. Please log in.");
    // Optionally redirect to login
    // navigate('/login'); // Uncomment this line if you want to navigate to the login page
    return []; // Return an empty array if no user is logged in
  }

  // If the user exists, fetch all recipes and filter based on user._id
  const allRecipes = await getAllRecipes();
  return allRecipes.filter(item => item.createdBy === user.id);
};

// Get favorite recipes from localStorage
const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav"));
};

// Get a single recipe by ID
const getRecipe = async ({ params }) => {
  let recipe;
  await axios.get(`http://localhost:3001/recipes/${params.id}`)
    .then(res => recipe = res.data);

  await axios.get(`http://localhost:3001/users/${recipe.createdBy}`)
    .then(res => {
      recipe = { ...recipe, email: res.data.email };
    });

  return recipe;
};

// Define the router and paths
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
]);

// Main App component
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
