export type Vector2Like = { x: number; y: number } | Vector2;

export class Vector2 {
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  public copy(other: Vector2Like) {
    this.x = other.x;
    this.y = other.y;
  }

  public toArray() {
    return [this.x, this.y];
  }
}
