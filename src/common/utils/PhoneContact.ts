import { Contacts }  from '@ionic-native/contacts';
class PhoneContact {
    //permet de choisir un contact dans les contacts du téléphone
    public async pickContactFromTelephone(): Promise<any> {
        const contacts = new Contacts();
        return new Promise((resolve) => {
            contacts.pickContact().then((contact) => {
                if(contact !== null && contact !== undefined){
                    resolve(contact);
                }else{
                    resolve('');
                }
            });
        });
    }
}

export default new PhoneContact();