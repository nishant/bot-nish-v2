import axios from 'axios';
import { logger } from '../../utilities/logger';
import {
  JikanAnimeSearchResponse,
  JikanUserSearchResponse,
} from './jikan.response';

const endpoint = 'https://api.jikan.moe/v3';

const requestClient = axios.create({
  baseURL: endpoint,
});

export const animeSearch = async (
  animeName: string,
): Promise<JikanAnimeSearchResponse> => {
  try {
    const { data: body } = await requestClient.get('/search/anime', {
      params: { q: animeName, page: 1, limit: 10 },
    });
    return body;
  } catch (e) {
    logger.info('Jikan API Search Error!', `${e.message}`);
    throw new Error('Jikan Search Error');
  }
};

export const userSearch = async (
  username: string,
): Promise<JikanUserSearchResponse> => {
  try {
    const { data: body } = await requestClient.get(`/user/${username}/profile`);
    return body;
  } catch (e) {
    logger.info('Jikan API Search Error!', `${e.message}`);
    throw new Error('Jikan Search Error');
  }
};
