import { Schema, SchemaMetadata, Work, WorkMetadata } from '@fancywork/core';
import Dexie, { Table } from 'dexie';
import { SchemaImage, WorkImage } from './types';

const DB_NAME = 'fancywork';

const SCHEMAS_TABLE = 'schemas';
const SCHEMA_METADATA_TABLE = 'schema_metadata';
const SCHEMA_IMAGES_TABLE = 'schema_images';

const WORKS_TABLE = 'works';
const WORK_METADATA_TABLE = 'work_metadata';
const WORK_IMAGES_TABLE = 'work_images';

export type TableMap = {
  [SCHEMAS_TABLE]: Schema;
  [SCHEMA_METADATA_TABLE]: SchemaMetadata;
  [SCHEMA_IMAGES_TABLE]: SchemaImage;

  [WORKS_TABLE]: Work;
  [WORK_METADATA_TABLE]: WorkMetadata;
  [WORK_IMAGES_TABLE]: WorkImage;
};

export enum SchemaIndex {
  Id = 'metadata.id',
}

export enum SchemaMetadataIndex {
  Id = 'id',
}

export enum SchemaImageIndex {
  Id = 'id',
}

export enum WorkIndex {
  Id = 'metadata.id',
  LastActivity = 'metadata.lastActivity',
}

export enum WorkMetadataIndex {
  Id = 'id',
  LastActivity = 'lastActivity',
}

export enum WorkImageIndex {
  Id = 'id',
}

export type AppTable = keyof TableMap;

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
      ['schemas', 'schema_metadata', 'schema_images'],
      () => {
        this.table('schemas').add(schema);
        this.table('schema_metadata').add(schema.metadata);
        this.table('schema_images').add({
          id: schema.metadata.id,
          dataURL: schemaImageDataURL,
        });
      }
    );
  }

  public async deleteSchema(id: string) {
    return await this.transaction(
      'rw',
      ['schemas', 'schema_metadata', 'schema_images'],
      () => {
        this.table('schemas')
          .where({ [SchemaIndex.Id]: id })
          .delete();
        this.table('schema_metadata')
          .where({ [SchemaMetadataIndex.Id]: id })
          .delete();
        this.table('schema_images')
          .where({ [SchemaImageIndex.Id]: id })
          .delete();
      }
    );
  }

  public async addWork(work: Work, workImageDataURL: string) {
    return await this.transaction(
      'rw',
      ['works', 'work_metadata', 'work_images'],
      () => {
        this.table('works').add(work);
        this.table('work_metadata').add(work.metadata);
        this.table('work_images').add({
          id: work.metadata.id,
          dataURL: workImageDataURL,
        });
      }
    );
  }

  public async deleteWork(id: string) {
    return await this.transaction(
      'rw',
      ['works', 'work_metadata', 'work_images'],
      () => {
        this.table('works')
          .where({ [WorkIndex.Id]: id })
          .delete();
        this.table('work_metadata')
          .where({ [WorkMetadataIndex.Id]: id })
          .delete();
        this.table('work_images')
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
