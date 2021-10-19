import { Schema } from 'src/core/types';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'fancywork';

const SCHEMAS_STORE = 'schemas';

export class AppStorage {
  private constructor(private readonly database: IDBPDatabase) {}

  public async addSchema(schema: Schema) {
    await this.database.add(SCHEMAS_STORE, schema);
  }

  public async saveSchema(schema: Schema) {
    await this.database.put(SCHEMAS_STORE, schema);
  }

  private close() {
    this.database.close();
  }

  public static async open() {
    const database = await openDB(DB_NAME, 1, {
      upgrade(database) {
        database.createObjectStore(SCHEMAS_STORE, {
          keyPath: 'id',
          autoIncrement: false,
        });
      },
    });

    const appStorage = new AppStorage(database);
    return {
      appStorage,
      closeStorage: () => {
        appStorage.close();
      },
    };
  }
}
