import { logger } from '../logger';
import { CommandContext } from '../models/command-context';
import { Command } from './command';

export class SecretSanta implements Command {
  commandNames = ['santa', 'secretsanta'];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}santa <name1> <name2> ... to create a secret santa group.`;
  }

  public async run(parsedUserCommand: CommandContext): Promise<void> {
    const pairs = this.createPairs(parsedUserCommand);
    const messageHeader = 'Here are the secret santa assignments! 🎅';

    await parsedUserCommand.originalMessage.reply(`${messageHeader}\n${pairs}`);
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  private createPairs(parsedUserCommand: CommandContext): string {
    let pairs = new Map<string, string>();
    const members = parsedUserCommand.args;

    members.forEach((member) => pairs.set(member, member));

    const hasSelfPairs = (): boolean => {
      return Array.from(pairs.entries()).some(([x, y]) => x === y);
    };

    while (hasSelfPairs()) {
      const shuffled = SecretSanta.shuffle(members);
      pairs = new Map<string, string>();
      // eslint-disable-next-line no-loop-func
      members.forEach((member, i: number) => pairs.set(member, shuffled[i]));
    }

    return SecretSanta.printMap(pairs);
  }

  private static shuffle<T>(array: Array<T>): Array<T> {
    const copy = [...array];
    let currentIndex = copy.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = copy[currentIndex];
      copy[currentIndex] = copy[randomIndex];
      copy[randomIndex] = temporaryValue;
    }

    return copy;
  }

  private static printMap(map: Map<string, string>): string {
    return Array.from(map.entries())
      .map(([key, val]) => `${key} => ${val}`)
      .join('\n');
  }
}
