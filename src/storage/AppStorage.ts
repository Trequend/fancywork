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

  public async deleteSchema(id: string) {
    await this.database.delete(SCHEMAS_STORE, id);
  }

  public async getSchemasCount() {
    return await this.database.count(SCHEMAS_STORE);
  }

  public async getSchemas(count: number, start?: number) {
    const transaction = this.database.transaction(SCHEMAS_STORE, 'readonly');
    let cursor = await transaction.store.openCursor();
    const result: Array<Schema> = [];

    if (cursor && start && start > 0) {
      cursor = await cursor.advance(start);
    }

    while (cursor && count > 0) {
      result.push(cursor.value);
      cursor = await cursor.continue();
      count--;
    }

    return result;
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
