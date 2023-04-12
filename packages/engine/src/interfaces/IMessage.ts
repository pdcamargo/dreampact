export enum MessagePriority {
  Critical = 0,
  High = 1,
  Normal = 10,
}

/**
 * A message is a simple object that can be sent through the engine to avoid direct dependencies.
 *
 * A message have a type and a payload, and can also have a sender.
 *
 * A message also can have a priority, which is used to determine the order in which the messages are processed.
 */
export interface IMessage<P, S> {
  /**
   * The type of the message.
   */
  type: string;
  /**
   * The payload of the message.
   */
  payload?: P;
  /**
   * The sender of the message.
   */
  sender?: S;
  /**
   * The priority of the message.
   *
   * @default MessagePriority.Normal
   */
  priority?: MessagePriority;
}
