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

const chai = require('chai');
const path = require('path');
chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

const Commands = require('../lib/commands');

describe('cicero-cli', () => {
    const template = path.resolve(__dirname, 'data/latedeliveryandpenalty/');
    const sample = path.resolve(__dirname, 'data/latedeliveryandpenalty/', 'sample.txt');
    const data = path.resolve(__dirname, 'data/latedeliveryandpenalty/', 'data.json');
    const parseReponse = {
        '$class':'org.accordproject.latedeliveryandpenalty.TemplateModel',
        'forceMajeure':true,
        'penaltyDuration':{
            '$class':'org.accordproject.latedeliveryandpenalty.Duration',
            'amount':9,
            'unit':'DAY'
        },
        'penaltyPercentage':7,
        'capPercentage':2,
        'termination':{
            '$class':'org.accordproject.latedeliveryandpenalty.Duration',
            'amount':2,
            'unit':'WEEK'
        },
        'fractionalPart':'DAY'
    };

    describe('#parse', () => {
        it('should parse a clause using a template', () => {
            return Commands.parse(template, sample, true).should.eventually.eql(parseReponse);
        });
    });

    describe('#validateParseArgs', () => {
        it('no args specified', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            const args  = Commands.validateParseArgs({
                _: ['parse'],
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            const args  = Commands.validateParseArgs({
                _: ['parse'],
                template: './',
                dsl: 'sample.txt'
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified, parent folder', () => {
            process.chdir(path.resolve(__dirname, 'data/'));
            const args  = Commands.validateParseArgs({
                _: ['parse'],
                template: 'latedeliveryandpenalty',
                dsl: 'latedeliveryandpenalty/sample.txt'
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified, parent folder, no dsl', () => {
            process.chdir(path.resolve(__dirname, 'data/'));
            const args  = Commands.validateParseArgs({
                _: ['parse'],
                template: 'latedeliveryandpenalty',
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified, child folder, no dsl', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/grammar'));
            const args  = Commands.validateParseArgs({
                _: ['parse'],
                template: '../',
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('no flags specified', () => {
            const args  = Commands.validateParseArgs({
                _: ['parse', path.resolve(__dirname, 'data/latedeliveryandpenalty/')],
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('verbose flag specified', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            Commands.validateParseArgs({
                _: ['parse'],
                verbose: true
            });
        });
        it('bad package.json', () => {
            process.chdir(path.resolve(__dirname, 'data/'));
            (() => Commands.validateParseArgs({
                _: ['parse'],
            })).should.throw(' not a valid cicero template. Make sure that package.json exists and that it has a engines.cicero entry.');
        });
        it('bad sample.txt', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            (() => Commands.validateParseArgs({
                _: ['parse'],
                dsl: 'sample_en.txt'
            })).should.throw('A sample text file is required. Try the --dsl flag or create a sample.txt in the root folder of your template.');
        });
    });

    describe('#execute', () => {
        it('should execute a clause using a template', async () => {
            const response = await Commands.execute(template, sample, data);
            response.response.$class.should.be.equal('org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyResponse');
            response.response.penalty.should.be.equal(4);
            response.response.buyerMayTerminate.should.be.equal(false);
        });
    });

    describe('#validateExecuteArgs', () => {
        it('no args specified', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            const args  = Commands.validateExecuteArgs({
                _: ['execute'],
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            const args  = Commands.validateExecuteArgs({
                _: ['execute'],
                template: './',
                dsl: 'sample.txt'
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified, parent folder', () => {
            process.chdir(path.resolve(__dirname, 'data/'));
            const args  = Commands.validateExecuteArgs({
                _: ['execute'],
                template: 'latedeliveryandpenalty',
                dsl: 'latedeliveryandpenalty/sample.txt'
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified, parent folder, no dsl', () => {
            process.chdir(path.resolve(__dirname, 'data/'));
            const args  = Commands.validateExecuteArgs({
                _: ['execute'],
                template: 'latedeliveryandpenalty',
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('all args specified, child folder, no dsl', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/grammar'));
            const args  = Commands.validateExecuteArgs({
                _: ['execute'],
                template: '../',
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('no flags specified', () => {
            const args  = Commands.validateExecuteArgs({
                _: ['execute', path.resolve(__dirname, 'data/latedeliveryandpenalty/')],
            });
            args.template.should.match(/cicero-cli\/test\/data\/latedeliveryandpenalty$/);
            args.dsl.should.match(/sample.txt$/);
        });
        it('verbose flag specified', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            Commands.validateExecuteArgs({
                _: ['execute'],
                verbose: true
            });
        });
        it('bad package.json', () => {
            process.chdir(path.resolve(__dirname, 'data/'));
            (() => Commands.validateExecuteArgs({
                _: ['execute'],
            })).should.throw(' not a valid cicero template. Make sure that package.json exists and that it has a engines.cicero entry.');
        });
        it('bad sample.txt', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            (() => Commands.validateExecuteArgs({
                _: ['execute'],
                dsl: 'sample_en.txt'
            })).should.throw('A sample text file is required. Try the --dsl flag or create a sample.txt in the root folder of your template.');
        });
        it('bad datajson', () => {
            process.chdir(path.resolve(__dirname, 'data/latedeliveryandpenalty/'));
            (() => Commands.validateExecuteArgs({
                _: ['execute'],
                data: 'data1.json'
            })).should.throw('A data file is required. Try the --data flag or create a data.json in the root folder of your template.');
        });
    });

});