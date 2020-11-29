import { Message } from 'discord.js';
import { CoinFlip } from '../commands/coin-flip';
import { Command } from '../commands/command';
import { DiceRoll } from '../commands/dice-roll';
import { GreetCommand } from '../commands/greet';
import { HelpCommand } from '../commands/help';
import { PasswordCommand } from '../commands/password';
import { PlayCommand } from '../commands/play';
import { QueueCommand } from '../commands/queue';
import { RngCommand } from '../commands/rng';
import { SecretSanta } from '../commands/secret-santa';
import { CommandContext } from '../models/command-context';
import { logger } from './logger';
import { reactor } from './reactor';

/** Handler for bot commands issued by users. */
export class CommandHandler {
  private readonly commands: Command[];

  private readonly prefix: string;

  constructor(prefix: string) {
    const commandClasses: Array<any> = [
      // TODO: Add more commands here.
      GreetCommand,
      SecretSanta,
      CoinFlip,
      DiceRoll,
      PlayCommand,
      QueueCommand,
      RngCommand,
      PasswordCommand,
    ];

    this.commands = commandClasses.map((CommandClass) => new CommandClass());
    this.commands.push(new HelpCommand(this.commands));
    this.prefix = prefix;
  }

  /** Executes user commands contained in a message if appropriate. */
  public async handleMessage(message: Message): Promise<void> {
    if (!this.isValidCommand(message)) return;

    const commandContext = new CommandContext(message, this.prefix);

    const allowedCommands = this.commands.filter((command) =>
      command.hasPermissionToRun(commandContext),
    );
    const matchedCommand = this.commands.find((command) =>
      command.commandNames.includes(commandContext.parsedCommandName),
    );

    if (!matchedCommand) {
      await message.reply("I don't recognize that command. Try !help.");
      await reactor.failure(message);
      // TODO: log here
    } else if (!allowedCommands.includes(matchedCommand)) {
      await message.reply("you aren't allowed to use that command. Try !help.");
      await reactor.failure(message);
      // TODO: log here
    } else {
      logger.info(
        `command received! \
         [author: ${message.author.tag}] \
         [content: ${message.content}]`,
      );

      await matchedCommand
        .run(commandContext)
        .then(() => {
          reactor.success(message);
        })
        .catch((reason: Error) => {
          reactor.failure(message);
          logger.error(reason.message);
        });
    }
  }

  /** Determines whether or not a message is a valid user command. */
  private isValidCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix) && !message.author.bot;
  }
}
