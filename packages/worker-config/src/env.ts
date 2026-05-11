// oxlint-disable typescript/no-explicit-any -- needed in type utils

/**
 * Represents a Worker module namespace (from `import * as Module from '...'`).
 */
export type WorkerModule = Record<string, unknown>;

/**
 * Represents a class constructor that creates instances of TBrand.
 */
type Constructor<TBrand> = new (...args: any[]) => TBrand;

/**
 * Default module type representing an unknown worker's exports.
 * - default export can be ExportedHandler or a WorkerEntrypoint class constructor
 * - named exports can be WorkerEntrypoint, DurableObject, or WorkflowEntrypoint class constructors
 */
interface DefaultModule {
	default?: ExportedHandler | Constructor<Rpc.WorkerEntrypointBranded>;
	[key: string]:
		| ExportedHandler
		| Constructor<Rpc.WorkerEntrypointBranded>
		| Constructor<Rpc.DurableObjectBranded>
		| Constructor<Rpc.WorkflowEntrypointBranded>
		| undefined;
}

/**
 * Mapping from binding type literals to Cloudflare runtime types.
 * These types are assumed to be ambient.
 */
interface BindingTypeMap {
	ai: Ai;
	"ai-search": AiSearchInstance;
	"ai-search-namespace": AiSearchNamespace;
	"analytics-engine-dataset": AnalyticsEngineDataset;
	artifacts: Artifacts;
	assets: Fetcher;
	browser: Fetcher;
	d1: D1Database;
	"dispatch-namespace": DispatchNamespace;
	"durable-object": DurableObjectNamespace;
	flagship: Flagship;
	hyperdrive: Hyperdrive;
	images: ImagesBinding;
	kv: KVNamespace;
	logfwdr: any;
	media: MediaBinding;
	"mtls-certificate": Fetcher;
	pipeline: any; // TODO: Wrangler's type generation fetches the pipeline schema from the API
	queue: Queue;
	"rate-limit": RateLimit;
	r2: R2Bucket;
	secret: string;
	"secrets-store-secret": SecretsStoreSecret;
	"send-email": SendEmail;
	stream: StreamBinding;
	vectorize: VectorizeIndex;
	"version-metadata": WorkerVersionMetadata;
	"vpc-service": Fetcher;
	"vpc-network": Fetcher;
	unsafe: any;
	worker: Fetcher;
	"worker-loader": WorkerLoader;
	workflow: Workflow;
}

/**
 * Infer the runtime type for a single binding definition.
 */
/**
 * Extracts the instance type from a class constructor.
 * If T is a constructor for TBrand, returns InstanceType<T>.
 * Otherwise returns never.
 */
type ExtractInstance<T, TBrand> = T extends Constructor<TBrand>
	? InstanceType<T>
	: never;

/**
 * Helper to extract the service instance type from a constructor or handler.
 * Accepts constructors and extracts the instance type.
 * For ExportedHandler, returns undefined (no RPC methods available).
 * Returns never if the type doesn't match, surfacing type errors downstream.
 */
type AsServiceType<T> =
	| ExtractInstance<T, Rpc.WorkerEntrypointBranded>
	| (T extends ExportedHandler ? undefined : never);

/**
 * Helper to extract the durable object instance type from a constructor.
 * Accepts constructors and extracts the instance type.
 * Returns never if the type doesn't match, surfacing type errors downstream.
 */
type AsDurableObjectType<T> = ExtractInstance<T, Rpc.DurableObjectBranded>;

/**
 * Helper to extract the workflow instance type from a constructor.
 * Accepts constructors and extracts the instance type.
 * Returns never if the type doesn't match.
 */
type AsWorkflowType<T> = ExtractInstance<T, Rpc.WorkflowEntrypointBranded>;

type InferBindingType<TBinding> =
	// Worker binding - extracts config from __config to infer Service type
	TBinding extends {
		type: "worker";
		exportName: infer TExportName extends string;
		__config: infer TUnwrappedConfig;
	}
		? InferMainModule<TUnwrappedConfig> extends infer TModule extends WorkerModule
			? TExportName extends keyof TModule
				? Fetcher<AsServiceType<TModule[TExportName]>>
				: Fetcher
			: Fetcher
		: // Durable object binding - extracts config from __config to infer namespace type
			TBinding extends {
					type: "durable-object";
					exportName: infer TExportName extends string;
					__config: infer TUnwrappedConfig;
			  }
			? InferMainModule<TUnwrappedConfig> extends infer TModule extends WorkerModule
				? TExportName extends keyof TModule
					? DurableObjectNamespace<AsDurableObjectType<TModule[TExportName]>>
					: DurableObjectNamespace
				: DurableObjectNamespace
			: // Workflow binding - extracts config from __config to infer Workflow type
				TBinding extends {
						type: "workflow";
						exportName: infer TExportName extends string;
						__config: infer TUnwrappedConfig;
				  }
				? InferMainModule<TUnwrappedConfig> extends infer TModule extends WorkerModule
					? TExportName extends keyof TModule
						? AsWorkflowType<TModule[TExportName]> extends infer TWorkflow
							? TWorkflow extends {
									run(event: { payload: infer P }, step: any): any;
								}
								? Workflow<P>
								: Workflow
							: Workflow
						: Workflow
					: Workflow
				: // JSON bindings: infer exact type from value
					TBinding extends { type: "json"; value: infer TValue }
					? TValue
					: // Text bindings: infer literal string type from value
						TBinding extends { type: "text"; value: infer TValue }
						? TValue
						: // Standard bindings: lookup in BindingTypeMap
							TBinding extends {
									type: infer K extends keyof BindingTypeMap;
							  }
							? BindingTypeMap[K]
							: never;

/**
 * Unwrap function and promise types to get the underlying config.
 * Use this to normalize a config before passing it to other inference utilities.
 *
 * @example
 * ```typescript
 * import { defineConfig } from "@cloudflare/worker-config";
 * import type { UnwrapConfig, InferEnv, InferMainModule } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({ ... });
 * type Config = UnwrapConfig<typeof config>;
 * type Env = InferEnv<Config>;
 * type MainModule = InferMainModule<Config>;
 * ```
 */
export type UnwrapConfig<TConfig> = TConfig extends (
	...args: any[]
) => infer TReturn
	? UnwrapConfig<TReturn>
	: TConfig extends Promise<infer TCompletion>
		? TCompletion
		: TConfig;

/**
 * Infer the `Env` interface type from a Worker config.
 *
 * This utility type transforms a config object's `env` bindings into their
 * corresponding Cloudflare runtime types.
 *
 * @example
 * ```typescript
 * import { defineConfig, bindings } from "@cloudflare/worker-config";
 * import type { InferEnv } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({
 *   env: {
 *     MY_KV: bindings.kv(),
 *     MY_DB: bindings.d1(),
 *     CONFIG: bindings.json({ debug: true }),
 *   },
 * });
 *
 * // Inferred as: { MY_KV: KVNamespace; MY_DB: D1Database; CONFIG: { debug: boolean } }
 * export type Env = InferEnv<typeof config>;
 * ```
 */
export type InferEnv<TUnwrappedConfig> = TUnwrappedConfig extends {
	env: infer TEnv extends Record<string, unknown>;
}
	? { [K in keyof TEnv]: InferBindingType<TEnv[K]> }
	: never;

/**
 * Infer the durable namespace names from a Worker config's exports.
 * Returns a union of export names that have `type: "durable-object"`.
 *
 * @example
 * ```typescript
 * import { defineConfig } from "@cloudflare/worker-config";
 * import type { InferDurableNamespaces } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({
 *   exports: {
 *     MyDurableObject: { type: "durable-object", storage: "sqlite" },
 *     MyWorkflow: { type: "workflow", name: "my-workflow" },
 *   },
 * });
 *
 * // Inferred as: "MyDurableObject"
 * type DurableNamespaces = InferDurableNamespaces<typeof config>;
 * ```
 */
export type InferDurableNamespaces<TUnwrappedConfig> = InferExportsByType<
	TUnwrappedConfig,
	"durable-object"
>;

/**
 * Infer the main module type from a Worker config's entrypoint.
 * If entrypoint is a module namespace object, returns that type.
 * If entrypoint is a string or not present, returns DefaultModule as fallback.
 *
 * @example
 * ```typescript
 * import * as Worker from './src' with { type: 'cf-worker' }
 * import { defineConfig } from "@cloudflare/worker-config";
 * import type { InferMainModule } from "@cloudflare/worker-config";
 *
 * const config = defineConfig({
 *   entrypoint: Worker,
 * });
 *
 * // Inferred as: typeof Worker (the module's exports)
 * type MainModule = InferMainModule<typeof config>;
 * ```
 */
export type InferMainModule<TUnwrappedConfig> = TUnwrappedConfig extends {
	entrypoint: infer TModule extends WorkerModule;
}
	? TModule
	: DefaultModule;

/**
 * Infer the worker name from a config.
 *
 * @example
 * ```typescript
 * const config = defineConfig({ name: "my-worker", ... });
 * type Name = InferWorkerName<typeof config>; // "my-worker"
 * ```
 */
export type InferWorkerName<TUnwrappedConfig> = TUnwrappedConfig extends {
	name: infer TName extends string;
}
	? TName
	: never;

/**
 * Infer export names from a config's exports, optionally filtered by type.
 * When TExportType is string (default), returns all export names.
 * When TExportType is a specific literal like "durable-object" or "workflow",
 * returns only exports of that type.
 */
export type InferExportsByType<
	TUnwrappedConfig,
	TExportType extends string = string,
> = TUnwrappedConfig extends {
	exports: infer TExports extends Record<string, { type: string }>;
}
	? {
			[K in keyof TExports]: TExports[K] extends { type: TExportType }
				? K & string
				: never;
		}[keyof TExports]
	: never;

/**
 * Infer WorkerEntrypoint export names from a config.
 * Returns named module exports that are NOT declared in config.exports
 * (since config.exports contains DurableObjects and Workflows, not entrypoints).
 * Excludes "default" since exportName should only be provided for named exports.
 */
export type InferEntrypointExports<TUnwrappedConfig> = Exclude<
	keyof InferMainModule<TUnwrappedConfig> & string,
	| "default"
	| InferExportsByType<TUnwrappedConfig, "durable-object" | "workflow">
>;
