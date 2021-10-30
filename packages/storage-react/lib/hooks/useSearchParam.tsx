import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function useSearchParam<T>(
  name: string,
  options: {
    parse: (value: string | null) => T;
    isDefaultValue?: (value: T) => boolean;
  }
): [T, (value: T) => void];
export function useSearchParam(
  name: string
): [string | null, (value: string | null) => void];
export function useSearchParam(
  name: string,
  options?: {
    parse: (value: string | null) => any;
    isDefaultValue?: (value: any) => boolean;
  }
): [any, (value: any) => void] {
  const history = useHistory();
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(history.location.search);
    return params.get(name);
  });

  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const setParam = useCallback(
    (value: any) => {
      const params = new URLSearchParams(history.location.search);
      const options = optionsRef.current;
      if (
        !value ||
        (options &&
          options.isDefaultValue &&
          options.isDefaultValue(options.parse(value)))
      ) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      history.replace({ search: params.toString() });
      setValue(value ? value.toString() : null);
    },
    [name, history]
  );

  return [options ? options.parse(value) : value, setParam];
}
