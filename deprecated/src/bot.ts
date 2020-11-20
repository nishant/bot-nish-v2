import { Client, Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { MessageResponder } from './services/message-responder';
import exp = require('constants');
import {logger} from "../../src/utilities/logger";

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
    ) {
      this.client = client;
      this.token = token;
    }

    public listen(): Promise<string> {
      this.client.on('message', (message: Message) => {
        logger.info('Message Received.\n\tMessage Content:\n\t\t ', message.content);
      });

      return this.client.login(this.token);
    }
}

export {}
