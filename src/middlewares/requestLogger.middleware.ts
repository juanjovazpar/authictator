import { FastifyRequest } from 'fastify';
import { lookup } from 'geoip-lite';
import { IRequestDetails } from '../interfaces';

export const requestLogger = async (req: FastifyRequest) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;
  const geo = lookup(ip as string);
  const referrer = Array.isArray(req.headers['referer'])
    ? req.headers['referer'][0]
    : req.headers['referer'] || req.headers['referrer'] || '';
  const requestDetails: IRequestDetails = {
    ip: ip as string,
    userAgent: req.headers['user-agent'] || '',
    referrer: referrer as string,
    geoLocation: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'N/A',
    deviceType: /mobile|tablet/i.test(req.headers['user-agent'] || '') ? 'Mobile' : 'Desktop',
    language: req.headers['accept-language'] || '',
    url: req.raw.url,
    method: req.method,
    body: req.body,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).requestDetails = requestDetails;

  console.log('RequestDetails:', requestDetails);
};
