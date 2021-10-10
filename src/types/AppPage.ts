import { FC } from 'react';

export type AppPage = FC & {
  pathname?: string;
  isExactPathname?: boolean;
};
