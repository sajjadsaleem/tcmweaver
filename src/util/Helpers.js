import _ from 'lodash';



const setAccessToken = async (token) => {
    localStorage.setItem('ACCESS_TOKEN', token);
}

const setUser = async (user) => {
    if (!_.isEmpty(user)) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

const logout = async (token) => {
    localStorage.removeItem('user');
    localStorage.removeItem('ACCESS_TOKEN');
}


export {
    setAccessToken,
    setUser,
    logout,
}