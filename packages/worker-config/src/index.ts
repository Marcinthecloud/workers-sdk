import type { Bindings } from "./bindings";
import type { WorkerModule } from "./env";
import type { Config } from "./schema";

export type { Bindings };
export { createBindings, bindings } from "./bindings";
export type {
	InferEnv,
	InferDurableNamespaces,
	InferMainModule,
	UnwrapConfig,
	WorkerModule,
} from "./env";
export type { Config } from "./schema";
export { generateTypes } from "./generate";

// oxlint-disable-next-line typescript/no-empty-object-type -- base type to be merged with consumer's
interface ConfigContext {}

/**
 * Config with module-based entrypoint (for user-facing API).
 * Use `bindings` or `createBindings<TConfig>()` to create binding definitions for `env`.
 */
interface UserConfig extends Omit<Config, "entrypoint"> {
	entrypoint?: WorkerModule | string;
}

type ConfigFnObject = (ctx: ConfigContext) => UserConfig;
type ConfigFnPromise = (ctx: ConfigContext) => Promise<UserConfig>;
type ConfigFn = (ctx: ConfigContext) => UserConfig | Promise<UserConfig>;
type ConfigExport =
	| UserConfig
	| Promise<UserConfig>
	| ConfigFnObject
	| ConfigFnPromise
	| ConfigFn;

export function defineConfig<const T extends ConfigExport>(config: T): T {
	return config;
}
