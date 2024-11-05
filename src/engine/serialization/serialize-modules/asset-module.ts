import { Serializer } from "../serializer";
import { SerializationModule } from "./module-types";

// TODO: move to engine
class Asset {
  public readonly uuid: string;
  public readonly type: string;

  constructor(uuid: string, type: string) {
    this.uuid = uuid;
    this.type = type;
  }
}

export const assetModule: SerializationModule<Asset> = {
  typeName: "AssetReference",
  serialize(asset) {
    return {
      uuid: asset.uuid,
      assetType: asset.type,
    };
  },
  deserialize(data: any) {
    return new Asset(data.uuid, data.assetType);
  },
};
