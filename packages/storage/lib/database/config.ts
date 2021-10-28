import Dexie from 'dexie';
import {
  SchemaImageIndex,
  SchemaIndex,
  SchemaMetadataIndex,
  SCHEMAS_TABLE,
  SCHEMA_IMAGES_TABLE,
  SCHEMA_METADATA_TABLE,
} from 'lib/storage/schema-storage';
import {
  WorkImageIndex,
  WorkIndex,
  WorkMetadataIndex,
  WORKS_TABLE,
  WORK_IMAGES_TABLE,
  WORK_METADATA_TABLE,
} from 'lib/storage/work-stroage';

export function config(dexie: Dexie) {
  dexie.version(1).stores({
    [SCHEMAS_TABLE]: `++, &${SchemaIndex.Id}`,
    [SCHEMA_METADATA_TABLE]: `++, &${SchemaMetadataIndex.Id}`,
    [SCHEMA_IMAGES_TABLE]: `++, &${SchemaImageIndex.Id}`,

    [WORKS_TABLE]: `++, &${WorkIndex.Id}, ${WorkIndex.LastActivity}`,
    [WORK_METADATA_TABLE]: `++, &${WorkMetadataIndex.Id}, ${WorkMetadataIndex.LastActivity}`,
    [WORK_IMAGES_TABLE]: `++, &${WorkImageIndex.Id}`,
  });
}
