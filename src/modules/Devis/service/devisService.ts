import {http} from '@/common/utils/HttpService';
import userData from '@/data/userData.json';
import {DevisDTO} from '@/models/DevisDTO';

class DevisService {
    public async genererDevis(devisDTO :DevisDTO): Promise<string> {
        return http.post('/devis/genererWord' , devisDTO);
    }

    public async sauvegarderDevis(devisDTO :DevisDTO): Promise<string> {
        return http.post('/devis/enregistrer' , devisDTO);
    }

    public async getAllDevis(): Promise<any> {
        const userId = userData.id;
        return http.get(`/devis/${userId}`);
    }
}

export default new DevisService();