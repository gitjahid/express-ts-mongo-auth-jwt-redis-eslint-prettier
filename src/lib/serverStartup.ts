import { Express } from 'express';
import chalk from 'chalk';
import env from '@app/env';

/**
 * Server defined routes path
 * @param thing any
 * @returns string
 */
function splitRoutePath(thing: any): string {
  if (typeof thing === 'string') {
    return thing;
  }

  if (thing.fast_slash) {
    return '';
  }

  const match = thing
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
  return match ? match[1].replace(/\\(.)/g, '$1') : `<complex:${thing.toString()}>`;
}

/**
 * Server defined routes of layer
 * @param path string
 * @param layer any
 * @returns string[]
 */
function getRoutesOfLayer(path: string, layer: any): string[] {
  const prefixes = {
    GET: 'magenta',
    POST: 'green',
    PUT: 'yellow',
    PATCH: 'yellowBright',
    DELETE: 'red',
    OPTIONS: 'cyan',
    HEAD: 'cyan',
  };

  if (layer.method) {
    const method = layer.method.toUpperCase() as any;
    const methodColor = (prefixes as any)[method];
    return [`${(chalk as any)[methodColor](method)} ${path}`];
  }

  if (layer.route) {
    return getRoutesOfLayer(path + splitRoutePath(layer.route.path), layer.route.stack[0]);
  }

  if (layer.name === 'router' && layer.handle.stack) {
    let routes: string[] = [];

    layer.handle.stack.forEach(function (stackItem: any) {
      routes = routes.concat(getRoutesOfLayer(path + splitRoutePath(layer.regexp), stackItem));
    });

    return routes;
  }

  return [];
}

/**
 * Server defined routes
 * @param app any
 * @returns string[]
 */
function getRoutes(app: any): string[] {
  let routes: string[] = [];

  // eslint-disable-next-line no-underscore-dangle
  app._router.stack.forEach(function (layer: any) {
    routes = routes.concat(getRoutesOfLayer('', layer));
  });

  return routes;
}

/**
 * Server startup logger
 * @param app Express
 * @param port string | number
 * @returns string
 */
function serverStartup(app: Express, port: string | number) {
  const routes: string[] = getRoutes(app);

  let launchMessage = `\n`;
  launchMessage += `🔧 Server Configuration.\n`;
  launchMessage += `   >> ${chalk.green('name')}: ${chalk.yellow(env.app.name)}\n`;
  launchMessage += `   >> ${chalk.green('version')}: ${chalk.yellow(env.app.version)}\n`;
  launchMessage += `   >> ${chalk.green('address')}: ${chalk.yellow(env.app.host)}\n`;
  launchMessage += `   >> ${chalk.green('port')}: ${chalk.yellow(port)}\n`;
  launchMessage += `   >> ${chalk.green('environment')}: ${chalk.yellow(env.node)}\n`;
  launchMessage += `\n🛰  Routes:\n`;
  routes.forEach(route => {
    launchMessage += `   >> ${route}\n`;
  });
  launchMessage += `\n🚀 Server Started on ${env.app.schema}://${env.app.host}:${env.app.port}\n`;

  return launchMessage;
}

export default serverStartup;
