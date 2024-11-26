// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
  const recipes = useLoaderData(); // This is expected to fetch data from the route loader
  const [favItems, setFavItems] = useState(JSON.parse(localStorage.getItem("fav")) ?? []); // Initialize the state for favorites
  const navigate = useNavigate();
  const path = window.location.pathname === "/myRecipe";

  useEffect(() => {
    // This ensures that the component knows what to do when recipes data is available
    if (!recipes) {
      console.log('No recipes data received');
    } else {
      console.log('Received recipes:', recipes);
    }
  }, [recipes]);

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/recipes/${id}`);
      const updatedRecipes = recipes.filter(recipe => recipe.id !== id); // Use `id` instead of `_id`
      setFavItems(updatedRecipes); // Update the state with the new list after deletion

      const updatedFavorites = favItems.filter(recipe => recipe.id !== id); // Use `id` instead of `_id`
      localStorage.setItem("fav", JSON.stringify(updatedFavorites));
      setFavItems(updatedFavorites); // Update the state to reflect the change in favorites
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  const favRecipe = (item) => {
    const isFavorite = favItems.some(recipe => recipe.id === item.id); // Use `id` instead of `_id`
    const updatedFavorites = isFavorite
      ? favItems.filter(recipe => recipe.id !== item.id) // Use `id` instead of `_id`
      : [...favItems, item];

    localStorage.setItem("fav", JSON.stringify(updatedFavorites));
    setFavItems(updatedFavorites);
  };

  return (
    <div className='card-container'>
      {recipes?.map((item) => (
        <div key={item.id} className='card' onDoubleClick={() => navigate(`/recipe/${item.id}`)}> {/* Use `id` instead of `_id` */}
          <img src={`http://localhost:3001/images/${item.coverImage}`} width="120px" height="100px" alt={`${item.title} cover`} />
          <div className='card-body'>
            <div className='title'>{item.title}</div>
            <div className='icons'>
              <div className='timer'>
                <BsStopwatchFill /> {item.time}
              </div>
              {!path ? (
                <FaHeart 
                  onClick={() => favRecipe(item)}
                  style={{ color: favItems.some(res => res.id === item.id) ? "red" : "" }} // Use `id` instead of `_id`
                />
              ) : (
                <div className='action'>
                  <Link to={`/editRecipe/${item.id}`} className="editIcon"> {/* Use `id` instead of `_id` */}
                    <FaEdit />
                  </Link>
                  <MdDelete onClick={() => onDelete(item.id)} className='deleteIcon' /> {/* Use `id` instead of `_id` */}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
