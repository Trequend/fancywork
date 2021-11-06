import { AppPage } from '../types';
import { CreateSchemePage } from './create-schema-page';
import { Error404Page } from './error-404-page';
import { HomePage } from './home-page';
import { SchemaPage } from './schema-page';
import { SchemasPage } from './schemas-page';
import { WorkPage } from './work-page';
import { WorksPage } from './works-page';

export const pages: Array<AppPage> = [
  CreateSchemePage,
  HomePage,
  SchemaPage,
  SchemasPage,
  WorkPage,
  WorksPage,
  Error404Page,
];
