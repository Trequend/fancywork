import Dexie from 'dexie';
import { SchemaStorage, WorkStorage } from 'lib/storage';
import { config } from './config';

const DB_NAME = 'fancywork';

export class Database {
  public readonly schemas: SchemaStorage;
  public readonly works: WorkStorage;

  private constructor(dexie: Dexie) {
    this.schemas = new SchemaStorage(dexie);
    this.works = new WorkStorage(dexie);
  }

  public static async open() {
    const dexie = new Dexie(DB_NAME, { autoOpen: false });
    config(dexie);
    await dexie.open();
    const database = new Database(dexie);
    return {
      database,
      close: () => {
        dexie.close();
      },
    };
  }
}
