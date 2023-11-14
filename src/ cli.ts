import { Command } from 'commander'
import { name, version, description } from './config'
import { logger } from './logger'

export type CliOptions = {
  files: string[]
  linter: string
  noLinter: boolean
  silent: boolean
  overwrite: boolean
  dryRun: boolean
}

const cli =
  new Command()
    .name(name)
    .version(version)
    .description(description)
    .usage('d2o <filepaths>')
    .option('-f, --files <filepaths...>', 'Accept file paths or globs', [])
    .option('-o, --overwrite', 'Overwrite SFCs with new syntax', false)
    .option('-l, --linter <filepath>', 'Accept linter config file path, "./.eslintrc.js" by default')
    .option('--no-linter', 'Disable file linting', true)
    .option('-s, --silent', 'DO NOT log stuff to console', false)
    .option('-x, --dry-run', 'Generate the new syntax but skip writing to disk', false)
    .parse()

export function getCliOptions(): CliOptions | undefined {
  const options = cli.opts<CliOptions>()

  if (options.files.length === 0) {
    logger.error('At least one option must be provided [--glob <glob>] [-f <filepath>]')
    cli.help()
    return
  }

  return options
}
