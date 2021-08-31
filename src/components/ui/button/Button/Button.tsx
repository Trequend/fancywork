import { FC, DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './Button.module.scss';

type Props = {
  text: string;
  variant?: 'primary' | 'secondary';
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: FC<Props> = ({ text, variant, type, className, ...props }) => {
  const buttonProps = {
    ...props,
    type,
    className: cn(
      variant === 'primary' ? styles.primary : styles.secondary,
      className
    ),
  };

  /* eslint-disable-next-line react/button-has-type, react/jsx-props-no-spreading */
  return <button {...buttonProps}>{text}</button>;
};

Button.defaultProps = {
  variant: 'primary',
  type: 'button',
} as Partial<Props>;

export default Button;
