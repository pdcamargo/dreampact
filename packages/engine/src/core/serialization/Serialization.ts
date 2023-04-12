import * as YAML from 'yaml';

export type SerializedPropertyType = 'string' | 'number' | 'boolean' | 'object';

export interface SerializedProperty {
  name: string;
  type: SerializedPropertyType;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isDeprecated?: boolean;
  isRequired?: boolean;
  isHidden?: boolean;
  accessibility?: 'public' | 'protected' | 'private';
}

export class Serialization<T extends Record<string, any>> {
  data: T;
  expectedFormat: Record<string, SerializedProperty>;

  constructor(
    data: T,
    expectedFormat: Record<string, SerializedProperty> = {}
  ) {
    this.data = data;
    this.expectedFormat = expectedFormat;
  }

  public validate() {
    const errors: string[] = [];

    // if data doesn't contain all the expected properties, add key with null value
    for (const key in this.expectedFormat) {
      if (!this.data.hasOwnProperty(key)) {
        (this.data as any)[key] = null;
      }
    }

    // check if data contains any unexpected properties
    for (const key in this.data) {
      if (!this.expectedFormat.hasOwnProperty(key)) {
        errors.push('Unexpected property: ' + key);

        // remove unexpected property
        delete this.data[key];
      }
    }

    // warn errors
    if (errors.length > 0) {
      return errors;
    }

    return null;
  }
}
