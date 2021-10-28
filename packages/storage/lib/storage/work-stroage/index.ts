import { Work, WorkMetadata } from '@fancywork/core';
import Dexie from 'dexie';
import { IterableCollection, WorkImage } from 'lib/types';
import { BaseStorage } from '../base-storage';

export const WORKS_TABLE = 'works';
export const WORK_METADATA_TABLE = 'work_metadata';
export const WORK_IMAGES_TABLE = 'work_images';

type Map = {
  [WORKS_TABLE]: Work;
  [WORK_METADATA_TABLE]: WorkMetadata;
  [WORK_IMAGES_TABLE]: WorkImage;
};

export enum WorkImageIndex {
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

export class WorkStorage extends BaseStorage<Map> {
  public constructor(dexie: Dexie) {
    super(dexie);
  }

  public async add(work: Work, workImageDataURL: string) {
    return await this.dexie.transaction(
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

  public async get(id: string) {
    return await this.table(WORKS_TABLE).get({ [WorkIndex.Id]: id });
  }

  public async getImage(id: string) {
    return await this.table(WORK_IMAGES_TABLE).get({
      [WorkImageIndex.Id]: id,
    });
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
}
