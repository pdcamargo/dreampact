export interface ClassConstructor<T, A = any> {
  new (args?: A): T;
}
