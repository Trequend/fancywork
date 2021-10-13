import { FC, useState } from 'react';
import { Input, InputProps } from 'antd';
import styles from './FloatInput.module.scss';

type Props = {
  label: string;
} & InputProps;

export const FloatInput: FC<Props> = ({
  label,
  placeholder,
  required,
  className,
  ...rest
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        {...rest}
        className={styles.input}
        required={required}
        placeholder={focus ? undefined : placeholder ? placeholder : label}
      />
      <label className={styles.label}>
        {label} {required ? <span>*</span> : null}
      </label>
    </div>
  );
};
