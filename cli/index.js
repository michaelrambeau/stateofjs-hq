#!/usr/bin/env node
const prog = require('caporal')

const download = require('./download')
const aggregate = require('./aggregate')
const stats = require('./stats')

prog
  .version('0.1.0')
  .description('State of JavaScript HQ Command Line Tools')
  .command('download', 'Download survey results using Typeform API')
  .option(
    '--limit <number>',
    'Maximum number of records to migrate',
    prog.INT,
    10
  )
  .option(
    '--all <boolean>',
    'Set to true to download all result pages',
    prog.BOOL,
    false
  )
  .option('--start <number>', 'Start upload from number', prog.INT, 1)
  .action((args, options, logger) => {
    logger.info('Start downloading the survey results', options)
    download(options, logger)
  })
  .command('aggregate', 'Aggregate results from local CSV files')
  .action((args, options, logger) => {
    logger.info('Start aggregating the CSV files', options)
    aggregate(options, logger)
  })
  .command('stats', 'Generate statictics from the aggregated files')
  .action((args, options, logger) => {
    logger.info('Start generating statistics', options)
    stats(options, logger)
  })

prog.parse(process.argv)
