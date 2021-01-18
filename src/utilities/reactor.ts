import { Message } from 'discord.js';
import { config } from '../config';

const ACK_REACTIONS = ['👍', '💚', '👌', '😃'];
const EXPIRED_REACTIONS = ['⌛', '💤', '😴'];
const FAILURE_REACTIONS = ['⛔', '🚱', '❌'];

/** Gets a random element of an array. */
const getRandom = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)];

export class Reactor {
  enableReactions: boolean;

  selectorData: Map<number, any> | null | undefined;

  constructor(enableReactions: boolean, selectorData: Map<number, any> | null) {
    this.enableReactions = enableReactions;
    this.selectorData = selectorData;
  }

  /** Indicates to the user that the command was executed successfully. */
  public async success(message: Message) {
    await this.addReaction(message, ACK_REACTIONS);
  }

  /** Indicates to the user that the command failed for some reason. */
  public async failure(message: Message) {
    await this.addReaction(message, FAILURE_REACTIONS);
  }

  /** Indicates to the user that the command is no longer active, as intended. */
  public async expired(message: Message) {
    await this.addReaction(message, EXPIRED_REACTIONS);
  }

  public async addReaction(message: Message, reactionType: Array<string>) {
    if (!this.enableReactions) return;
    if (message.reactions.cache.size > 0) await message.reactions.removeAll();

    await message.react(getRandom(reactionType));
  }

  public async addReactionMenu(message: Message, reactionEmojis: string[]) {
    if (
      !this.enableReactions ||
      this.selectorData === null ||
      this.selectorData === undefined ||
      this.selectorData.size === 0 ||
      this.selectorData.size > 10
    )
      return;

    if (message.reactions.cache.size > 0) await message.reactions.removeAll();

    for (let i = 0; i < this.selectorData.size; i++) {
      // eslint-disable-next-line no-await-in-loop
      await message.react(reactionEmojis[i]);
    }
  }
}

export const reactor = new Reactor(config.enableReactions, null);
