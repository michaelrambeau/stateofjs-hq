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
    1000
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
    download(options, logger).catch(console.error)
  })
  .command('aggregate', 'Aggregate results from local CSV files')
  .option(
    '--all <boolean>',
    'Aggregate data from all CSV files',
    prog.BOOL,
    false
  )
  .option(
    '--page <number>',
    'Aggregate only data from the given CSV file (specify `1` for the first file)',
    prog.INT,
    1
  )
  .action((args, options, logger) => {
    logger.info('Start aggregating the CSV files', options)
    aggregate(options, logger).catch(console.error)
  })
  .command('stats', 'Generate statistics from the aggregated files')
  .action((args, options, logger) => {
    logger.info('Start generating statistics', options)
    stats(options, logger).catch(console.error)
  })

prog.parse(process.argv)
