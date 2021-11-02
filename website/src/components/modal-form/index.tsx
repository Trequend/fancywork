import { Form, FormProps, message, Modal } from 'antd';
import { FC, ReactNode, useState } from 'react';

export type ModalFormProps = {
  onCancel?: () => void;
  onFinish?: (values: any) => Promise<void> | void;
  children?: ReactNode | ((loading: boolean) => ReactNode);
} & Omit<FormProps, 'onFinish' | 'children'>;

export const ModalForm: FC<ModalFormProps> = ({
  onCancel,
  onFinish,
  children,
  ...formProps
}) => {
  const [loading, setLoading] = useState(false);

  const onFormFinish = (values: any) => {
    if (!onFinish) {
      return;
    }

    const action = async () => {
      setLoading(true);
      try {
        await onFinish(values);
      } catch (error) {
        setLoading(false);
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          message.error('Unknown error');
        }
      }
    };

    action();
  };

  return (
    <Modal
      title="Change schema name"
      closable
      visible
      onCancel={onCancel}
      width="400px"
      footer={null}
      centered
    >
      <Form onFinish={onFormFinish} {...formProps}>
        {typeof children === 'function' ? children(loading) : children}
      </Form>
    </Modal>
  );
};
