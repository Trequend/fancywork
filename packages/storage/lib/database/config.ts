import Dexie from 'dexie';
import {
  SchemaImageIndex,
  SchemaIndex,
  SchemaMetadataIndex,
  SCHEMAS_TABLE,
  SCHEMA_IMAGES_TABLE,
  SCHEMA_METADATA_TABLE,
} from '../storage/schema-storage';
import {
  WorkChunkIndex,
  WorkChunkMetadataIndex,
  WorkImageIndex,
  WorkIndex,
  WorkMetadataIndex,
  WORKS_TABLE,
  WORK_CHUNKS_METADATA_TABLE,
  WORK_CHUNKS_TABLE,
  WORK_IMAGES_TABLE,
  WORK_METADATA_TABLE,
} from '../storage/work-storage';

export function config(dexie: Dexie) {
  dexie.version(1).stores({
    [SCHEMAS_TABLE]: SchemaIndex.Id,
    [SCHEMA_METADATA_TABLE]: `++, &${SchemaMetadataIndex.Id}`,
    [SCHEMA_IMAGES_TABLE]: SchemaImageIndex.SchemaId,

    [WORKS_TABLE]: WorkIndex.Id,
    [WORK_METADATA_TABLE]: `++, &${WorkMetadataIndex.Id}, ${WorkMetadataIndex.LastActivity}`,
    [WORK_IMAGES_TABLE]: WorkImageIndex.WorkId,
    [WORK_CHUNKS_TABLE]: `[${WorkChunkIndex.WorkId}+${WorkChunkIndex.Number}]`,
    [WORK_CHUNKS_METADATA_TABLE]: WorkChunkMetadataIndex.WorkId,
  });
}
