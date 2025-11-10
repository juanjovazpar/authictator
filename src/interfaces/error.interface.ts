export interface IErrorWithStatusCode extends Error {
  statusCode?: number;
}
