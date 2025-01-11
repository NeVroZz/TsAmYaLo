import axios from 'axios';

export const login = async (email: string, password: string) => {
    const response = await axios.post('https://realwordapi.nouwillcode.com/users/login', {
        user: { email, password },
    });
    return response.data;
};
