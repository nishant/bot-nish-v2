import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import { Command } from './command';

export class PasswordCommand implements Command {
  commandNames = ['password', 'pass'];

  readonly description = 'PMs you a password of a length 16';

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}password to <ADD STUFF HERE>.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    await DataHandler.fetchData();
    await DataHandler.sendMessageToUser(
      parsedUserCommand.originalMessage.member?.id!,
      this.createPassword(),
    );
    await parsedUserCommand.originalMessage.reply(
      'Check your PMs for a new password.',
    );
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  private createPassword() {
    let password = '';
    let validChars = '';

    /* populates validChars with all printable chars (ascii 33-126) */
    [...Array(94).keys()]
      .map((asciiVal) => asciiVal + 33)
      .forEach((value) => {
        validChars += String.fromCharCode(value);
      });

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 16; i++) {
      password += validChars.charAt(
        Math.floor(Math.random() * validChars.length),
      );
    }

    return password;
  }
}
