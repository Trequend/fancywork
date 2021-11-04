import { Schema, SchemaMetadata } from '@fancywork/core';
import Dexie from 'dexie';
import { IterableCollection, SchemaImage } from '../../types';
import { BaseStorage } from '../base-storage';

export const SCHEMAS_TABLE = 'schemas';
export const SCHEMA_METADATA_TABLE = 'schema_metadata';
export const SCHEMA_IMAGES_TABLE = 'schema_images';

type SchemaModel = { id: string } & Omit<Schema, 'metadata'>;

type Map = {
  [SCHEMAS_TABLE]: SchemaModel;
  [SCHEMA_METADATA_TABLE]: SchemaMetadata;
  [SCHEMA_IMAGES_TABLE]: SchemaImage;
};

export enum SchemaIndex {
  Id = 'id',
}

export enum SchemaMetadataIndex {
  Id = 'id',
}

export enum SchemaImageIndex {
  SchemaId = 'schemaId',
}

function filterSchema(schema: Schema): Omit<Schema, 'metadata'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { metadata, ...rest } = schema;
  return rest;
}

function removeModelId(schemaModel: SchemaModel): Omit<SchemaModel, 'id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = schemaModel;
  return rest;
}

export class SchemaStorage extends BaseStorage<Map> {
  public constructor(dexie: Dexie) {
    super(dexie);
  }

  public async add(schema: Schema, schemaImageDataURL: string) {
    return await this.transaction(
      'rw',
      [SCHEMAS_TABLE, SCHEMA_METADATA_TABLE, SCHEMA_IMAGES_TABLE],
      () => {
        const { metadata } = schema;
        this.table(SCHEMAS_TABLE).add({
          id: metadata.id,
          ...filterSchema(schema),
        });
        this.table(SCHEMA_METADATA_TABLE).add(metadata);
        this.table(SCHEMA_IMAGES_TABLE).add({
          schemaId: metadata.id,
          dataURL: schemaImageDataURL,
        });
      }
    );
  }

  public async get(id: string): Promise<Schema> {
    return await this.transaction(
      'r',
      [SCHEMAS_TABLE, SCHEMA_METADATA_TABLE],
      async () => {
        const schema = await this.table(SCHEMAS_TABLE).get(id);
        if (!schema) {
          throw new Error('No schema');
        }

        const metadata = await this.table(SCHEMA_METADATA_TABLE).get({
          [SchemaMetadataIndex.Id]: id,
        });
        if (!metadata) {
          throw new Error('No metadata');
        }

        return {
          ...removeModelId(schema),
          metadata,
        };
      }
    );
  }

  public async getImage(id: string) {
    return await this.table(SCHEMA_IMAGES_TABLE).get(id);
  }

  public async changeName(id: string, name: string) {
    await this.table(SCHEMA_METADATA_TABLE)
      .where({ [SchemaMetadataIndex.Id]: id })
      .modify((metadata) => {
        metadata.name = name;
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
        this.table(SCHEMA_IMAGES_TABLE).delete(id);
      }
    );
  }
}
