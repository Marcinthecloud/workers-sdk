import type { Config } from './schema'

interface ConfigContext {}

type ConfigFnObject = (ctx: ConfigContext) => Config;
type ConfigFnPromise = (ctx: ConfigContext) => Promise<Config>;
type ConfigFn = (ctx: ConfigContext) => Config | Promise<Config>;
type ConfigExport =
  | Config
  | Promise<Config>
  | ConfigFnObject
  | ConfigFnPromise
  | ConfigFn;

export function defineConfig<T extends ConfigExport>(config: T): T {
	return null as any
}