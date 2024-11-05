export class Color {
  constructor(
    public r = 0,
    public g = 0,
    public b = 0,
    public a = 1,
  ) {}

  public copy(other: Color) {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;
  }

  public toArray() {
    return [this.r, this.g, this.b, this.a];
  }
}
