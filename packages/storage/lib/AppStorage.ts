import { Schema, Work } from '@fancywork/core';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'fancywork';

const SCHEMAS_STORE = 'schemas';
const WORKS_STORE = 'works';

export type Model<T> = T & { _index: number };

export type StoreMap = {
  [SCHEMAS_STORE]: Model<Schema>;
  [WORKS_STORE]: Model<Work>;
};

export type IndexMap = {
  [SCHEMAS_STORE]: 'id' | 'createdAt';
  [WORKS_STORE]: 'id' | 'createdAt' | 'lastActivity';
};

export type AppStore = keyof StoreMap;

export type GetRangeOptions<K extends AppStore> = {
  count: number;
  start?: number;
  index?: IndexMap[K];
  query?: IDBKeyRange | IDBValidKey | null;
  direction?: IDBCursorDirection;
};

export class AppStorage {
  private constructor(private readonly database: IDBPDatabase) {}

  public async add<K extends AppStore>(
    storeName: K,
    value: Omit<StoreMap[K], keyof Model<{}>>
  ) {
    await this.database.add(storeName, value);
  }

  public async save<K extends AppStore>(storeName: K, value: StoreMap[K]) {
    await this.database.put(storeName, value);
  }

  public async delete<K extends AppStore>(storeName: K, index: number) {
    await this.database.delete(storeName, index);
  }

  public async getCount<K extends AppStore>(storeName: K) {
    return await this.database.count(storeName);
  }

  public async get<K extends AppStore>(storeName: K, index: number) {
    return (await this.database.get(storeName, index)) as
      | StoreMap[K]
      | undefined;
  }

  public async getById<K extends AppStore>(storeName: K, id: string) {
    return (await this.database.getFromIndex(storeName, 'id', id)) as
      | StoreMap[K]
      | undefined;
  }

  public async getRange<K extends AppStore>(
    storeName: K,
    options: GetRangeOptions<K>
  ) {
    const transaction = this.database.transaction(storeName, 'readonly');

    const { index, query, direction } = options;
    let cursor =
      index === undefined
        ? await transaction.store.openCursor(query, direction)
        : await transaction.store.index(index).openCursor(query, direction);

    const result: Array<StoreMap[K]> = [];

    const { start } = options;
    if (cursor && start && start > 0) {
      cursor = await cursor.advance(start);
    }

    let { count } = options;
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
          const store = database.createObjectStore(storeName, {
            keyPath: '_index',
            autoIncrement: true,
          });

          store.createIndex('id', 'id', { unique: true });
          return store;
        };

        const schemas = register('schemas');
        schemas.createIndex('createdAt', 'metadata.createdAt', {
          unique: false,
        });

        const works = register('works');
        works.createIndex('createdAt', 'createdAt', { unique: false });
        works.createIndex('lastActivity', 'lastActivity', { unique: false });
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
