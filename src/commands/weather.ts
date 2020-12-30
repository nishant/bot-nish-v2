import { MessageEmbed } from 'discord.js';
import { reverseZipSearch } from '../api/open-data-soft/open-data-soft.handler';
import { OpenDataSoftReverseZipResponse } from '../api/open-data-soft/open-data-soft.response';
import { search } from '../api/open-weather-map/open-weather-map.handler';
import { OpenWeatherMapResponse } from '../api/open-weather-map/open-weather-map.response';
import { CommandContext } from '../models/command-context';
import { DataHandler } from '../utilities/data-handler';
import { logger } from '../utilities/logger';
import { Command } from './command';

export class WeatherCommand implements Command {
  commandNames = ['weather'];

  readonly description = 'Provides weather information by zip code';

  static readonly NUM_ARGS_ERR_MSG = 'error: invalid number of arguments';

  static readonly ARGS_INVALID_FORMAT_ERR_MSG =
    'error: argument must be a 5-digit zip code';

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}weather <zip> to get current weather data by zip code.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const { args } = parsedUserCommand;

    if (args.length === 0 || args.length > 2) {
      await parsedUserCommand.originalMessage.reply(
        WeatherCommand.NUM_ARGS_ERR_MSG,
      );
      logger.info(WeatherCommand.NUM_ARGS_ERR_MSG);
      return;
    }

    if (!WeatherCommand.isValidZip(args[0])) {
      await parsedUserCommand.originalMessage.reply(
        WeatherCommand.ARGS_INVALID_FORMAT_ERR_MSG,
      );

      logger.info(WeatherCommand.ARGS_INVALID_FORMAT_ERR_MSG);
      return;
    }

    const locationData = await reverseZipSearch(args.join(' '));
    const { latitude, longitude } = locationData.records[0].fields;

    const weatherData = await WeatherCommand.getWeatherData(
      latitude,
      longitude,
    );

    await DataHandler.sendEmbedToChannel(
      parsedUserCommand.originalMessage.channel,
      WeatherCommand.createEmbed(locationData, weatherData),
    );
  }

  private static isValidZip(zip: string): boolean {
    const regex = /^\d{5}$/;

    return !!zip.match(regex);
  }

  private static createEmbed(
    locationData: OpenDataSoftReverseZipResponse,
    weatherData: OpenWeatherMapResponse,
  ): MessageEmbed {
    const { city, state, zip } = locationData.records[0].fields;
    const { current } = weatherData;

    return new MessageEmbed()
      .setColor('#FCD303')
      .setFooter(
        'OpenWeatherMap',
        'https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg',
      )
      .setTimestamp()
      .setAuthor(
        `Current Weather in ${city}, ${state}`,
        'https://icons-for-free.com/iconfiles/png/512/fog+foggy+weather+icon-1320196634851598977.png',
        `https://www.google.com/search?q=weather+in+${zip}`,
      )
      .setThumbnail(
        `http://openweathermap.org/img/w/${current.weather[0].icon}.png`,
      )
      .addField(
        'Temperature',
        `${this.kelvinToFahrenheit(current.temp).toFixed()}°F`,
        false,
      )
      .addField(
        'Feels Like Temperature',
        `${this.kelvinToFahrenheit(current.feels_like).toFixed()}°F`,
        false,
      )
      .addField('Description', current.weather[0].description, false)
      .addField('Humidity', `${current.humidity}%`, false)
      .addField('Clouds', `${current.clouds}%\n\u200b`, false);
  }

  private static kelvinToFahrenheit(kelvin: number): number {
    return ((kelvin - 273.15) * 9) / 5 + 32;
  }

  private static async getWeatherData(
    latitude: number,
    longitude: number,
  ): Promise<OpenWeatherMapResponse> {
    return search(latitude, longitude);
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
