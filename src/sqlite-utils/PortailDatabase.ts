import { ComponentInternalInstance } from 'vue';
import { SQLiteDBConnection } from 'vue-sqlite-hook';
import { createTable } from './ScriptDB';
import FileUtils from '@/common/utils/FileUtils';
import { Directory, Filesystem, Encoding } from '@capacitor/filesystem';
import { App } from '@capacitor/app';
import { deleteDatabase } from '@/common/utils/DeleteDBUtils';

class PortailDatabase {

    private dbName = 'portailDB';
    private versionFilename = 'version.txt';

    //on stocke la version de l'appli dans version.txt, puis a chaque lancement de l'appli on compare la verison du fichier avec la version actuelle de l'appli
    //si elle est différente on supprime la BDD sqlite
    public async checkAppUpdate(sqlite: any): Promise<void>{
        const versionActuelleAppli = (await App.getInfo()).version;
        const fileExists = await FileUtils.isFileInDirectory(this.versionFilename, Directory.Data);
        if(fileExists){
            const versionStockee = await Filesystem.readFile({
                path: this.versionFilename,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            if(typeof versionStockee.data !== 'string' || versionStockee.data.trim() !== versionActuelleAppli.trim()){
                await FileUtils.writeFile(this.versionFilename, versionActuelleAppli);
                await this.deleteDb(sqlite);
            }
        } else {
            await this.deleteDb(sqlite);
            await FileUtils.writeFile(this.versionFilename, versionActuelleAppli);
        }
    }

    private async deleteDb(sqlite: any): Promise<void>{
        const dbExists = await sqlite.isDatabase(this.dbName);
        if(dbExists){
            const db: SQLiteDBConnection = await sqlite.createConnection(this.dbName, false, 'no-encryption', 1);
            await deleteDatabase(db);
        }
    }

    public async initDatabase(sqlite: any): Promise<boolean>{
        const db = await this.prepareDatabase(sqlite);
        if(db === null){
            return false;
        }
        const response: any = await db.execute(createTable);
        return response.changes.changes >= 0;

    }

    private async prepareDatabase(sqlite: any): Promise<SQLiteDBConnection | null>{
        let db: SQLiteDBConnection;
        const response: any = await sqlite.isConnection(this.dbName);
        if(!response.result){
            db = await sqlite.createConnection(this.dbName, false, 'no-encryption', 1);
        }else{
            db = await sqlite.retrieveConnection(this.dbName);
        }
        await db.open();
        return db;
    }

    public async openDatabase(app: ComponentInternalInstance | null): Promise<SQLiteDBConnection | null> {
        const sqlite =  app?.appContext.config.globalProperties.$sqlite;
        const db: SQLiteDBConnection =  await sqlite.retrieveConnection(this.dbName);
        const databaseOpen = await db.isDBOpen();
        if(databaseOpen.result === true){
            return db;
        }
        await db.open();
        return db;
    }

}
export default new PortailDatabase();