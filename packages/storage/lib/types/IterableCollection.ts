export type IterableCollection<T> = {
  count(): PromiseLike<number>;
  range(offset: number, limit: number): PromiseLike<Array<T>>;
};
