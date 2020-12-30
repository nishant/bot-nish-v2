import axios from 'axios';
import { OPEN_WEATHER_MAP_API_KEY } from '../../config';
import { logger } from '../../utilities/logger';
import { OpenWeatherMapResponse } from './open-weather-map.response';

const endpoint = 'https://api.openweathermap.org/data/2.5';
const exclude = ['minutely', 'alerts'];
const requestClient = axios.create({
  baseURL: endpoint,
  params: {
    exclude: exclude.join(','),
    appid: OPEN_WEATHER_MAP_API_KEY,
  },
});

export const search = async (
  latitude: number,
  longitude: number,
): Promise<OpenWeatherMapResponse> => {
  try {
    const { data: body } = await requestClient.get('/onecall', {
      params: { lat: latitude, lon: longitude },
    });
    logger.info(
      'OpenWeatherMap API Search',
      `query: ${latitude} : ${longitude}`,
      `response: ${body}`,
    );
    return body;
  } catch (e) {
    logger.info('OpenDataSoft API Search Error!!!', `${e.message}`);
    throw new Error('OpenDataSoft Search Error');
  }
};
