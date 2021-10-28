import { Schema, SchemaMetadata, Work, WorkMetadata } from '@fancywork/core';
import { SchemaImage } from './SchemaImage';
import { WorkImage } from './WorkImage';

import {
  SCHEMAS_TABLE,
  SCHEMA_IMAGES_TABLE,
  SCHEMA_METADATA_TABLE,
  WORKS_TABLE,
  WORK_IMAGES_TABLE,
  WORK_METADATA_TABLE,
} from '../constants';

export type TableMap = {
  [SCHEMAS_TABLE]: Schema;
  [SCHEMA_METADATA_TABLE]: SchemaMetadata;
  [SCHEMA_IMAGES_TABLE]: SchemaImage;

  [WORKS_TABLE]: Work;
  [WORK_METADATA_TABLE]: WorkMetadata;
  [WORK_IMAGES_TABLE]: WorkImage;
};
