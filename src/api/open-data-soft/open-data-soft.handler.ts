import axios from 'axios';
import { logger } from '../../utilities/logger';
import { OpenDataSoftReverseZipResponse } from './open-data-soft.response';

const endpoint = 'https://public.opendatasoft.com/api/records/1.0';
const dataset = 'us-zip-code-latitude-and-longitude';

const requestClient = axios.create({
  baseURL: endpoint,
});

export const reverseZipSearch = async (
  zip: string,
): Promise<OpenDataSoftReverseZipResponse> => {
  try {
    const { data: body } = await requestClient.get('/search', {
      params: { dataset, q: zip },
    });
    logger.info(
      'OpenDataSoft API Search',
      `query: ${zip}`,
      `response: ${body}`,
    );
    return body;
  } catch (e) {
    logger.info('OpenDataSoft API Search Error!', `${e.message}`);
    throw new Error('OpenDataSoft Search Error');
  }
};
