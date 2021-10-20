import { Schema, Work } from 'src/core/types';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'fancywork';

const SCHEMAS_STORE = 'schemas';
const WORKS_STORE = 'works';

export type StoreMap = {
  [SCHEMAS_STORE]: Schema;
  [WORKS_STORE]: Work;
};

export type AppStore = keyof StoreMap;

const STORES: Array<AppStore> = [SCHEMAS_STORE, WORKS_STORE];

export class AppStorage {
  private constructor(private readonly database: IDBPDatabase) {}

  public async add<K extends AppStore>(storeName: K, value: StoreMap[K]) {
    await this.database.add(storeName, value);
  }

  public async save<K extends AppStore>(storeName: K, value: StoreMap[K]) {
    await this.database.put(storeName, value);
  }

  public async delete<K extends AppStore>(storeName: K, id: string) {
    await this.database.delete(storeName, id);
  }

  public async getCount<K extends AppStore>(storeName: K) {
    return await this.database.count(storeName);
  }

  public async get<K extends AppStore>(storeName: K, id: string) {
    return await this.database.get(storeName, id);
  }

  public async getRange<K extends AppStore>(
    storeName: K,
    count: number,
    start?: number
  ) {
    const transaction = this.database.transaction(storeName, 'readonly');
    let cursor = await transaction.store.openCursor();
    const result: Array<StoreMap[K]> = [];

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
        const register = (storeName: AppStore) => {
          database.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: false,
          });
        };

        STORES.forEach((storeName) => register(storeName));
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
