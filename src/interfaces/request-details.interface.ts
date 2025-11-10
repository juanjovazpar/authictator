export interface IRequestDetails {
    ip: string;
    userAgent: string;
    referrer: string;
    geoLocation: string;
    deviceType: string;
    language: string;
    url?: string;
    method?: string;
    body?: object | undefined | unknown;
}
