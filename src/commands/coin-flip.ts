import { CommandContext } from '../models/command-context';
import * as Helpers from '../utilities/helpers';
import { Command } from './command';

export class CoinFlip implements Command {
  readonly commandNames = ['coinflip'];

  private coin = ['heads', 'tails'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}coinflip to flip a coin.`;
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  run(parsedUserCommand: CommandContext): Promise<void> {
    parsedUserCommand.originalMessage.reply(
      `You got ${Helpers.shuffle(this.coin)[0]}!`,
    );
    return Promise.resolve(undefined);
  }
}
