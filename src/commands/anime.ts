import { MessageEmbed } from 'discord.js';
import { animeSearch, userSearch } from '../api/jikan/jikan.handler';
import {
  JikanAnimeSearchResult,
  JikanUserSearchResponse,
} from '../api/jikan/jikan.response';
import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import {
  dateFormatToReadable,
  fisrtNChars,
  formatNumberStringWithCommas,
} from '../utilities/helpers';
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
      const username = parsedUserCommand.args[1];
      const userData = await userSearch(username);
      await DataHandler.sendEmbedToChannel(
        parsedUserCommand.originalMessage.channel,
        AnimeCommand.createAnimeStatsEmbed(userData),
      );
      return Promise.resolve(undefined);
    }
    let selection: number;
    if (
      parsedUserCommand.args[0] === '-c' &&
      /^\d$/.test(parsedUserCommand.args[1])
    ) {
      // eslint-disable-next-line radix
      selection = parseInt(parsedUserCommand.args[1]);
      if (this.selectorData?.get(selection) === undefined) {
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
    } else {
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

      // const sorted = results.sort((a, b) => (a.members <= b.members ? 1 : -1));

      const topResult = results[0];

      if (topResult === null) {
        await parsedUserCommand.originalMessage.channel.send(
          `No anime found matching '${animeName}.`,
        );
        return Promise.resolve(undefined);
      }

      const topResults = results.slice(0, Math.min(10, results.length));

      const selectorData = topResults.map(
        (value, index) => `${index + 1}. ${value.title} (${value.type})`,
      );

      await DataHandler.sendEmbedToChannel(
        parsedUserCommand.originalMessage.channel,
        await this.createSelectorEmbed(selectorData, topResults),
      );
    }
    return Promise.resolve(undefined);
  }

  private async createSelectorEmbed(
    selectorData: string[],
    topResults: JikanAnimeSearchResult[],
  ): Promise<MessageEmbed> {
    const embed = new MessageEmbed();
    this.selectorData = await this.createPairs(topResults);
    embed.setTitle('Top Results\n\u200b');
    embed.setAuthor(`Use the -c <num> option to choose a result.\n\u200b`);
    selectorData.forEach((value) => embed.addField(value, '\n\u200b', false));

    return embed;
  }

  private async createPairs(
    results: JikanAnimeSearchResult[],
  ): Promise<Map<number, JikanAnimeSearchResult>> {
    const pairs = new Map<number, JikanAnimeSearchResult>();
    results.forEach((value, index) => pairs.set(index + 1, value));
    return pairs;
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
        .addField(
          'Completed',
          `${formatNumberStringWithCommas(stats.completed)}`,
          true,
        )
        .addField(
          'Rewatched',
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
