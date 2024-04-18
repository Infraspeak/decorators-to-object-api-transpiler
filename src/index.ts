import { getCliOptions } from './ cli'
import { compile } from './compiler'
import { buildVueComponent, VueComponent, writeVueComponent } from './file-controller'
import { buildLinter, lintFile } from './compiler/linter'
import { getVueSFCFilePaths, notNullish } from './utils'
import { logger } from './logger'
import {ESLint} from 'eslint'

const main = async (): Promise<void> => {
  const options = getCliOptions()

  if (!options) return

  const { files, silent, linter: linterConfigFile, overwrite} = options
  let linter: ESLint | undefined
  const lintFiles = !!linter
  if(lintFiles) {
   linter = buildLinter(linterConfigFile)
  }

  if (!silent) {
    logger.info('Looking for Vue SFCs in:')
    files.forEach(file => logger.info(`\t${file}`))
  }

  const vueComponentDescriptors = files
    .flatMap(getVueSFCFilePaths)
    .map(buildVueComponent)
    .filter(notNullish)

  if (!silent) {
    logger.info(`Found ${vueComponentDescriptors.length} files:`)
    vueComponentDescriptors.forEach(({ filepath }) => logger.info(`\t${filepath}`))
  }

  if (!silent) {
    if(options.dryRun) {
      logger.info('Converting files:')
    }else{
      logger.warn('[DRY RUN] Converting files:')
    }
  }
  const compiledComponents = await Promise.all(vueComponentDescriptors.map(async ({ filepath, descriptor }): Promise<VueComponent | undefined> => {
    if (!silent) {
      if(options.dryRun) {
        logger.warn(`\t [DRY RUN] ${filepath}`)
      } else {
        logger.info(`\t${filepath}`)
      }
    }
    try {
      const options = linter ? { linter } : undefined
      return { filepath, descriptor: await compile(descriptor, options) }
    } catch (error) {
      logger.error(`${error} on ${filepath}`)
    }
  }))

  // compiledComponents.forEach(c => logger.info(c.descriptor.script?.content))
  if (lintFiles) {
    if (!silent) logger.info('Linting files:')
  }
  await Promise.all(compiledComponents.filter(notNullish).map(async c => {

    if(options.dryRun) {
      return Promise.resolve()
    }

    const { filepath } = writeVueComponent(c)
    try {
      if (linter) {
        if (!silent) logger.info(`\t${filepath}`)
        await lintFile(linter, filepath)
      }
    } catch (error) {
      logger.warn(`Failed to lint ${filepath}: ${error}`)
    }
  }))
}

main()

