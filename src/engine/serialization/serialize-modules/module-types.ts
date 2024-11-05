export interface SerializationModule<T> {
  typeName: string;
  serialize(data: T): any;
  deserialize(data: any): T;
}
