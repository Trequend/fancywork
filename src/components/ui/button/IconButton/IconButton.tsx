import cn from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import { IconType } from 'react-icons/lib';
import styles from './IconButton.module.scss';

type Props = {
  Icon: IconType;
  variant?: 'primary' | 'secondary';
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const IconButton: FC<Props> = ({
  Icon,
  variant,
  type,
  className,
  ...props
}) => {
  const buttonProps = {
    ...props,
    type,
    className: cn(
      variant === 'primary' ? styles.primary : styles.secondary,
      className
    ),
  };

  return (
    /* eslint-disable-next-line react/button-has-type, react/jsx-props-no-spreading */
    <button {...buttonProps}>
      <Icon />
    </button>
  );
};

IconButton.defaultProps = {
  variant: 'primary',
  type: 'button',
} as Partial<Props>;

export default IconButton;
