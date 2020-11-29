import { CommandContext } from '../models/command-context';
import * as Helpers from '../utilities/helpers';
import { Command } from './command';

export class RngCommand implements Command {
  commandNames = ['rng'];

  readonly description = 'Generates a random number';

  static readonly RNG_SUCCESS_MSG = 'the number is ';

  static readonly NUM_ARGS_ERR_MSG = 'error: invalid number of arguments';

  static readonly ARGS_TYPE_ERR_MSG =
    'error: any arguments must be numeric (integers)';

  static readonly ARGS_RANGE_ERR_MSG = 'error: invalid argument range';

  static readonly SINGLE_ARG_ERR_MSG =
    'error: if using only 1 argument, it must be > 1';

  getHelpMessage(commandPrefix: string): string {
    console.log(`${commandPrefix}\n${commandPrefix}`);
    return `
      Use ${commandPrefix}rng <min> <max> to get random number within a range.
      Use ${commandPrefix}rng <max> to get a random number between 1 and <max>
    `;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    await parsedUserCommand.originalMessage.reply(
      this.generateRandomNumber(parsedUserCommand.args),
    );
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  generateRandomNumber(args: Array<string>): string {
    if (args.length === 0 || args.length > 2) {
      return RngCommand.NUM_ARGS_ERR_MSG;
    }

    const parsedArgs = this.parseArgsAsInts(args);
    if (parsedArgs === undefined) return RngCommand.ARGS_TYPE_ERR_MSG;

    if (parsedArgs.length === 1) {
      const bound = parsedArgs[0];
      if (bound <= 1) return RngCommand.SINGLE_ARG_ERR_MSG;

      return `${RngCommand.RNG_SUCCESS_MSG}${Helpers.rng(1, bound)}`;
    }

    /* guaranteed 2 args provided */
    const [lowerBound, upperBound] = parsedArgs;
    if (lowerBound >= upperBound) return RngCommand.ARGS_RANGE_ERR_MSG;

    return `${RngCommand.RNG_SUCCESS_MSG}${Helpers.rng(
      lowerBound,
      upperBound,
    )}`;
  }

  parseArgsAsInts(args: Array<string>): Array<number> | undefined {
    const regex = /^-?\d+$/;

    const argsAsInts = args.map((value) =>
      value.match(regex) ? parseInt(value, 10) : undefined,
    );

    return argsAsInts.includes(undefined)
      ? undefined
      : (argsAsInts as Array<number>);
  }
}
