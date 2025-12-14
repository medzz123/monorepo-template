/** biome-ignore-all lint/suspicious/noConsole: <need logger> */
import 'dotenv/config';
import util from 'node:util';

import { createContext } from '@template/api-routes/context';
import { router } from '@template/api-routes/router';
import { prisma } from '@template/db/prisma';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express, { type Express } from 'express';
import { env } from './env';

const app: Express = express();

const isProduction = env.ENVIRONMENT === 'production';

process.on('uncaughtException', (error) => {
  console.error('server: uncaught exception', { error });
  if (!isProduction) {
    return;
  }
});

process.on('unhandledRejection', (reason, promise) => {
  let readablePromise: string | Promise<unknown> = promise;
  try {
    readablePromise = util.inspect(promise);
  } catch (error) {
    console.error('server: failed to inspect promise', { error });
  }

  console.error(`server: unhandled promise rejection: ${readablePromise}: ${reason}`);
  if (!isProduction) {
    return;
  }
});

app.use(
  '/trpc',
  createExpressMiddleware({
    router: router,
    createContext: (trpCtx) => {
      return createContext({
        trpcOptions: trpCtx,
        context: { env, db: prisma },
      });
    },
    onError: (opts) => {
      const { error, path } = opts;
      console.warn(`TRPC Failed on path: ${path}`, { path, error });
    },
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.get('/health-check', async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send({ status: `OK` });
  } catch {
    res.status(500).send({ status: `Not OK` });
  }
});

app.listen(env.PORT, () => {
  console.log(`Running on port ${env.PORT} - v1`);
});
