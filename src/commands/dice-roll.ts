import { CommandContext } from '../models/command-context';
import * as Helpers from '../utilities/helpers';
import { Command } from './command';

export class DiceRoll implements Command {
  readonly commandNames = ['diceroll'];

  readonly description = 'Rolls a die';

  private dice = Array.from({ length: 6 }, (_, i) => i + 1);

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}diceroll to roll a die.`;
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  run(parsedUserCommand: CommandContext): Promise<void> {
    parsedUserCommand.originalMessage.reply(
      `You got ${Helpers.shuffle(this.dice)[0]}!`,
    );
    return Promise.resolve(undefined);
  }
}
