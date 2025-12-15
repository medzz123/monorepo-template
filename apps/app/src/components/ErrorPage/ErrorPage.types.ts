export type ErrorPageProps = {
  code: 403 | 404 | 500;
  message?: string;
  title?: string;
};
