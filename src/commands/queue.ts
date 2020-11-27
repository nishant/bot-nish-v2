import {
  getPlayableUrl,
  search,
} from '../api/youtube-data-api/youtube-data-api-handler';
import { CommandContext } from '../models/command-context';
import { MusicPlayer } from '../utilities/music-player/music-player';
import { Command } from './command';

export class QueueCommand implements Command {
  commandNames = ['queue', 'qeuue', 'queeu'];

  public getHelpMessage = (commandPrefix: string): string => {
    return `Use ${commandPrefix}queue to queue audio from YouTube.`;
  };

  public run = async (parsedUserCommand: CommandContext): Promise<void> => {
    const searchResult = (await search(parsedUserCommand.args.join(' ')))
      .items[0];

    const youtubeVideoUrl = getPlayableUrl(searchResult.id.videoId);

    MusicPlayer.enqueue({
      videoUrl: youtubeVideoUrl,
      timestamp: new Date(),
      user: parsedUserCommand.originalMessage.author.username,
    });

    await parsedUserCommand.originalMessage.reply(`queued ${youtubeVideoUrl}`);
  };

  public hasPermissionToRun = (parsedUserCommand: CommandContext): boolean => {
    return true;
  };
}
