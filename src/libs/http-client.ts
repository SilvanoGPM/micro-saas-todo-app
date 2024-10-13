import axios from 'axios';

import { getBaseUrl } from '$utils/metadata';

export const httpClient = axios.create({
  baseURL: `${getBaseUrl()}/api`,
});
