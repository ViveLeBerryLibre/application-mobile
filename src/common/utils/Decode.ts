class Decode {
    //Converti un blob en base64
    public async convertBlobToBase64(blob: Blob): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
        
    }
}

export default new Decode();

