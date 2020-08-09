import React, { Component } from "react";

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
    salad : 0.5,
    bacon : 0.7,
    cheese : 0.4,
    meat : 1.3
}

class BurgerBuilder extends Component {
    state = {
        ingredients : null,

        totalPrice : 4,
        purchasable : false,
        purchasing : false,
        loading : false,
        error : false
    }

    componentDidMount() {
        axios.get('ingredients.json').then(response => {
            this.setState({ingredients : response.data});
        }).catch(error => {
            this.setState({error : true});
        });
    }

    updatePurchaseState(ingredients){
        const sum = Object.values(ingredients).reduce((total, count) => total + count, 0);

        this.setState({purchasable : sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            ingredients : updatedIngredients,
            totalPrice : newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount === 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            ingredients : updatedIngredients,
            totalPrice : newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing : true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing : false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        this.setState({loading : true});
        const order = {
            ingredients : this.state.ingredients,
            price : this.state.totalPrice,
            customer : {
                name : 'Isuru Herath',
                address : {
                    street : '16/1251 Plenty Rd',
                    suburb : 'Bundoora',
                    city : 'VIC',
                    postCode : 3083
                },
                email : 'isuruherath1@gmail.com'
            },
            deliveryMethod : 'fastest'
        }
        axios.post('orders.json', order)
            .then(response => {
                this.setState({loading : false, purchasing : false});
            })
            .catch(error => {
                this.setState({loading : false, purchasing : false});
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.state.ingredients) {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        ordered={this.purchaseHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}/>
                </Auxiliary>
            );

            orderSummary = <OrderSummary
                                ingredients={this.state.ingredients} 
                                price={this.state.totalPrice}
                                purchaseCancelled={this.purchaseCancelHandler}
                                purchaseContinued={this.purchaseContinueHandler}/>;
        }

        if(this.state.loading) {
            orderSummary = <Spinner />;
        }

        return(
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);