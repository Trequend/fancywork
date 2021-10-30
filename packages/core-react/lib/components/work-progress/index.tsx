import { Progress, ProgressProps } from 'antd';
import { WorkMetadata } from '@fancywork/core';
import { FC } from 'react';

export type WorkProgressProps = {
  metadata: WorkMetadata;
} & ProgressProps;

export const WorkProgress: FC<WorkProgressProps> = ({ metadata, ...props }) => {
  const percent = Math.floor(
    (metadata.stitchEmbroideredCount / metadata.schemaMetadata.stitchCount) *
      100
  );
  return <Progress percent={percent} {...props} />;
};
