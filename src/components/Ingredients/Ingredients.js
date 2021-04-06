import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError]= useState(null);
  // useEffect(() => {
  //   fetch('https://hooks-f79e5-default-rtdb.firebaseio.com/ingredients.json')
  //   .then(response => response.json()
  //   ).then(responseData => {
  //     const loadedIngredients=[];
  //     for(const key in responseData) {
  //       loadedIngredients.push({
  //         id:key,
  //         title:responseData[key].title,
  //         amount: responseData[key].amount
  //       });
  //     }
  //   setUserIngredients(loadedIngredients);
  //   });
  // },[]);//acts like componentDidMount with an empty array

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  },[]);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://hooks-f79e5-default-rtdb.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{ 'Content-Type' : 'application/json'}
    }).then(response =>{
      setIsLoading(false);
      return response.json();
    }).then(responseData =>{
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        { id : responseData.name, ...ingredient}
      ]);
    }).catch(error => {
      setError("Something went wrong");
    });
  }

  // const addIngredientHandler = ingredient => {
    
  //   const userIngredient = setUserIngredients(prevIngredients => [
  //     ...prevIngredients,
  //     {id :Math.random().toString(), ...ingredient}
  //   ]);

  //   axios.post('https://hooks-f79e5-default-rtdb.firebaseio.com/ingredients.json',userIngredient)
  //   .then(response => {
  //     console.log(response);
  //   })
  //   .catch(error =>{
  //     console.log(error);
  //   });
  // }


  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(`https://hooks-f79e5-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,{
      method:'DELETE'
    }).then(response => {
      setIsLoading(true)
      setUserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      setError("Something went wrong");
      isLoading(false);
    });
  }

  const clearError =() => {
    setError(null);
  }
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm  onAddIngredient ={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search  onLoadIngredients ={filteredIngredientsHandler}/>
          <IngredientList ingredients = {userIngredients}
          onRemoveItem= {removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
