import got from 'got';

const getRobots = async (url: string, timeout: number) => {
  const response = await got(url, {
    method: 'GET',
    timeout,
    throwHttpErrors: false,
    responseType: 'text',
  });

  if (response.statusCode !== 200) throw new Error('No robots.txt');

  return response.body;
};

export = getRobots;
