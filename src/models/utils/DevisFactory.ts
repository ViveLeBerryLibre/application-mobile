import type { DevisDTO } from '@/models/DevisDTO';
import { Genre } from '@/models/DevisDTO';

export function createEmptyDevisDTO(): DevisDTO {
    return {
        cheminImage: '',
        redacteur: '',
        verificateur: '',
        interlocuteurDTO: {
            id: 0,
            prenom: '',
            nom: '',
            telephone: '',
            mail: '',
        },
        chantierDTO: {
            typeChantier: '',
            libelle: '',
            mission: '',
            adresseDTO: {
                libelle: '', codePostal: 0, nomRue: '', numero: 0, ville: ''
            },
            anneeConstruction: null,
            nature: '',
        },
        clientDTO: {
            adresseDTO: {
                libelle: '',
                numero: 0,
                nomRue: '',
                codePostal: 0,
                ville: '',
            },
            genre: Genre.MONSIEUR,
            nom: '',
            prenom: '',
            mail: '',
        },
        montant: 0,
        paragrapheUnDTO: {
            introduction: '',
            description: '',
            points: [],
        },
        paragrapheDeuxDTO: {
            rebouchage: false,
            interventionSurSite: 0,
            syntheseMin: 0,
            syntheseMax: 0,
            paragraphe24: {
                introduction: '',
                description: '',
                points: [],
            },
            paragraphe22: {
                introduction: '',
                description: '',
                points: [],
            },
        },
    };
}