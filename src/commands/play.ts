import { CommandContext } from '../models/command-context';
import { MusicPlayer } from '../utilities/music-player/music-player';
import { Command } from './command';

export class PlayCommand implements Command {
  commandNames = ['play', 'paly'];

  public getHelpMessage = (commandPrefix: string): string => {
    return `Use ${commandPrefix}play to stream audio from YouTube.`;
  };

  public run = async (parsedUserCommand: CommandContext): Promise<void> => {
    // const searchResult = (await search(parsedUserCommand.args.join(' ')))
    //   .items[0];
    //
    // const youtubeVideoUrl = getPlayableUrl(searchResult.id.videoId);
    // await parsedUserCommand.originalMessage.reply(
    //   `now playing ${youtubeVideoUrl}`,
    // );
    await parsedUserCommand.originalMessage.reply(
      `${MusicPlayer.printQueue()}`,
    );
  };

  public hasPermissionToRun = (parsedUserCommand: CommandContext): boolean => {
    return true;
  };
}
