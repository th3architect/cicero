#!/usr/bin/env node
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const logger = require('cicero-core').logger;
const Commands = require('./lib/commands');

require('yargs')
    .command('parse', 'parse dsl text using a template', (yargs) => {
        yargs.option('template', {
            describe: 'path to the directory with the template',
            type: 'string'
        });
        yargs.option('dsl', {
            describe: 'path to the clause text',
            type: 'string'
        });
    }, (argv) => {
        if (argv.verbose) {
            logger.info(`parse dsl ${argv.dsl} using a template ${argv.template}`);
        }

        try {
            argv = Commands.validateParseArgs(argv);
        } catch (err){
            logger.error(err.message);
            return;
        }

        return Commands.parse(argv.template, argv.dsl)
            .then((result) => {
                logger.info(JSON.stringify(result));
            })
            .catch((err) => {
                logger.error(err.message + ' ' + JSON.stringify(err));
            });
    })
    .command('execute', 'execute a clause with JSON data', (yargs) => {
        yargs.option('template', {
            describe: 'path to the directory with the template',
            type: 'string'
        });
        yargs.option('dsl', {
            describe: 'path to the clause text',
            type: 'string'
        });
        yargs.option('data', {
            describe: 'path to the request JSON data',
            type: 'string'
        });
    }, (argv) => {

        try {
            argv = Commands.validateExecuteArgs(argv);
        } catch (err){
            logger.error(err.message);
            return;
        }

        return Commands.execute(argv.template, argv.dsl, argv.data)
            .then((result) => {
                logger.info(JSON.stringify(result));
            })
            .catch((err) => {
                logger.error(err.message + ' ' + JSON.stringify(err));
            });
    })
    .command('generate', 'generate code from the template model', (yargs) => {
        yargs.option('template', {
            describe: 'path to the directory with the template',
            type: 'string',
            default: '.'
        });
        yargs.option('format', {
            describe: 'format of the code to generate',
            type: 'string',
            default: 'JSONSchema'
        });
        yargs.option('outputDirectory', {
            describe: 'output directory path',
            type: 'string',
            default: './output/'
        });
    }, (argv) => {
        if (argv.verbose) {
            logger.info(`generate code in format ${argv.format} from the model for template ${argv.template} into directory ${argv.outputDirectory}`);
        }

        try {
            argv = Commands.validateExecuteArgs(argv);
        } catch (err){
            logger.error(err.message);
            return;
        }

        return Commands.generate(argv.format, argv.template, argv.outputDirectory)
            .then((result) => {
                logger.info('Completed.');
            })
            .catch((err) => {
                logger.error(err.message + ' ' + JSON.stringify(err));
            });
    })
    .option('verbose', {
        alias: 'v',
        default: false
    })
    .argv;