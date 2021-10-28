import { Schema, SchemaMetadata } from '@fancywork/core';
import Dexie from 'dexie';
import { IterableCollection, SchemaImage } from 'lib/types';
import { BaseStorage } from '../base-storage';

export const SCHEMAS_TABLE = 'schemas';
export const SCHEMA_METADATA_TABLE = 'schema_metadata';
export const SCHEMA_IMAGES_TABLE = 'schema_images';

type Map = {
  [SCHEMAS_TABLE]: Schema;
  [SCHEMA_METADATA_TABLE]: SchemaMetadata;
  [SCHEMA_IMAGES_TABLE]: SchemaImage;
};

export enum SchemaIndex {
  Id = 'metadata.id',
}

export enum SchemaImageIndex {
  Id = 'id',
}

export enum SchemaMetadataIndex {
  Id = 'id',
}

export class SchemaStorage extends BaseStorage<Map> {
  public constructor(dexie: Dexie) {
    super(dexie);
  }

  public async add(schema: Schema, schemaImageDataURL: string) {
    return await this.dexie.transaction(
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

  public async get(id: string) {
    return await this.table(SCHEMAS_TABLE).get({ [SchemaIndex.Id]: id });
  }

  public async getImage(id: string) {
    return await this.table(SCHEMA_IMAGES_TABLE).get({
      [SchemaImageIndex.Id]: id,
    });
  }

  public collection(searchName?: string | null): IterableCollection<{
    metadata: SchemaMetadata;
    image: SchemaImage;
  }> {
    const searchNameLower = searchName?.toLowerCase();
    const collection = searchName
      ? this.table(SCHEMA_METADATA_TABLE)
          .filter(
            ({ name }) => name.toLowerCase().indexOf(searchNameLower!) !== -1
          )
          .reverse()
      : this.table(SCHEMA_METADATA_TABLE).toCollection().reverse();

    return {
      count: () => collection.count(),
      range: async (offset: number, limit: number) => {
        const data = await collection.offset(offset).limit(limit).toArray();
        return await Promise.all(
          data.map((metadata) => {
            return (async () => {
              const image = await this.getImage(metadata.id);
              if (image) {
                return {
                  metadata,
                  image,
                };
              } else {
                throw new Error(`No image with id ${metadata.id}`);
              }
            })();
          })
        );
      },
    };
  }

  public async delete(id: string) {
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
}
