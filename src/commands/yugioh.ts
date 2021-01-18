import { Message, MessageEmbed } from 'discord.js';
import { search } from '../api/ygo-pro-deck/ygo-pro-deck.handler';
import {
  MonsterCard,
  SpellCard,
  TrapCard,
} from '../api/ygo-pro-deck/ygo-pro-deck.response';
import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import { logger } from '../utilities/logger';
import { reactor } from '../utilities/reactor';
import { Command } from './command';

export class YugiohCommand implements Command {
  readonly commandNames = ['ygo', 'yugioh'];

  readonly description = 'Perform a Yu-Gi-Oh! card search';

  private readonly reactionEmojis = [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
  ];

  selectorData: Map<number, any> | null;

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}ygo <card_name> to get detailed card info.`;
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const query = parsedUserCommand.args.join(' ');
    // eslint-disable-next-line camelcase
    const response = await search(query);

    if (response === null || response.data.length === 0) {
      await DataHandler.sendMessageToChannel(
        parsedUserCommand.originalMessage.channel,
        'No Results Found.',
      );
      return Promise.resolve(undefined);
    }

    const topResults =
      response.data.length > 10 ? response.data.slice(0, 10) : response.data;

    const selectorData = topResults.map(
      (value, index) => `${index + 1}. ${value.name} (${value.type})`,
    );

    const sentEmbed = await DataHandler.sendEmbedToChannel(
      parsedUserCommand.originalMessage.channel,
      await this.createSelectorEmbed(selectorData, topResults, query),
    );

    await this.getSelectionFromReaction(sentEmbed, parsedUserCommand);

    return Promise.resolve(undefined);
  }

  private async createSelectorEmbed(
    selectorData: string[],
    topResults: Array<MonsterCard | SpellCard | TrapCard>,
    query: string,
  ): Promise<MessageEmbed> {
    const embed = new MessageEmbed();
    this.selectorData = await this.createPairs(topResults);

    embed.setTitle(`Top Results matching '${query}'\n\u200b`);

    selectorData.forEach((value) => embed.addField(value, '\n\u200b', false));

    return embed;
  }

  private async createPairs(
    results: Array<MonsterCard | SpellCard | TrapCard>,
  ): Promise<Map<number, MonsterCard | SpellCard | TrapCard>> {
    const pairs = new Map<number, MonsterCard | SpellCard | TrapCard>();

    results.forEach((value, index) => pairs.set(index + 1, value));

    return pairs;
  }

  private async getSelectionFromReaction(
    sentEmbed: Message,
    parsedUserCommand: CommandContext,
  ) {
    reactor.selectorData = this.selectorData;
    await reactor.addReactionMenu(sentEmbed, this.reactionEmojis);

    const filter = (
      reaction: { emoji: { name: string } },
      user: { id: any },
    ) => {
      return (
        this.reactionEmojis
          .slice(0, this.selectorData?.size)
          .includes(reaction.emoji.name) &&
        user.id === parsedUserCommand.originalMessage.author.id
      );
    };

    const collector = sentEmbed.createReactionCollector(filter, {
      time: 30000,
    });

    let selection: number;
    let hasChosen = false;

    collector.on('collect', async (reaction, user) => {
      if (hasChosen) return;

      hasChosen = true;
      logger.info(`Collected ${reaction.emoji.name} from ${user.tag}`);
      selection = this.reactionEmojis.indexOf(reaction.emoji.name) + 1;

      if (
        this.selectorData === null ||
        this.selectorData?.get(selection) === undefined
      ) {
        await DataHandler.sendMessageToChannel(
          parsedUserCommand.originalMessage.channel,
          'Invalid Selection.',
        );
      } else {
        await DataHandler.sendEmbedToChannel(
          parsedUserCommand.originalMessage.channel,
          YugiohCommand.createCardDataEmbed(this.selectorData.get(selection)),
        );
        this.selectorData = null;
      }
    });

    collector.on('end', (collected) => {
      if (!hasChosen) {
        DataHandler.sendMessageToChannel(
          parsedUserCommand.originalMessage.channel,
          'Selection timed out. Please re-run the command.',
        );
      }
      logger.info(`Collected ${collected.size} items.`);
    });
  }

  private static createCardDataEmbed(
    cardData: MonsterCard | SpellCard | TrapCard,
  ): MessageEmbed {
    /* eslint-disable camelcase */

    const { id, name, desc, type, card_images, archetype, race } = cardData;

    const embed = new MessageEmbed();

    embed
      .setColor('#2E51A2')
      .setFooter(
        'YGOProDeck',
        'https://i.pinimg.com/originals/47/9d/18/479d1838d36bbd71c165d42a3b816216.png',
      )
      .setTimestamp()
      .setTitle(`${name}\n\u200b`);

    if (type.includes('Monster')) {
      const {
        atk,
        def,
        attribute,
        level,
        linkval,
        linkmarkers,
        scale,
      } = cardData as MonsterCard;

      embed.addField('Card Type', `${type}\n\u200b`, true);
      embed.addField('Attribute', `${attribute}\n\u200b`, true);
      embed.addField('\u200b', `\u200b`, true);

      if (level !== undefined) {
        embed.addField('Level/Rank', `${level}\n\u200b`, true);
      } else {
        embed.addField('\u200b', `\u200b`, true);
      }

      embed.addField('Monster Type', `${race}\n\u200b`, true);
      embed.addField('\u200b', `\u200b`, true);

      if (type.includes('Link')) {
        embed.addField('Link Value', `${linkval}\n\u200b`, true);
        embed.addField(
          'Link Markers',
          `${linkmarkers?.join(', ')}\n\u200b`,
          true,
        );
        embed.addField('\u200b', `\u200b`, true);
      }
      if (type.includes('Pendulum')) {
        embed.addField('Scale', `${scale}\n\u200b`, false);
      }
      embed.addField('Attack', `${atk}\n\u200b`, true);
      if (def !== undefined) {
        embed.addField('Defense', `${def}\n\u200b`, true);
      } else {
        embed.addField('\u200b', `\u200b`, true);
      }
      embed.addField('\u200b', `\u200b`, true);
    } else if (type === 'Spell Card') {
      embed.addField(
        'Card Type',
        `${race} ${type.split(' ')[0]}\n\u200b`,
        false,
      );
    } else if (type === 'Trap Card') {
      embed.addField(
        'Card Type',
        `${race} ${type.split(' ')[0]}\n\u200b`,
        false,
      );
    }

    if (archetype !== undefined) {
      embed.addField('Archetype', `${archetype}\n\u200b`, false);
    }
    embed.addField('Description', `${desc}\n\u200b`, false);
    embed.setThumbnail(
      `https://storage.googleapis.com/ygoprodeck.com/pics/${card_images[0].id}.jpg`,
    );

    return embed;
  }
}
