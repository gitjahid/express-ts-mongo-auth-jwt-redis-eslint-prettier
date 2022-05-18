import http from 'http';
import app from '@app/app';
import logger from '@lib/logger';
import initRedisServer from '@lib/redis';
import initDatabase from '@lib/mongodb';
import serverStartup from '@lib/serverStartup';
import env from '@app/env';

/**
 * Server Initializer function
 */
const bootServer = async (): Promise<void> => {
  try {
    const { port } = env.app;
    const server = http.createServer(app);

    await initRedisServer();
    await initDatabase();

    server
      .listen(port, () => {
        const startupMessage = serverStartup(app, port);
        console.log(startupMessage);
      })
      .on('error', (error: any) => {
        if (error.syscall !== 'listen') {
          logger.error({ message: error.message, stack: error.stack });
          throw error;
        }

        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

        switch (error.code) {
          case 'EACCES':
            throw new Error(`${bind} requires elevated privileges`);
          case 'EADDRINUSE':
            throw new Error(`${bind} is already in use`);
          default:
            logger.error({ message: error.message, stack: error.stack });
            throw error;
        }
      });
  } catch (error: any) {
    logger.error({
      message: error.message,
      stack: error.stack,
    });

    throw error;
  }
};

bootServer().catch(err => {
  console.log(err);
  process.exit(0);
});
