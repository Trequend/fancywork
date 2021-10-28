import { Schema, Work } from '@fancywork/core';
import Dexie, { Table } from 'dexie';
import {
  DB_NAME,
  SCHEMAS_TABLE,
  SCHEMA_IMAGES_TABLE,
  SCHEMA_METADATA_TABLE,
  WORKS_TABLE,
  WORK_IMAGES_TABLE,
  WORK_METADATA_TABLE,
} from './constants';
import {
  SchemaImageIndex,
  SchemaIndex,
  SchemaMetadataIndex,
  WorkImageIndex,
  WorkIndex,
  WorkMetadataIndex,
} from './indices';
import { AppTable, TableMap } from './types';

export class AppStorage {
  public static async open() {
    const dexie = new Dexie(DB_NAME, { autoOpen: false });

    dexie.version(1).stores({
      [SCHEMAS_TABLE]: `++, &${SchemaIndex.Id}`,
      [SCHEMA_METADATA_TABLE]: `++, &${SchemaMetadataIndex.Id}`,
      [SCHEMA_IMAGES_TABLE]: `++, &${SchemaImageIndex.Id}`,

      [WORKS_TABLE]: `++, &${WorkIndex.Id}, ${WorkIndex.LastActivity}`,
      [WORK_METADATA_TABLE]: `++, &${WorkMetadataIndex.Id}, ${WorkMetadataIndex.LastActivity}`,
      [WORK_IMAGES_TABLE]: `++, &${WorkImageIndex.Id}`,
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

  public async addSchema(schema: Schema, schemaImageDataURL: string) {
    return await this.transaction(
      'rw',
      [SCHEMAS_TABLE, SCHEMA_METADATA_TABLE, SCHEMA_IMAGES_TABLE],
      () => {
        this.table(SCHEMAS_TABLE).add(schema);
        this.table(SCHEMA_METADATA_TABLE).add(schema.metadata);
        this.table(SCHEMA_IMAGES_TABLE).add({
          id: schema.metadata.id,
          dataURL: schemaImageDataURL,
        });
      }
    );
  }

  public async getSchema(id: string) {
    return await this.table(SCHEMAS_TABLE).get({ [SchemaIndex.Id]: id });
  }

  public async deleteSchema(id: string) {
    return await this.transaction(
      'rw',
      [SCHEMAS_TABLE, SCHEMA_METADATA_TABLE, SCHEMA_IMAGES_TABLE],
      () => {
        this.table(SCHEMAS_TABLE)
          .where({ [SchemaIndex.Id]: id })
          .delete();
        this.table(SCHEMA_METADATA_TABLE)
          .where({ [SchemaMetadataIndex.Id]: id })
          .delete();
        this.table(SCHEMA_IMAGES_TABLE)
          .where({ [SchemaImageIndex.Id]: id })
          .delete();
      }
    );
  }

  public async addWork(work: Work, workImageDataURL: string) {
    return await this.transaction(
      'rw',
      [WORKS_TABLE, WORK_METADATA_TABLE, WORK_IMAGES_TABLE],
      () => {
        this.table(WORKS_TABLE).add(work);
        this.table(WORK_METADATA_TABLE).add(work.metadata);
        this.table(WORK_IMAGES_TABLE).add({
          id: work.metadata.id,
          dataURL: workImageDataURL,
        });
      }
    );
  }

  public async getWork(id: string) {
    return await this.table(WORKS_TABLE).get({ [WorkIndex.Id]: id });
  }

  public async deleteWork(id: string) {
    return await this.transaction(
      'rw',
      [WORKS_TABLE, WORK_METADATA_TABLE, WORK_IMAGES_TABLE],
      () => {
        this.table(WORKS_TABLE)
          .where({ [WorkIndex.Id]: id })
          .delete();
        this.table(WORK_METADATA_TABLE)
          .where({ [WorkMetadataIndex.Id]: id })
          .delete();
        this.table(WORK_IMAGES_TABLE)
          .where({ [WorkImageIndex.Id]: id })
          .delete();
      }
    );
  }

  public async transaction<T = void>(
    mode: 'r' | 'rw',
    tables: Array<AppTable>,
    callback: () => PromiseLike<T> | T
  ) {
    return await this.dexie.transaction(mode, tables, callback);
  }
}
