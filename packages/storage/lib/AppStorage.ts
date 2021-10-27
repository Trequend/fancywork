import { Schema, Work } from '@fancywork/core';
import Dexie, { Table } from 'dexie';

const DB_NAME = 'fancywork';

const SCHEMAS_TABLE = 'schemas';
const WORKS_TABLE = 'works';

export type TableMap = {
  [SCHEMAS_TABLE]: Schema;
  [WORKS_TABLE]: Work;
};

export enum SchemaIndex {
  Id = 'id',
  Name = 'metadata.name',
  NameWords = 'metadata.nameWords',
  CreatedAt = 'metadata.createdAt',
}

export enum WorkIndex {
  Id = 'id',
  Name = 'name',
  NameWords = 'nameWords',
  CreatedAt = 'createdAt',
  LastActivity = 'lastActivity',
}

export type AppTable = keyof TableMap;

export class AppStorage {
  public static async open() {
    const dexie = new Dexie(DB_NAME, { autoOpen: false });

    dexie.version(1).stores({
      [SCHEMAS_TABLE]: `++, &${SchemaIndex.Id}, ${SchemaIndex.Name}, *${SchemaIndex.NameWords}, ${SchemaIndex.CreatedAt}`,
      [WORKS_TABLE]: `++, &${WorkIndex.Id}, ${WorkIndex.Name}, *${WorkIndex.NameWords}, ${WorkIndex.CreatedAt}, ${WorkIndex.LastActivity}`,
    });

    await dexie.open();

    const appStorage = new AppStorage(dexie);
    return {
      appStorage,
      closeStorage: () => {
        dexie.close();
      },
    };
  }

  private constructor(private readonly dexie: Dexie) {}

  public table<K extends AppTable>(name: K): Table<TableMap[K], number> {
    return this.dexie.table(name);
  }
}
