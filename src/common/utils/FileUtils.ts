import { Directory, Filesystem } from '@capacitor/filesystem';

class FileUtils {
    
    public async isFileInDirectory(filename: string, directory: Directory) {
        const ret = await Filesystem.readdir({
            path: '/',
            directory: directory
        });

        let isFilePresent = false;
        for (let i = 0; i < ret.files.length; i++) {
          if (ret.files[i].name === filename) {
            isFilePresent = true;
            break;
          }
        }
        return isFilePresent;
    }

    public async writeFile(filename: string, data: string){
      return await Filesystem.writeFile({
          path: filename,
          data: btoa(data),
          directory: Directory.Data,
      });
    }

}

export default new FileUtils();
