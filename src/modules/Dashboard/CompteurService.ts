import {http} from '@/common/utils/HttpService';

class CompteurService {
    public async getCompteur(): Promise<string> {
        return http.get('/devis/compteur');
    }

    public async setCompteur(compteur: number): Promise<string> {
        return http.post(`/devis/compteur?valeurCompteur=${compteur}`);
    }
}

export default new CompteurService();