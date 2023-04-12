export interface IManager {
  /**
   * This is called when the engine is initialized.
   *
   * Other managers are not guaranteed to be initialized at this point.
   */
  onInit?: () => void;
  /**
   * This is called when the engine is ready, before the first frame.
   *
   * Other managers are guaranteed to be initialized at this point.
   */
  onReady?: () => void;
  /**
   * This is called every frame.
   */
  onUpdate?: (delta: number) => void;
}
