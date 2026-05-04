import { EventEmitter } from "node:events";
import { logger } from "@/server/logger";

// In-process event bus. Swap for a queue (BullMQ/SQS) without changing callers
// when we extract notifications/payments to their own services.

type Handler<T> = (payload: T) => Promise<void> | void;

class EventBus {
  private emitter = new EventEmitter();

  on<T>(event: string, handler: Handler<T>) {
    this.emitter.on(event, async (payload: T) => {
      try {
        await handler(payload);
      } catch (err) {
        logger.error({ err, event }, "event handler failed");
      }
    });
  }

  async emit<T>(event: string, payload: T) {
    logger.debug({ event, payload }, "event emitted");
    this.emitter.emit(event, payload);
  }
}

export const eventBus = new EventBus();
