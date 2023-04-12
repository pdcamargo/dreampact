import { ClassConstructor } from '../../interfaces/ClassConstructor';

export function throwIfMultipleInstance<T>(target: ClassConstructor<T>) {
  // TODO: validate that has single module instance
}
