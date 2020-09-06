import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

const auth = props => {
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },

        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });
    const [isSignUp, setIsSignUp] = useState(true);

    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;

    useEffect(() => {
        if(!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangedHandler = (event, controlName) => {
        const touchedControl = {
            value: event.target.value,
            valid: checkValidity(event.target.value, controls[controlName].validation),
            touched: true
        };

        const updatedControl  = updateObject(controls[controlName], touchedControl);
        const updatedControls = updateObject(controls, {[controlName] : updatedControl});
        
        setControls(updatedControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuthenticate(
            controls.email.value,
            controls.password.value,
            isSignUp
        );
    }

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    }

    const formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        });
    }      

    let form = formElementsArray.map(formElement =>(
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event, formElement.id)} />
    ));

    if(props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;
    if(props.error) {
        errorMessage = (
            <p>{props.error.message}</p>
        );
    }

    let authRedirect = null;
    if(props.isAuthenticated) {
            authRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">Submit</Button>
            </form>
            <Button 
                clicked={switchAuthModeHandler}
                btnType="Danger">SWITCH TO {isSignUp ? "SIGNIN" : "SIGNUP"}</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated : state.auth.token !== null,
        buildingBurger : state.burgerBuilder.building,
        authRedirectPath : state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticate : (email, password, isSignUp) => dispatch(actions.authenticate(email, password, isSignUp)),
        onSetAuthRedirectPath : () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);