import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import { Helpers } from '../utilities/helpers';
import { Command } from './command';

export class SecretSanta implements Command {
  commandNames = ['santa', 'secretsanta'];

  private static readonly ROLE_ID = '778849334182936596';

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}santa <name1> <name2> ... to create a secret santa group.`;
  }

  public async run(parsedUserCommand: CommandContext): Promise<void> {
    await DataHandler.fetchData();

    const pairs = await this.createPairs();
    const message = `<@&${SecretSanta.ROLE_ID}>, Check your PMs for your secret santa assignment! 🎅`;

    await parsedUserCommand.originalMessage.channel.send(message);

    pairs.forEach(async (value, key) => {
      // logger.info(key, DataHandler.getUsernameById(value));
      // await DataHandler.sendMessageToUser(
      //   key,
      //   await DataHandler.getUsernameById(value),
      // );
      await DataHandler.sendMessageToUser(
        key,
        await DataHandler.getUsernameById(value),
      );
    });
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return parsedUserCommand.originalMessage.author.username === 'nish';
  }

  private async createPairs(): Promise<Map<string, string>> {
    let pairs = new Map<string, string>();
    const members = await DataHandler.getAllUsersByRole(SecretSanta.ROLE_ID);

    members.forEach((member) => pairs.set(member, member));

    const hasSelfPairs = (): boolean => {
      return Array.from(pairs.entries()).some(([x, y]) => x === y);
    };

    while (hasSelfPairs()) {
      const shuffled = Helpers.shuffle(members);
      pairs = new Map<string, string>();
      // eslint-disable-next-line no-loop-func
      members.forEach((member, i: number) => pairs.set(member, shuffled[i]));
    }
    return pairs;
  }

  private static printMap(map: Map<string, string>): string {
    return Array.from(map.entries())
      .map(([key, val]) => `${key} => ${val}`)
      .join('\n');
  }
}
