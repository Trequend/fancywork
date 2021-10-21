import { useQuery } from './useQuery';

export function useQueryParam(paramName: string) {
  const query = useQuery();
  const param = query.get(paramName);
  if (param === null) {
    throw new Error(`No param "${paramName}"`);
  }

  return param;
}
