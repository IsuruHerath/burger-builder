import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};


const addIngredient = (state, action) => {
    const addedIngredient = {
        [action.ingredientName]: state.ingredients[action.ingredientName] + 1
    };
    const addedIngredients = updateObject(state.ingredients, addedIngredient);
    const stateAfterAdd = {
        ingredients : addedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    };
    return updateObject(state, stateAfterAdd);
};

const removeIngredient = (state, action) => {
    const removedIngredient = {
        [action.ingredientName]: state.ingredients[action.ingredientName] - 1
    };
    const removedIngredients = updateObject(state.ingredients, removedIngredient);
    const stateAfterRemove = {
        ingredients : removedIngredients,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        building: true
    };
    return updateObject(state, stateAfterRemove);
};

const setIngredient = (state, action) => {
    const stateAfterSet = {
        ingredients : {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        totalPrice: 4,
        error: false,
        building: false
    };
    return updateObject(state, stateAfterSet);
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_INGREDIENT:
            return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT:
            return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS:
            return setIngredient(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return updateObject(state, {error: true});
        default:
            return state;
    }
};

export default reducer;