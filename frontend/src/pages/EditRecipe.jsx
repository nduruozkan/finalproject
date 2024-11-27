import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: '',
        time: '',
        ingredients: '',
        instructions: ''
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const getData = async () => {
            await axios.get(`http://localhost:3001/api/recipes/${id}`)
                .then(response => {
                    let res = response.data
                    setRecipeData({
                        title: res.title,
                        ingredients: res.ingredients.join(","),
                        instructions: res.instructions,
                        time: res.time
                    })
                })
                .catch(error => {
                    console.error('Error fetching recipe:', error)
                })
        }
        getData()
    }, [id])

    const onHandleChange = (e) => {
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : e.target.value
        setRecipeData(prev => ({ ...prev, [e.target.name]: val }))
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault()
        console.log('Submitting recipe data:', recipeData)

        // Prepare the JSON data
        const jsonData = {
            title: recipeData.title,
            time: recipeData.time,
            ingredients: recipeData.ingredients, // Ensure it's an array
            instructions: recipeData.instructions
        }

        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem("token")
            if (!token) {
                throw new Error("No token found, please log in again")
            }

            // Send PUT request to update the recipe with token and JSON data
            const response = await axios.put(`http://localhost:3001/api/recipes/${id}`, jsonData, {
                headers: {
                    'Content-Type': 'application/json', // Sending JSON data
                    'Authorization': 'Bearer ' + token // Add Authorization header with Bearer token
                }
            })

            console.log("Recipe updated:", response.data)
            navigate("/myRecipe")

        } catch (error) {
            console.error("Error updating recipe:", error)
            alert("Error updating recipe: " + error.message)
        }
    }

    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title}></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions}></textarea>
                    </div>
                    <button type="submit">Edit Recipe</button>
                </form>
            </div>
        </>
    )
}
