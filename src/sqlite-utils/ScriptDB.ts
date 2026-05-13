export const createTable = `
CREATE TABLE IF NOT EXISTS T_EQUIPMENT  (
    id INTEGER PRIMARY KEY NOT NULL,
    libelle TEXT,
    phaseId INTEGER NOT NULL UNIQUE,
    phaseLibelle TEXT,
    groupeLibelle TEXT,
    sousGroupeLibelle TEXT,
    chantierId INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS T_DEMANDE_EN_COURS (
    id INTEGER PRIMARY KEY NOT NULL,
    libelle TEXT,
    etatDemande TEXT NOT NULL,
    demandeur TEXT,
    horodatage TEXT,
    phaseId INTEGER NOT NULL,
    FOREIGN KEY (phaseId) REFERENCES T_EQUIPMENT(phaseId) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS T_TYPE_INTERVENTION (
    id INTEGER PRIMARY KEY NOT NULL,
    libelle TEXT,
    chantierId INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS T_DELAIS_INTERVENTION (
    id INTEGER PRIMARY KEY NOT NULL,
    isAutre INTEGER NOT NULL,
    libelle TEXT,
    typeInterventionId INTEGER NOT NULL,
    FOREIGN KEY (typeInterventionId) REFERENCES T_TYPE_INTERVENTION(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS T_ETAT_EQUIPMENT (
    id INTEGER PRIMARY KEY NOT NULL,
    libelle TEXT,
    normal INTEGER NOT NULL,
    criticite TEXT
);
CREATE TABLE IF NOT EXISTS T_DEMANDE_INTERVENTION (
    id INTEGER PRIMARY KEY NOT NULL,
    chantierId INTEGER NOT NULL,
    commentaire TEXT,
    dateAutre TEXT,
    delaisId INTEGER NOT NULL,
    etatEquipmentId INTEGER,
    object TEXT NOT NULL,
    phaseId INTEGER,
    reccurence INTEGER NOT NULL,
    suivi INTEGER NOT NULL,
    dateCreation TEXT NOT NULL,
    compteId number,
    adresseSiteId INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS T_CONTACT_SITE (
    id INTEGER PRIMARY KEY NOT NULL,
    nomPrenom TEXT,
    telephone TEXT,
    demandeInterventionId INTEGER NOT NULL,
    FOREIGN KEY (demandeInterventionId) REFERENCES T_DEMANDE_INTERVENTION(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS T_CONTACT (
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    demandeInterventionId INTEGER NOT NULL,
    FOREIGN KEY (demandeInterventionId) REFERENCES T_DEMANDE_INTERVENTION(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS T_ATTACHMENT (
    id INTEGER PRIMARY KEY NOT NULL,
    fileName TEXT,
    data TEXT NOT NULL,
    type TEXT NOT NULL,
    demandeInterventionId INTEGER NOT NULL,
    FOREIGN KEY (demandeInterventionId) REFERENCES T_DEMANDE_INTERVENTION(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS T_DEMANDE_DEVIS (
    id INTEGER PRIMARY KEY NOT NULL,
    chantierId INTEGER NOT NULL,
    objet TEXT NOT NULL,
    description TEXT NOT NULL,
    delais TEXT NOT NULL,
    createdDate TEXT NOT NULL,
    compteId number
);
CREATE TABLE IF NOT EXISTS T_ATTACHMENT_DEVIS (
    id INTEGER PRIMARY KEY NOT NULL,
    fileName TEXT,
    data TEXT NOT NULL,
    type TEXT NOT NULL,
    demandeDevisId INTEGER NOT NULL,
    FOREIGN KEY (demandeDevisId) REFERENCES T_DEMANDE_DEVIS(id) ON DELETE CASCADE
);

PRAGMA foreign_keys = ON;
`;

export const insertTypeIntervention = `
INSERT OR REPLACE INTO T_TYPE_INTERVENTION (id, libelle, chantierId) VALUES (?,?,?);
`;

export const insertDelaisIntervention = `
INSERT OR REPLACE INTO T_DELAIS_INTERVENTION (id, isAutre, libelle, typeInterventionId) VALUES (?,?,?,?);
`;

export const insertEquipment = `
INSERT OR REPLACE INTO T_EQUIPMENT (id, libelle, phaseId, phaseLibelle, groupeLibelle, sousGroupeLibelle, chantierId) VALUES (?,?,?,?,?,?,?);
`;

export const insertDemandeEnCours = `
INSERT OR REPLACE INTO T_DEMANDE_EN_COURS (id, libelle, etatDemande, demandeur, horodatage, phaseId) VALUES (?,?,?,?,?,?);
`;

export const insertEtatEquipment = `
INSERT OR REPLACE INTO T_ETAT_EQUIPMENT (id, libelle, normal, criticite) VALUES (?,?,?,?);
`;

export const insertDemandeIntervention = `
INSERT OR REPLACE INTO T_DEMANDE_INTERVENTION (chantierId, commentaire, dateAutre, delaisId, etatEquipmentId, object, phaseId, reccurence, suivi, dateCreation, compteId, adresseSiteId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);
`;

export const insertContactSurSite = `
INSERT OR REPLACE INTO T_CONTACT_SITE (nomPrenom, telephone, demandeInterventionId) VALUES (?,?,?);
`;

export const insertContactDemandeIntervention = `
INSERT OR REPLACE INTO T_CONTACT (email, demandeInterventionId) VALUES (?,?);
`;

export const insertAttachmentDemandeIntervention = `
INSERT OR REPLACE INTO T_ATTACHMENT (fileName, data, type, demandeInterventionId) VALUES (?,?,?,?);
`;

export const insertDemandeDevis = `
INSERT OR REPLACE INTO T_DEMANDE_DEVIS (chantierId, objet, description, delais, createdDate, compteId) VALUES (?,?,?,?,?,?);
`;

export const insertAttachmentDemandeDevis = `
INSERT OR REPLACE INTO T_ATTACHMENT_DEVIS (fileName, data, type, demandeDevisId) VALUES (?,?,?,?);
`;

export const selectTypeIntervention = `
SELECT id, libelle FROM T_TYPE_INTERVENTION WHERE chantierId = ? ORDER BY libelle;
`;

export const selectDelaisIntervention = `
SELECT id, isAutre, libelle FROM T_DELAIS_INTERVENTION WHERE typeInterventionId = ? ORDER BY libelle;
`;

export const selectEquipment = `
SELECT id, libelle, phaseId, phaseLibelle, groupeLibelle, sousGroupeLibelle FROM T_EQUIPMENT WHERE chantierId = ?;
`;

export const selectEquipmentById = `
SELECT id, libelle, phaseId, phaseLibelle, groupeLibelle, sousGroupeLibelle FROM T_EQUIPMENT WHERE id = ?;;
`;

export const selectWithSearchEquipment = `
SELECT id, libelle, phaseId, phaseLibelle, groupeLibelle, sousGroupeLibelle FROM T_EQUIPMENT WHERE chantierId = ?1 and ((libelle || ' ' || phaseLibelle) like ?2 or groupeLibelle like ?2 or sousGroupeLibelle like ?2);
`;

export const selectEtatEquipment = `
SELECT id, libelle, criticite, normal FROM T_ETAT_EQUIPMENT;
`;

export const selectDemandeEnCours = `
SELECT id, libelle, etatDemande, demandeur, horodatage, phaseId FROM T_DEMANDE_EN_COURS WHERE phaseId = ?;
`;

export const selectDemandeInterventionAEnvoyerById = `
SELECT id, chantierId, commentaire, dateAutre, delaisId, etatEquipmentId, object, phaseId, reccurence, suivi, dateCreation, adresseSiteId FROM T_DEMANDE_INTERVENTION WHERE id = ? AND compteId = ?;
`;

export const selectDemandeInterventionAEnvoyer = `
SELECT id, chantierId, commentaire, dateAutre, delaisId, etatEquipmentId, object, phaseId, reccurence, suivi, dateCreation, adresseSiteId FROM T_DEMANDE_INTERVENTION WHERE compteId = ?;
`;

export const selectDemandeDevisAEnvoyerById = `
SELECT id, chantierId, objet, description, delais, createdDate FROM T_DEMANDE_DEVIS WHERE id = ? and compteId = ?;
`;

export const selectDemandeDevisAEnvoyer = `
SELECT id, chantierId, objet, description, delais, createdDate FROM T_DEMANDE_DEVIS WHERE compteId = ?;
`;

export const selectDemandeContactSite = `
SELECT nomPrenom, telephone FROM T_CONTACT_SITE WHERE demandeInterventionId = ?;
`;

export const selectDemandeContact = `
SELECT email FROM T_CONTACT WHERE demandeInterventionId = ?;
`;

export const selectDemandeAttachment = `
SELECT fileName, data, type FROM T_ATTACHMENT WHERE demandeInterventionId = ?;
`;

export const selectDemandeDevisAttachment = `
SELECT fileName, data, type FROM T_ATTACHMENT_DEVIS WHERE demandeDevisId = ?;
`;

export const deleteDemandeInterventionAEnvoyer = `
DELETE FROM T_DEMANDE_INTERVENTION WHERE id = ?;
`;

export const deleteDemandeDevisAEnvoyer = `
DELETE FROM T_DEMANDE_DEVIS WHERE id = ?;
`;





