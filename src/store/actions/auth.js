import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('EXPIRATION_TIME');
    localStorage.removeItem('USER_ID');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

export const authenticate = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email : email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD4NCzL6lVYIUegYYcEm_1n8viSwcaTV4Q';
        if(!isSignUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD4NCzL6lVYIUegYYcEm_1n8viSwcaTV4Q'
        }
        axios.post(url, authData)
        .then(response => {
            const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('TOKEN', response.data.idToken);
            localStorage.setItem('EXPIRATION_TIME', expirationTime);
            localStorage.setItem('USER_ID', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeOut(response.data.expiresIn));
        })
        .catch(err => {
            dispatch(authFail(err.response.data.error));
        });
    }
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token          = localStorage.getItem('TOKEN');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationTime = new Date(localStorage.getItem('EXPIRATION_TIME'));
            if(expirationTime <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('USER_ID');
                dispatch(authSuccess(token, userId));
                const expiresIn = expirationTime.getTime() - new Date().getTime();
                dispatch(checkAuthTimeOut(expiresIn/1000));
            }
        }
    };
};