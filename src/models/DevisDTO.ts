export enum Genre {
    MONSIEUR = 'MONSIEUR',
    MADAME = 'MADAME',
}

export interface AdresseDTO {
    libelle: string;
    numero: number;
    nomRue: string;
    codePostal: number;
    ville: string;
}

export interface InterlocuteurDTO {
    id: number;
    prenom: string;
    nom: string;
    telephone: string;
    mail: string;
}

export interface ChantierDTO {
    typeChantier: string;
    libelle: string;
    adresse: string;
    anneeConstruction: number | null;
    nature: string;
}

export interface ClientDTO {
    adresseDTO: AdresseDTO;
    genre: Genre;
    nom: string;
    prenom: string;
    mail: string;
}

export interface ParagrapheDTO {
    introduction: string;
    description: string;
    points: string[];
}

export interface ParagrapheDeuxDTO {
    rebouchage: boolean;
    interventionSurSite: number;
    syntheseMin: number;
    syntheseMax: number;
    paragraphe24: ParagrapheDTO;
    paragraphe22: ParagrapheDTO;
}

export interface DevisDTO {
    redacteur: string;
    interlocuteurDTO: InterlocuteurDTO;
    chantierDTO: ChantierDTO;
    clientDTO: ClientDTO;
    montant: number;
    paragrapheUnDTO: ParagrapheDTO;
    paragrapheDeuxDTO: ParagrapheDeuxDTO;
}