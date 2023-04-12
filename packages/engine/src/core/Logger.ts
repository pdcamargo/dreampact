import { ILogger } from '../interfaces/ILogger';
import { MessagePriority } from '../interfaces/IMessage';
import { MessageManager } from '../managers/MessageManager';

export class Logger implements ILogger {
  private static _instance: Logger;

  constructor() {
    MessageManager.on('console.log', (data) => {
      console.log(data.payload.message, ...data.payload.optionalParams);
    });
    MessageManager.on('console.warn', (data) => {
      console.warn(data.payload.message, ...data.payload.optionalParams);
    });
    MessageManager.on('console.error', (data) => {
      console.error(data.payload.message, ...data.payload.optionalParams);
    });
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Logger();
    }

    return this._instance;
  }

  public static log(message: string, ...optionalParams: any[]): void {
    this.instance.log(message, ...optionalParams);
  }

  public static warn(message: string, ...optionalParams: any[]): void {
    this.instance.warn(message, ...optionalParams);
  }

  public static error(message: string, ...optionalParams: any[]): void {
    this.instance.error(message, ...optionalParams);
  }

  log(message: string, ...optionalParams: any[]): void {
    MessageManager.post({
      type: 'console.log',
      payload: {
        message,
        optionalParams,
      },
      priority: MessagePriority.Normal,
      sender: this,
    });
  }

  warn(message: string, ...optionalParams: any[]): void {
    MessageManager.post({
      type: 'console.warn',
      payload: {
        message,
        optionalParams,
      },
      priority: MessagePriority.High,
      sender: this,
    });
  }

  error(message: string, ...optionalParams: any[]): void {
    MessageManager.post({
      type: 'console.error',
      payload: {
        message,
        optionalParams,
      },
      priority: MessagePriority.Critical,
      sender: this,
    });
  }
}
