import { Message, MessageEmbed } from 'discord.js';
import { animeSearch, userSearch } from '../api/jikan/jikan.handler';
import {
  JikanAnimeSearchResult,
  JikanUserSearchResponse,
} from '../api/jikan/jikan.response';
import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import {
  allReactionEmojis,
  dateFormatToReadable,
  fisrtNChars,
  formatNumberStringWithCommas,
} from '../utilities/helpers';
import { logger } from '../utilities/logger';
import { reactor } from '../utilities/reactor';
import { Command } from './command';

export class AnimeCommand implements Command {
  readonly commandNames = ['anime', 'mal', 'ani'];

  readonly description = 'Gets anime information from MyAnimeList';

  selectorData: Map<number, any> | null;

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}anime <name> to get anime info.`;
  }

  // eslint-disable-next-line no-unused-vars
  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    if (
      parsedUserCommand.args[0] === 'stats' &&
      parsedUserCommand.args.length === 2
    ) {
      return AnimeCommand.getMALStats(parsedUserCommand);
    }

    const animeName = parsedUserCommand.args.join(' ');
    // eslint-disable-next-line camelcase,no-unused-vars
    const { results, last_page } = await animeSearch(animeName);

    if (results === null || results.length === 0) {
      await DataHandler.sendMessageToChannel(
        parsedUserCommand.originalMessage.channel,
        'No Results Found.',
      );
      return Promise.resolve(undefined);
    }

    // sort results
    // const sorted = results.sort((a, b) => (a.members <= b.members ? 1 : -1));

    const topResult = results[0];

    if (topResult === null) {
      await parsedUserCommand.originalMessage.channel.send(
        `No anime found matching '${animeName}.`,
      );
      return Promise.resolve(undefined);
    }

    const topResults = results.slice(0, Math.min(5, results.length));

    const selectorData = topResults.map(
      (value, index) =>
        `${index + 1}. ${value.title} (${value.type}, ${fisrtNChars(
          value.start_date,
          10,
        ).substring(0, 4)})`,
    );

    const sentEmbed = await DataHandler.sendEmbedToChannel(
      parsedUserCommand.originalMessage.channel,
      await this.createSelectorEmbed(selectorData, topResults, animeName),
    );

    await this.getSelectionFromReaction(sentEmbed, parsedUserCommand);

    return Promise.resolve(undefined);
  }

  private async getSelectionFromReaction(
    sentEmbed: Message,
    parsedUserCommand: CommandContext,
  ) {
    reactor.selectorData = this.selectorData;
    await reactor.addReactionMenu(sentEmbed);

    const filter = (
      reaction: { emoji: { name: string } },
      user: { id: any },
    ) => {
      return (
        allReactionEmojis.includes(reaction.emoji.name) &&
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
      selection = allReactionEmojis.indexOf(reaction.emoji.name) + 1;

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
          AnimeCommand.createAnimeEmbed(this.selectorData.get(selection)),
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

  private static async getMALStats(
    parsedUserCommand: CommandContext,
  ): Promise<void> {
    const username = parsedUserCommand.args[1];
    const userData = await userSearch(username);

    await DataHandler.sendEmbedToChannel(
      parsedUserCommand.originalMessage.channel,
      AnimeCommand.createAnimeStatsEmbed(userData),
    );
    return Promise.resolve(undefined);
  }

  private async createPairs(
    results: JikanAnimeSearchResult[],
  ): Promise<Map<number, JikanAnimeSearchResult>> {
    const pairs = new Map<number, JikanAnimeSearchResult>();

    results.forEach((value, index) => pairs.set(index + 1, value));

    return pairs;
  }

  private async createSelectorEmbed(
    selectorData: string[],
    topResults: JikanAnimeSearchResult[],
    animeName: string,
  ): Promise<MessageEmbed> {
    const embed = new MessageEmbed();
    this.selectorData = await this.createPairs(topResults);

    embed.setTitle('Top Results\n\u200b');
    embed.setURL(
      encodeURI(`https://myanimelist.net/anime.php?q=${animeName}&cat=anime`),
    );

    selectorData.forEach((value) => embed.addField(value, '\n\u200b', false));

    return embed;
  }

  private static createAnimeStatsEmbed(
    animeStats: JikanUserSearchResponse,
  ): MessageEmbed {
    // eslint-disable-next-line camelcase
    const stats = animeStats.anime_stats;

    return (
      new MessageEmbed()
        .setColor('#2E51A2')
        .setFooter(
          'MyAnimeList',
          'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png',
        )
        .setTimestamp()
        .setURL(animeStats.url)
        // .setThumbnail(animeStats.image_url)
        .setTitle(`Anime Stats for ${animeStats.username}\n\u200b`)
        .addField(
          'Time Watched\u2800\u2800\u2800\u2800\u2800\u2800\u2800',
          `${formatNumberStringWithCommas(stats.days_watched)} days`,
          true,
        )
        .addField(
          'Avg Score',
          stats.mean_score === 0 ? 'N/A ' : `${stats.mean_score}/10`,
          true,
        )
        .addField('\u200b', '\u200b', true)
        .addField(
          'Total Entries',
          `${formatNumberStringWithCommas(stats.total_entries)}`,
          true,
        )
        .addField(
          'Episodes',
          `${formatNumberStringWithCommas(stats.episodes_watched)}`,
          true,
        )
        .addField('\u200b', '\u200b', true)
        .addField('\u200b', '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯', false) // \u23af
        .addField(
          '\u200b\nCompleted',
          `${formatNumberStringWithCommas(stats.completed)}`,
          true,
        )
        .addField(
          '\u200b\nRewatched',
          `${formatNumberStringWithCommas(stats.rewatched)}`,
          true,
        )
        .addField('\u200b', '\u200b', true)
        .addField(
          'On-Hold',
          `${formatNumberStringWithCommas(stats.on_hold)}`,
          true,
        )
        .addField(
          'Dropped',
          `${formatNumberStringWithCommas(stats.dropped)}`,
          true,
        )
        .addField('\u200b', '\u200b', true)
        .addField(
          'Watching',
          `${formatNumberStringWithCommas(stats.watching)}`,
          true,
        )
        .addField(
          'Plan to Watch',
          `${formatNumberStringWithCommas(stats.plan_to_watch)}\n\u200b`,
          true,
        )
        .addField('\n\n\u200b', '\n\n\u200b', true)
    );
  }

  private static createAnimeEmbed(
    animeData: JikanAnimeSearchResult,
  ): MessageEmbed {
    /* eslint-disable camelcase */
    const {
      url,
      // eslint-disable-next-line no-unused-vars
      mal_id,
      airing,
      end_date,
      episodes,
      image_url,
      members,
      rated,
      score,
      start_date,
      synopsis,
      title,
      type,
    } = animeData;

    return new MessageEmbed()
      .setColor('#2E51A2')
      .setFooter(
        'MyAnimeList',
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png',
      )
      .setTimestamp()
      .setURL(url)
      .setTitle(title)
      .setThumbnail(image_url)
      .addField('Synopsis', `${synopsis}\n\u200b`, false)
      .addField('Episodes', episodes === 0 ? 'N/A ' : `${episodes}`, true)
      .addField('Score', score === 0 ? 'N/A ' : `${score}/10`, true)
      .addField(
        'Members',
        `${formatNumberStringWithCommas(members)}\n\u200b`,
        true,
      )
      .addField('Type', `${type}`, true)
      .addField('Rating', `${rated}`, true)
      .addField('Airing', airing ? 'Yes\n\u200b' : 'No\n\u200b', true)
      .addField(
        'Started',
        `${dateFormatToReadable(fisrtNChars(start_date, 10))}`,
        true,
      )
      .addField(
        'Finished',
        `${dateFormatToReadable(fisrtNChars(end_date, 10))}`,
        true,
      )
      .addField('\u200b', '\u200b\n\u200b', true);
  }
}
