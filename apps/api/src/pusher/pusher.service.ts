import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;
  private readonly logger = new Logger(PusherService.name);

  constructor(private config: ConfigService) {
    this.pusher = new Pusher({
      appId: this.config.get<string>('PUSHER_APP_ID') ?? (() => { throw new Error('PUSHER_APP_ID is not defined'); })(),
      key: this.config.get<string>('PUSHER_KEY') ?? (() => { throw new Error('PUSHER_KEY is not defined'); })(),
      secret: this.config.get<string>('PUSHER_SECRET') ?? (() => { throw new Error('PUSHER_SECRET is not defined'); })(),
      cluster: this.config.get<string>('PUSHER_CLUSTER') ?? (() => { throw new Error('PUSHER_CLUSTER is not defined'); })(),
      useTLS: this.config.get<string>('PUSHER_USE_TLS') === 'true',
    });
  }

  async trigger(channel: string, event: string, payload: any) {
  console.log("Triggering Pusher:", { channel, event, payload }); // <-- log
  try {
    await this.pusher.trigger(channel, event, payload);
  } catch (err) {
    this.logger.error('Pusher trigger failed', err);
  }
}

}
