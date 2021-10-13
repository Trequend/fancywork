import { FC } from 'react';
import { Select, SelectProps } from 'antd';
import styles from './LabeledSelect.module.scss';

type Props = {
  label: string;
} & Omit<SelectProps<string>, 'placeholder'>;

export const LabeledSelect: FC<Props> = ({
  children,
  label,
  className,
  ...rest
}) => {
  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      <Select {...rest} placeholder="Select">
        {children}
      </Select>
      <label className={styles.label}>{label}</label>
    </div>
  );
};
