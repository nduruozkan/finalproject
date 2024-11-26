// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    time: '',
    ingredients: '',
    instructions: '',
    image_url: '' // Image URL is optional now
  });

  const navigate = useNavigate();

  // Handle form input changes
  const onHandleChange = (e) => {
    let val = e.target.name === "ingredients" ? e.target.value.split(",").map(item => item.trim()) : e.target.value; // Trim whitespace
    setRecipeData(prev => ({ ...prev, [e.target.name]: val }));
  };
   
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("User not logged in. Please log in again.");
      return;
    }
  // Handle form submission
  const onHandleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent as JSON
    const jsonData = {
      title: recipeData.title,
      time: recipeData.time,
      ingredients: recipeData.ingredients, // Sending as an array
      instructions: recipeData.instructions,
      coverImage: recipeData.image_url || null, // Optional cover image
      createdBy: user.id
    };

    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
      console.log("Sending request with token:", token); // Log token for debugging
      if (!token) {
        throw new Error("No token found, please log in again");
      }

      // Send POST request to create the recipe
      const response = await axios.post("http://localhost:3001/api/recipes", jsonData, {
        headers: {
          'Content-Type': 'application/json', // Sending JSON data
          'Authorization': 'Bearer ' + token  // Ensure the token is included in the Authorization header
        }
      });

      console.log("Recipe added:", response.data); // Log success response

      // Redirect after successful recipe creation
      navigate("/");

    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Error adding recipe: " + error.message);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={onHandleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input type="text" className="input" name="title" value={recipeData.title} onChange={onHandleChange} />
        </div>
        <div className="form-control">
          <label>Time</label>
          <input type="text" className="input" name="time" value={recipeData.time} onChange={onHandleChange} />
        </div>
        <div className="form-control">
          <label>Ingredients (comma separated)</label>
          <textarea className="input-textarea" name="ingredients" rows="5" value={recipeData.ingredients} onChange={onHandleChange}></textarea>
        </div>
        <div className="form-control">
          <label>Instructions</label>
          <textarea className="input-textarea" name="instructions" rows="5" value={recipeData.instructions} onChange={onHandleChange}></textarea>
        </div>
        <div className="form-control">
          <label>Recipe Image URL</label>
          <input type="text" className="input" name="image_url" value={recipeData.image_url} onChange={onHandleChange} placeholder="Enter image URL (optional)" />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}
