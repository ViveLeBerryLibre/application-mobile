import { SQLiteDBConnection } from '@capacitor-community/sqlite';

export async function deleteDatabase(db: SQLiteDBConnection): Promise<void> {
  try {
    const ret: any = await db.isExists();
    if(ret.result) {
      await db.delete();
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  } catch (err) {
    return Promise.reject(err);
  }
}
