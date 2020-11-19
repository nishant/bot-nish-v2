import { Message } from 'discord.js';

/** A user-given command extracted from a message. */
export class CommandContext {
  /** Command name in all lowercase. */
  public readonly parsedCommandName: string;

  /** Arguments (split by space). */
  public readonly args: string[];

  /** Original Message the command was extracted from. */
  public readonly originalMessage: Message;

  public readonly commandPrefix: string;

  constructor(message: Message, prefix: string) {
    this.commandPrefix = prefix;
    const splitMessage = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    this.parsedCommandName = splitMessage.shift()!.toLowerCase();
    this.args = splitMessage;
    this.originalMessage = message;
  }
}
