import { SerializationModule } from "./module-types";

export const dateModule: SerializationModule<Date> = {
  typeName: "Date",
  serialize(date: Date) {
    return date.toISOString();
  },
  deserialize(data: any) {
    return new Date(data);
  },
};
