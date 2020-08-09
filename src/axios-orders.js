import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://burger-builder-isuru.firebaseio.com/'
});

export default instance;