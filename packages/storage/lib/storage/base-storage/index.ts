import Dexie, { Collection, Table } from 'dexie';
import { IterableCollection } from 'lib/types';

export abstract class BaseStorage<Map> {
  protected constructor(protected readonly dexie: Dexie) {}

  protected table<K extends keyof Map>(tableName: K): Table<Map[K], any> {
    return this.dexie.table(tableName.toString());
  }

  protected async transaction<T = void>(
    mode: 'r' | 'rw',
    tables: Array<keyof Map>,
    callback: () => PromiseLike<T> | T
  ) {
    const names = tables.map((tableName) => tableName.toString());
    return await this.dexie.transaction(mode, names, callback);
  }

  protected createIterableCollection<T>(
    collection: Collection<T, any>
  ): IterableCollection<T> {
    return {
      count: () => collection.count(),
      range: (offset: number, limit: number) =>
        collection.offset(offset).limit(limit).toArray(),
    };
  }
}
