import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { store } from '@/plugins/store';
import Decode  from './Decode';
import { Attachment } from '../types/Attachment';
import { alertController } from '@ionic/vue';
import i18n from '@/plugins/i18n';

class PhotoGallery {

    private attachmentsMaximumSize = 41943040;//40mb

    public async takePhoto (type: string, savePictureMutationName: string, attachmentsGlobalSize?: number) {
        let cameraPhoto = null; 
        if(type === 'gallery'){
            //on ouvre l'appareil photo en mode gallery
            cameraPhoto = await Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos,
                quality: 100
            });
        } else if(type === 'camera'){
            //on ouvre l'appareil photo en mode caméra
            cameraPhoto = await Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
                quality: 100
            });
        }
        //on génère un nom et on sauvegarde la photo
        const fileName = new Date().getTime() + '.' + cameraPhoto?.format;
        if(cameraPhoto){
            this.savePicture(cameraPhoto, fileName, savePictureMutationName, attachmentsGlobalSize);
        }
    }

    private async savePicture(photo: Photo,  name: string, mutationName: string, attachmentsGlobalSize?: number) {
        //on va chercher la photo via son webPath
        const response = await fetch(photo.webPath!);
        //on transforme en blob
        const blob = await response.blob();
        if(this.isAttachmentTooBig(blob.size, attachmentsGlobalSize)){
            return;
        }
        //et on récupère la valeur base64 du blob
        const base64Data = await Decode.convertBlobToBase64(blob) as string;
        //on sauvegarde le fichier
        const savedFile: Attachment = {
            fileName: name,
            data: base64Data,
            type: `image/${photo.format}`,
            size: blob.size,
        };
        store.commit(mutationName, savedFile);
    }


    //Récupère la réponse de l'input file et enregistre le(s) fichier(s) séléctionné
    public async chooseFile (event: any, savePictureMutationName: string, attachmentsGlobalSize?: number) {
        if(event.target?.files !== null){
            const files = event.target.files;
            if(this.areAttachmentsTooBig(files, attachmentsGlobalSize)){
                return;
            }
            Array.from(files).forEach(async (file: any) => {
                const base64Data = await Decode.convertBlobToBase64(file) as string;
                const savedFile: Attachment  = {
                    fileName: file.name,
                    data: base64Data,
                    type: file.type,
                    size: file.size,
                };
                store.commit(savePictureMutationName, savedFile);
            });
        }
    }

    private areAttachmentsTooBig(files: any, attachmentsGlobalSize: number | undefined){
        if(attachmentsGlobalSize !== undefined){
            let newAttachmentsSize = 0;
            Array.from(files).forEach((file: any) => { newAttachmentsSize += file.size; });
            return this.isAttachmentTooBig(newAttachmentsSize, attachmentsGlobalSize);
        }
        return false;
    }

    private isAttachmentTooBig(newAttachmentsSize: number, attachmentsGlobalSize: number | undefined){
        if(attachmentsGlobalSize !== undefined && (newAttachmentsSize + attachmentsGlobalSize >= this.attachmentsMaximumSize)){
            this.alertAttachmentsTooBig();
            return true;
        }
        return false;
    }

    private async alertAttachmentsTooBig(){
        const alert = await alertController.create({
            header: i18n.global.t('app.attachments.size.alert.title'),
            message: i18n.global.t('app.attachments.size.alert.message'),
            buttons: [{
                text: i18n.global.t('app.attachments.size.alert.ok'),
                handler: () => {
                    alert.dismiss();
                }
            }]
        });
        await alert.present();
    }
}

export default new PhotoGallery();