import axios from 'axios';

export const request = async ({
  url,
  data,
  header,
  method,
  dataType,
  responseType,
  timeout = 20 * 1000,
  ...params
}) => {
  const { data: response } = await axios.request({
    url,
    data,
    headers: header,
    method,
    dataType,
    responseType,
    timeout,
    ...params,
  });

  return response;
};
