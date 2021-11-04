import { Cell, Work, WorkMetadata } from '@fancywork/core';
import Dexie from 'dexie';
import {
  cellToChunkNumber,
  createChunkMetadata,
  createEmptyWorkGrid,
  extractChunk,
  foreachChunk,
  insertChunk,
} from '../../functions';
import {
  IterableCollection,
  WorkChunk,
  WorkChunkMetadata,
  WorkImage,
} from '../../types';
import { BaseStorage } from '../base-storage';

export const WORKS_TABLE = 'works';
export const WORK_METADATA_TABLE = 'work_metadata';
export const WORK_IMAGES_TABLE = 'work_images';
export const WORK_CHUNKS_TABLE = 'work_chunks';
export const WORK_CHUNKS_METADATA_TABLE = 'work_chunks_metadata';

const CHUNK_WIDTH = 64; // change will only affect new works
const CHUNK_HEIGHT = 64; // change will only affect new works

type WorkModel = { id: string } & Omit<Work, 'embroidered' | 'metadata'>;

type Map = {
  [WORKS_TABLE]: WorkModel;
  [WORK_METADATA_TABLE]: WorkMetadata;
  [WORK_IMAGES_TABLE]: WorkImage;
  [WORK_CHUNKS_TABLE]: WorkChunk;
  [WORK_CHUNKS_METADATA_TABLE]: WorkChunkMetadata;
};

export enum WorkIndex {
  Id = 'id',
}

export enum WorkMetadataIndex {
  Id = 'id',
  LastActivity = 'lastActivity',
}

export enum WorkImageIndex {
  WorkId = 'workId',
}

export enum WorkChunkIndex {
  WorkId = 'workId',
  Number = 'number',
}

export enum WorkChunkMetadataIndex {
  WorkId = 'workId',
}

function filterWork(work: Work): Omit<WorkModel, 'id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { embroidered, metadata, ...rest } = work;
  return rest;
}

function removeModelId(workModel: WorkModel): Omit<WorkModel, 'id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = workModel;
  return rest;
}

export class WorkStorage extends BaseStorage<Map> {
  public constructor(dexie: Dexie) {
    super(dexie);
  }

  public async add(work: Work, workImageDataURL: string) {
    return await this.transaction(
      'rw',
      [
        WORKS_TABLE,
        WORK_METADATA_TABLE,
        WORK_IMAGES_TABLE,
        WORK_CHUNKS_TABLE,
        WORK_CHUNKS_METADATA_TABLE,
      ],
      () => {
        const { metadata } = work;
        const chunkMetadata = createChunkMetadata(
          CHUNK_WIDTH,
          CHUNK_HEIGHT,
          metadata
        );

        this.table(WORKS_TABLE).add({
          id: metadata.id,
          ...filterWork(work),
        });
        this.table(WORK_METADATA_TABLE).add(metadata);
        this.table(WORK_IMAGES_TABLE).add({
          workId: metadata.id,
          dataURL: workImageDataURL,
        });
        this.table(WORK_CHUNKS_METADATA_TABLE).add(chunkMetadata);
        foreachChunk(work, chunkMetadata, (chunk) => {
          this.table(WORK_CHUNKS_TABLE).add(chunk);
        });
      }
    );
  }

  public async changeName(id: string, name: string) {
    await this.table(WORK_METADATA_TABLE)
      .where({ [WorkMetadataIndex.Id]: id })
      .modify((metadata) => {
        metadata.name = name;
      });
  }

  public async saveChanges(work: Work, changedCells: Set<Cell>) {
    await this.transaction(
      'rw',
      [
        WORKS_TABLE,
        WORK_METADATA_TABLE,
        WORK_CHUNKS_TABLE,
        WORK_CHUNKS_METADATA_TABLE,
      ],
      async () => {
        const { metadata } = work;
        const { id } = metadata;

        metadata.lastActivity = new Date();
        await this.table(WORK_METADATA_TABLE)
          .where({ [WorkMetadataIndex.Id]: id })
          .modify(metadata);

        const chunkMetadata = await this.table(WORK_CHUNKS_METADATA_TABLE).get(
          id
        );

        if (!chunkMetadata) {
          throw new Error('No chunk metadata');
        }

        const chunkNumbers = new Set<number>();
        changedCells.forEach((cell) => {
          chunkNumbers.add(cellToChunkNumber(cell, chunkMetadata));
        });

        chunkNumbers.forEach((chunkNumber) => {
          const chunk = extractChunk(work, chunkMetadata, chunkNumber);
          this.table(WORK_CHUNKS_TABLE)
            .where({
              [WorkChunkIndex.WorkId]: id,
              [WorkChunkIndex.Number]: chunkNumber,
            })
            .modify(chunk);
        });
      }
    );
  }

  public async get(id: string): Promise<Work> {
    return await this.transaction(
      'r',
      [
        WORKS_TABLE,
        WORK_METADATA_TABLE,
        WORK_CHUNKS_TABLE,
        WORK_CHUNKS_METADATA_TABLE,
      ],
      async () => {
        const work = await this.table(WORKS_TABLE).get(id);
        if (!work) {
          throw new Error('No work');
        }

        const metadata = await this.table(WORK_METADATA_TABLE).get({
          [WorkMetadataIndex.Id]: id,
        });
        if (!metadata) {
          throw new Error('No metadata');
        }

        const chunkMetadata = await this.table(WORK_CHUNKS_METADATA_TABLE).get(
          id
        );
        if (!chunkMetadata) {
          throw new Error('No chunk metadata');
        }

        const { width, height } = metadata.schemaMetadata.canvasMetadata;
        const embroidered = createEmptyWorkGrid(width, height);
        await this.table(WORK_CHUNKS_TABLE)
          .where(`[${WorkChunkIndex.WorkId}+${WorkChunkIndex.Number}]`)
          .between([id, Dexie.minKey], [id, Dexie.maxKey])
          .each((chunk) => {
            insertChunk(metadata, embroidered, chunkMetadata, chunk);
          });

        return {
          ...removeModelId(work),
          metadata,
          embroidered,
        };
      }
    );
  }

  public async getImage(id: string) {
    return await this.table(WORK_IMAGES_TABLE).get(id);
  }

  public async getLastWorkMetadata(): Promise<WorkMetadata | undefined> {
    return await this.table(WORK_METADATA_TABLE)
      .orderBy(WorkMetadataIndex.LastActivity)
      .reverse()
      .first();
  }

  public collection(searchName?: string | null): IterableCollection<{
    metadata: WorkMetadata;
    image: WorkImage;
  }> {
    const searchNameLower = searchName?.toLowerCase();
    const collection = searchName
      ? this.table(WORK_METADATA_TABLE)
          .filter(
            ({ name }) => name.toLowerCase().indexOf(searchNameLower!) !== -1
          )
          .reverse()
      : this.table(WORK_METADATA_TABLE)
          .orderBy(WorkMetadataIndex.LastActivity)
          .reverse();

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
      [
        WORKS_TABLE,
        WORK_METADATA_TABLE,
        WORK_IMAGES_TABLE,
        WORK_CHUNKS_TABLE,
        WORK_CHUNKS_METADATA_TABLE,
      ],
      () => {
        this.table(WORKS_TABLE).delete(id);
        this.table(WORK_METADATA_TABLE)
          .where({ [WorkMetadataIndex.Id]: id })
          .delete();
        this.table(WORK_IMAGES_TABLE).delete(id);
        this.table(WORK_CHUNKS_TABLE)
          .where(`[${WorkChunkIndex.WorkId}+${WorkChunkIndex.Number}]`)
          .between([id, Dexie.minKey], [id, Dexie.maxKey])
          .delete();
        this.table(WORK_CHUNKS_METADATA_TABLE).delete(id);
      }
    );
  }
}
