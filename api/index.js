import { data } from './data';

const noop = v => v;
const missing = () => undefined;
const emtyString = () => '';
const emtyStringOrNull = () => Math.random() < 0.5 ? '' : null;
const negative = v => -v;

const errorRatios = {
  guid: { ratio: 0, operation: noop },
  email: { ratio: 0.05, operation: noop },
  userName: { ratio: 0, operation: noop },
  description: { ratio: 0.05, operation: emtyStringOrNull },
  title: { ratio: 0, operation: noop },
  avatarURL: { ratio: 0.1, operation: emtyString },
  durationInSec: { ratio: 0.025, operation: negative },
  theme: { ratio: 0.4, operation: missing },
  mediaType: { ratio: 0, operation: noop },
  created: { ratio: 0, operation: noop },
}

function addRandomErrors(playlist) {
  return playlist.map((item) => {
    const dataWithErrors = Object
      .entries(item)
      .map(([key, value]) => {
        const { ratio, operation } = errorRatios[key];
        return Math.random() < ratio ? [key, operation(value)] : [key, value];
      });

    return Object.fromEntries(dataWithErrors);
  });
}

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return;
  }
  return await fn(req, res);
}

function handler(req, res) {
  res.status(200).json({ playlist: addRandomErrors(data) });
}

export default allowCors(handler);