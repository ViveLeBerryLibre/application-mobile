import {http} from '@/common/utils/HttpService';
import userData from '@/data/userData.json';
import {UserDTO} from '@/common/types/UserDTO';

class UserService {
    public async getUser(): Promise<string> {
        const id = userData.id;
        console.log('coucouc');
        console.log(http.get(`/utilisateur/${id}`));
        return http.get(`/utilisateur/${id}`);
    }

    public async updateUser(user: UserDTO): Promise<string> {
        const id = userData.id;
        user.id = id;
        return http.post(`/utilisateur/${id}/update-mail` , user);
    }
}

export default new UserService();