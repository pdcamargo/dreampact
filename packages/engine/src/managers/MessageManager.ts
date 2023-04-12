import { IManager } from '../interfaces/IManager';
import { IMessage, MessagePriority } from '../interfaces/IMessage';

export class MessageManager implements IManager {
  /**
   * How many messages to process per frame.
   */
  public static messagesPerFrame = 1000;

  private _messages: IMessage<any, any>[] = [];
  private _listeners: Map<string, ((message: IMessage<any, any>) => void)[]> =
    new Map();

  private static _instance: MessageManager;

  public static get instance() {
    if (!this._instance) {
      this._instance = new MessageManager();
    }

    return this._instance;
  }

  public onUpdate() {
    const messages = this._messages;
    const messagesPerFrame = MessageManager.messagesPerFrame;
    let i = 0;
    while (messages.length > 0 && i < messagesPerFrame) {
      const message = messages.shift();
      this.processMessage(message as IMessage<any, any>);
      i++;
    }
  }

  public static post(message: IMessage<any, any>) {
    // If the message is critical, process it immediately.
    if (message.priority === MessagePriority.Critical) {
      this.instance.processMessage(message);

      return;
    }

    // Otherwise, queue it.
    this.instance._messages.push(message);

    // Sort the messages by priority.
    this.instance._messages.sort((a, b) => {
      const aPriority: number = a.priority ?? MessagePriority.Normal;
      const bPriority: number = b.priority ?? MessagePriority.Normal;

      return aPriority - bPriority;
    });
  }

  /**
   * Add a listener for a message type.
   *
   * This returns a function that can be called to remove the listener.
   *
   * @param type what type of message to listen for
   * @param listener the listener to call when a message of the given type is received
   * @returns a function that can be called to remove the listener
   */
  public static on(
    type: string,
    listener: (message: IMessage<any, any>) => void
  ) {
    if (!this.instance._listeners.has(type)) {
      this.instance._listeners.set(type, []);
    }

    const listeners = this.instance._listeners.get(type) ?? [];

    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  /**
   * Remove a listener for a message type.
   *
   * @param type what type of message was listened for
   * @param listener the listener that was called when a message of the given type was received
   */
  public static off(
    type: string,
    listener: (message: IMessage<any, any>) => void
  ) {
    const listeners = this.instance._listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private processMessage(message: IMessage<any, any>) {
    const listeners = this._listeners.get(message.type);
    if (listeners) {
      for (const listener of listeners) {
        listener(message);
      }
    }
  }
}
