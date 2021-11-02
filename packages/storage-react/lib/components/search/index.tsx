import { Input } from 'antd';
import { SearchProps as AntdSearchProps } from 'antd/lib/input';
import { FC } from 'react';
import { useSearchParam } from '../../hooks';
import styles from './index.module.scss';

export type SearchProps = {
  paramName: string;
} & Omit<AntdSearchProps, 'defaultValue'>;

export const Search: FC<SearchProps> = ({
  paramName,
  onSearch,
  className,
  style,
  ...props
}) => {
  const [paramValue, setParamValue] = useSearchParam(paramName);

  return (
    <div className={className} style={style}>
      <Input.Search
        allowClear
        enterButton="Search"
        {...props}
        defaultValue={paramValue ?? ''}
        onSearch={(value, event) => {
          setParamValue(value);
          onSearch && onSearch(value, event);
        }}
      />
      {paramValue ? <p className={styles.text}>Search: {paramValue}</p> : null}
    </div>
  );
};
