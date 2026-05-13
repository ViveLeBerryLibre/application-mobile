import i18n from '@/plugins/i18n';
import { toastController } from '@ionic/vue';

class ErrorManager {

    private getMessageFromCodeError(codeError: number): string {
        if(codeError === 401){
            return 'app.error.unauthorized';
        } else if(codeError === 403){
            return 'app.error.missing.permission';
        } else if(codeError === 500){
            return 'app.error.server';
        } else {
            return 'app.error.undefined';
        }
    }

    public async processErrorCustomMessage(error: any, customErrorMessage: string){
        this.commonProcessError(error, customErrorMessage);
    }

    public async processError(error: any){
        this.commonProcessError(error, null);
    }

    public async processErrorCustomMessageWithTimer(error: any, customErrorMessage: string, timer: number | null){
        this.commonProcessError(error, customErrorMessage, timer);
    }

    private async commonProcessError(error: any, customErrorMessage: string | null, timer?: number | null){
        let errorMessage = i18n.global.t('app.error.undefined');
        if(customErrorMessage !== null){
            errorMessage = i18n.global.t(customErrorMessage);
        } else {
            if(error.response?.status !== undefined){
                if(error.response.data.message){
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = i18n.global.t(this.getMessageFromCodeError(error.response.status));
                }
            }
        }
        let errorToast;
        if (timer === null) {
            errorToast = await toastController.create({
                cssClass: 'toast-error-theming',
                message: errorMessage,
            });
        } else {
            errorToast = await toastController.create({
                cssClass: 'toast-error-theming',
                message: errorMessage,
                duration: timer ? timer : 2000,
            });
        }
        await errorToast.present();
    }

}

export default new ErrorManager();