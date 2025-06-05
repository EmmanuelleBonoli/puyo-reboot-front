export type ResolverResult<T> = {
  values: T;
  errors: Record<string, { type: string; message: string }>;
};
