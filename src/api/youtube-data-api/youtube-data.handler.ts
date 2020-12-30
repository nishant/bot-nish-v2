import axios from 'axios';
import { YOUTUBE_API_KEY } from '../../config';
import { logger } from '../../utilities/logger';
import { YoutubeResponse } from './youtube-data.response';

const endpoint = 'https://www.googleapis.com/youtube/v3';
const videoBaseUrl = 'https://www.youtube.com/watch?v=';

const requestClient = axios.create({
  baseURL: endpoint,
  params: {
    key: YOUTUBE_API_KEY,
  },
});

export const search = async (query: string): Promise<YoutubeResponse> => {
  try {
    const { data: body } = await requestClient.get('/search', {
      params: { q: query },
    });
    logger.info('YouTube API Search', `query: ${query}`, `response: ${body}`);
    return body;
  } catch (e) {
    logger.info('YouTube API Search Error!!!', `${e.message}`);
    throw new Error('Youtube Search Error');
  }
};

export const getPlayableUrl = (videoId: string): string =>
  `${videoBaseUrl}${videoId}`;
