import {http} from '@/common/utils/HttpService';
import {TexteDTO} from '@/common/types/TexteDTO';
import userData from '@/data/userData.json';

class NotesService {
    public async ameliorerLanguage(texte :string): Promise<string> {
        return http.post('/langage/ameliorer' , texte);
    }

    public async envoyerNotesServeur(texte :string): Promise<string> {
        const texteDto : TexteDTO = {
            texte : texte,
            utilisateur : userData.prenom
        };
        return http.post('/langage/enregistrer' , texteDto);
    }
}

export default new NotesService();