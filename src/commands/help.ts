import { MessageEmbed } from 'discord.js';
import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import { Command } from './command';

export class HelpCommand implements Command {
  readonly commandNames = ['help', 'hlep'];

  readonly description = 'Displays available commands';

  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  async run(commandContext: CommandContext): Promise<void> {
    const allowedCommands = this.commands.filter((command) =>
      command.hasPermissionToRun(commandContext),
    );

    if (commandContext.args.length === 0) {
      const embed = HelpCommand.createEmbed(allowedCommands);

      await DataHandler.sendEmbedToChannel(
        commandContext.originalMessage.channel,
        embed,
      );

      return;
    }

    const matchedCommand = this.commands.find((command) =>
      command.commandNames.includes(commandContext.args[0]),
    );
    if (!matchedCommand) {
      await commandContext.originalMessage.reply(
        "I don't know about that command 😕 Use %help to see all of the commands you can use.",
      );
      throw Error('Unrecognized command');
    }
    if (allowedCommands.includes(matchedCommand)) {
      await commandContext.originalMessage.reply(
        HelpCommand.buildHelpMessageForCommand(matchedCommand, commandContext),
      );
    }
  }

  hasPermissionToRun(commandContext: CommandContext): boolean {
    return true;
  }

  getHelpMessage(commandPrefix: string) {
    return 'I think you already know how to use this command...';
  }

  private static buildHelpMessageForCommand(
    command: Command,
    context: CommandContext,
  ): string {
    const aliases = command.commandNames.join(', ');

    const aliasText =
      command.commandNames.length > 1 ? `\n(command aliases: ${aliases})` : '';

    return `${command.getHelpMessage(context.commandPrefix)}${aliasText}`;
  }

  private static createEmbed(allowedCommands: Command[]): MessageEmbed {
    const embed = new MessageEmbed()
      .setColor('#0398fc')
      .setFooter(
        'Created by Nishant Arora',
        'https://cdn.discordapp.com/app-icons/774405608858058833/fb04cc9d98bd80d77d6a8791026221c7.png',
      )
      .setTimestamp()
      .setAuthor(
        'Bot Nish Commands',
        'https://www.clker.com/cliparts/5/E/A/F/X/J/blue-info-icon.svg.hi.png',
        'https://github.com/nishant/bot-nish-v2',
      )
      .setDescription(
        'View the list below to see all available commands.\n' +
          'Use %help <command> to learn more about  its usage.\n\u200b',
      );

    allowedCommands.sort((a, b) => {
      return a.commandNames[0].localeCompare(b.commandNames[0]);
    });

    const commandNames = allowedCommands.map(
      (command) => command.commandNames[0],
    );

    allowedCommands.forEach((command, index) => {
      let { description } = command;
      if (index === allowedCommands.length - 1) description += '\n\u200b';

      embed.addField(commandNames[index], description, false);
    });

    return embed;
  }
}
