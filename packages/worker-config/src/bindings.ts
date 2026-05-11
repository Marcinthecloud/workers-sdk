import type {
	InferWorkerName,
	InferExportsByType,
	InferEntrypointExports,
	UnwrapConfig,
} from "./env";

/**
 * Binding option types - TypeScript interfaces for each binding's configuration options.
 */

interface AiBindingOptions {
	remote?: boolean;
}

interface AiSearchBindingOptions {
	name: string;
	remote?: boolean;
}

interface AiSearchNamespaceBindingOptions {
	namespace: string;
	remote?: boolean;
}

interface AnalyticsEngineDatasetBindingOptions {
	name?: string;
}

interface ArtifactsBindingOptions {
	namespace: string;
	remote?: boolean;
}

interface BrowserBindingOptions {
	remote?: boolean;
}

interface D1BindingOptions {
	id?: string;
	name?: string;
	remote?: boolean;
}

interface DispatchNamespaceBindingOptions {
	namespace: string;
	outbound?: {
		workerName: string;
		parameters?: string[];
	};
	remote?: boolean;
}

interface FlagshipBindingOptions {
	id: string;
	remote?: boolean;
}

interface HyperdriveBindingOptions {
	id: string;
	localConnectionString?: string;
}

interface ImagesBindingOptions {
	remote?: boolean;
}

interface KvBindingOptions {
	id?: string;
	name?: string;
	remote?: boolean;
}

interface LogfwdrBindingOptions {
	destination: string;
}

interface MediaBindingOptions {
	remote?: boolean;
}

interface MtlsCertificateBindingOptions {
	id: string;
	remote?: boolean;
}

interface PipelineBindingOptions {
	name: string;
	remote?: boolean;
}

interface QueueBindingOptions {
	name: string;
	deliveryDelay?: number;
	remote?: boolean;
}

interface RateLimitBindingOptions {
	namespace: string;
	simple: {
		limit: number;
		period: 10 | 60;
	};
}

interface R2BindingOptions {
	name?: string;
	jurisdiction?: string;
	remote?: boolean;
}

interface SecretsStoreSecretBindingOptions {
	storeId: string;
	name: string;
}

interface SendEmailBindingOptions {
	destinationAddress?: string;
	allowedDestinationAddresses?: string[];
	allowedSenderAddresses?: string[];
	remote?: boolean;
}

interface StreamBindingOptions {
	remote?: boolean;
}

interface VectorizeBindingOptions {
	name: string;
	remote?: boolean;
}

interface VpcServiceBindingOptions {
	id: string;
	remote?: boolean;
}

type VpcNetworkBindingOptions =
	| { tunnelId: string; remote?: boolean }
	| { networkId: string; remote?: boolean };

/**
 * Binding return types - What each builder method returns (includes the type discriminator).
 */

interface AiBinding extends AiBindingOptions {
	type: "ai";
}

interface AiSearchBinding extends AiSearchBindingOptions {
	type: "ai-search";
}

interface AiSearchNamespaceBinding extends AiSearchNamespaceBindingOptions {
	type: "ai-search-namespace";
}

interface AnalyticsEngineDatasetBinding extends AnalyticsEngineDatasetBindingOptions {
	type: "analytics-engine-dataset";
}

interface ArtifactsBinding extends ArtifactsBindingOptions {
	type: "artifacts";
}

interface AssetsBinding {
	type: "assets";
}

interface BrowserBinding extends BrowserBindingOptions {
	type: "browser";
}

interface D1Binding extends D1BindingOptions {
	type: "d1";
}

interface DispatchNamespaceBinding extends DispatchNamespaceBindingOptions {
	type: "dispatch-namespace";
}

interface DurableObjectBinding<
	TConfig,
	TName extends string,
	TExport extends string,
> {
	type: "durable-object";
	workerName: TName;
	exportName: TExport;
	/** @internal Carries the config type for inference */
	__config: TConfig;
}

interface FlagshipBinding extends FlagshipBindingOptions {
	type: "flagship";
}

interface HyperdriveBinding extends HyperdriveBindingOptions {
	type: "hyperdrive";
}

interface ImagesBinding extends ImagesBindingOptions {
	type: "images";
}

interface JsonBinding<T> {
	type: "json";
	value: T;
}

interface KvBinding extends KvBindingOptions {
	type: "kv";
}

interface LogfwdrBinding extends LogfwdrBindingOptions {
	type: "logfwdr";
}

interface MediaBinding extends MediaBindingOptions {
	type: "media";
}

interface MtlsCertificateBinding extends MtlsCertificateBindingOptions {
	type: "mtls-certificate";
}

interface PipelineBinding extends PipelineBindingOptions {
	type: "pipeline";
}

interface QueueBinding extends QueueBindingOptions {
	type: "queue";
}

interface RateLimitBinding extends RateLimitBindingOptions {
	type: "rate-limit";
}

interface R2Binding extends R2BindingOptions {
	type: "r2";
}

interface SecretBinding {
	type: "secret";
}

interface SecretsStoreSecretBinding extends SecretsStoreSecretBindingOptions {
	type: "secrets-store-secret";
}

interface SendEmailBinding extends SendEmailBindingOptions {
	type: "send-email";
}

interface StreamBinding extends StreamBindingOptions {
	type: "stream";
}

interface TextBinding<T extends string> {
	type: "text";
	value: T;
}

interface UnsafeBindingOptions {
	type: string;
	dev?: {
		plugin: {
			package: string;
			name: string;
		};
		options?: Record<string, unknown>;
	};
	[key: string]: unknown;
}

interface UnsafeBinding {
	type: "unsafe";
	value: UnsafeBindingOptions;
}

interface VectorizeBinding extends VectorizeBindingOptions {
	type: "vectorize";
}

interface VersionMetadataBinding {
	type: "version-metadata";
}

interface VpcServiceBinding extends VpcServiceBindingOptions {
	type: "vpc-service";
}

type VpcNetworkBinding = VpcNetworkBindingOptions & {
	type: "vpc-network";
};

interface WorkerBinding<TConfig, TName extends string, TExport extends string> {
	type: "worker";
	workerName: TName;
	exportName: TExport;
	props?: Record<string, unknown>;
	remote?: boolean;
	/** @internal Carries the config type for inference */
	__config: TConfig;
}

interface WorkerLoaderBinding {
	type: "worker-loader";
}

interface WorkflowBinding<
	TConfig,
	TName extends string,
	TExport extends string,
> {
	type: "workflow";
	workerName: TName;
	exportName: TExport;
	remote?: boolean;
	/** @internal Carries the config type for inference */
	__config: TConfig;
}

/**
 * Base bindings interface - provides typed builder methods for non-cross-worker binding types.
 * This is used internally and extended by Bindings<TConfigs>.
 */
interface BaseBindings {
	// Value-first bindings
	text<T extends string>(value: T): TextBinding<T>;
	json<T>(value: T): JsonBinding<T>;

	// No-argument or optional-argument bindings
	ai(options?: AiBindingOptions): AiBinding;
	aiSearch(options: AiSearchBindingOptions): AiSearchBinding;
	aiSearchNamespace(
		options: AiSearchNamespaceBindingOptions
	): AiSearchNamespaceBinding;
	analyticsEngineDataset(
		options?: AnalyticsEngineDatasetBindingOptions
	): AnalyticsEngineDatasetBinding;
	artifacts(options: ArtifactsBindingOptions): ArtifactsBinding;
	assets(): AssetsBinding;
	browser(options?: BrowserBindingOptions): BrowserBinding;
	d1(options?: D1BindingOptions): D1Binding;
	dispatchNamespace(
		options: DispatchNamespaceBindingOptions
	): DispatchNamespaceBinding;
	flagship(options: FlagshipBindingOptions): FlagshipBinding;
	hyperdrive(options: HyperdriveBindingOptions): HyperdriveBinding;
	images(options?: ImagesBindingOptions): ImagesBinding;
	kv(options?: KvBindingOptions): KvBinding;
	logfwdr(options: LogfwdrBindingOptions): LogfwdrBinding;
	media(options?: MediaBindingOptions): MediaBinding;
	mtlsCertificate(
		options: MtlsCertificateBindingOptions
	): MtlsCertificateBinding;
	pipeline(options: PipelineBindingOptions): PipelineBinding;
	queue(options: QueueBindingOptions): QueueBinding;
	rateLimit(options: RateLimitBindingOptions): RateLimitBinding;
	r2(options?: R2BindingOptions): R2Binding;
	secret(): SecretBinding;
	secretsStoreSecret(
		options: SecretsStoreSecretBindingOptions
	): SecretsStoreSecretBinding;
	sendEmail(options?: SendEmailBindingOptions): SendEmailBinding;
	stream(options?: StreamBindingOptions): StreamBinding;
	unsafe(options: UnsafeBindingOptions): UnsafeBinding;
	vectorize(options: VectorizeBindingOptions): VectorizeBinding;
	versionMetadata(): VersionMetadataBinding;
	vpcService(options: VpcServiceBindingOptions): VpcServiceBinding;
	vpcNetwork(options: VpcNetworkBindingOptions): VpcNetworkBinding;
	workerLoader(): WorkerLoaderBinding;
}

/**
 * Extract config(s) from TUnwrappedConfig where TName is assignable to the config's name.
 * Unlike Extract, this works when a config has a union name like "worker-a" | "worker-b".
 */
type ExtractConfigByName<TUnwrappedConfig, TName extends string> =
	TName extends InferWorkerName<TUnwrappedConfig> ? TUnwrappedConfig : never;

/**
 * TypedBindings interface for cross-worker bindings with type safety.
 *
 * When you annotate the bindings parameter with `TypedBindings<WorkerConfig>`,
 * the `worker`, `durableObject`, and `workflow` methods become type-safe:
 * - `workerName` is constrained to the `name` from the config(s)
 * - `exportName` is constrained to valid exports for that worker
 * - The resulting binding types are fully parameterized
 *
 * Unknown worker names (not matching any config) fall back to loosely-typed bindings.
 *
 * @example
 * ```typescript
 * import type WorkerAConfig from "@worker-config-examples/worker-a/config";
 * import { defineConfig, type TypedBindings } from "@cloudflare/worker-config";
 *
 * export default defineConfig({
 *   env: (bindings: TypedBindings<WorkerAConfig>) => ({
 *     // Type-safe: workerName must be "worker-a"
 *     WORKER_A: bindings.worker({ workerName: "worker-a" }),
 *     // Type-safe: exportName must be a valid durable object export
 *     MY_DO: bindings.durableObject({ workerName: "worker-a", exportName: "MyDurableObject" }),
 *     // Loosely typed: unknown worker
 *     EXTERNAL: bindings.worker({ workerName: "external-service" }),
 *   }),
 * });
 * ```
 */
/**
 * Helper type to compute valid worker names.
 * For typed configs, returns the constrained union of known worker names.
 * Otherwise, returns string to allow any worker name.
 */
type WorkerName<TUnwrappedConfig> = TUnwrappedConfig extends { name: string }
	? InferWorkerName<TUnwrappedConfig>
	: string;

/**
 * Helper type to compute valid exports for a worker binding.
 * For known workers, returns the constrained union of entrypoint exports.
 * For unknown workers in typed configs, returns never.
 * For untyped configs, returns string to allow any export name.
 */
type WorkerExportName<
	TUnwrappedConfig,
	TName extends string,
> = TUnwrappedConfig extends { name: string }
	? TName extends InferWorkerName<TUnwrappedConfig>
		? InferEntrypointExports<ExtractConfigByName<TUnwrappedConfig, TName>>
		: never
	: string;

/**
 * Helper type to compute valid exports for a durable object binding.
 * For known workers, returns the constrained union of durable object exports.
 * For unknown workers in typed configs, returns never.
 * For untyped configs, returns string to allow any export name.
 */
type DurableObjectExportName<
	TUnwrappedConfig,
	TName extends string,
> = TUnwrappedConfig extends { name: string }
	? TName extends InferWorkerName<TUnwrappedConfig>
		? InferExportsByType<
				ExtractConfigByName<TUnwrappedConfig, TName>,
				"durable-object"
			>
		: never
	: string;

/**
 * Helper type to compute valid exports for a workflow binding.
 * For known workers, returns the constrained union of workflow exports.
 * For unknown workers in typed configs, returns never.
 * For untyped configs, returns string to allow any export name.
 */
type WorkflowExportName<
	TUnwrappedConfig,
	TName extends string,
> = TUnwrappedConfig extends { name: string }
	? TName extends InferWorkerName<TUnwrappedConfig>
		? InferExportsByType<
				ExtractConfigByName<TUnwrappedConfig, TName>,
				"workflow"
			>
		: never
	: string;

/**
 * Return type for worker bindings.
 * When workerName matches a known config, returns a fully typed binding.
 * For unknown workers, returns an untyped binding.
 */
type WorkerBindingResult<
	TUnwrappedConfig,
	TName extends string,
	TExport extends string,
> =
	TName extends InferWorkerName<TUnwrappedConfig>
		? WorkerBinding<
				ExtractConfigByName<TUnwrappedConfig, TName>,
				TName,
				TExport
			>
		: WorkerBinding<void, TName, TExport>;

/**
 * Return type for durable object bindings.
 * When workerName matches a known config, returns a fully typed binding.
 * For unknown workers, returns an untyped binding.
 */
type DurableObjectBindingResult<
	TUnwrappedConfig,
	TName extends string,
	TExport extends string,
> =
	TName extends InferWorkerName<TUnwrappedConfig>
		? DurableObjectBinding<
				ExtractConfigByName<TUnwrappedConfig, TName>,
				TName,
				TExport
			>
		: DurableObjectBinding<void, TName, TExport>;

/**
 * Return type for workflow bindings.
 * When workerName matches a known config, returns a fully typed binding.
 * For unknown workers, returns an untyped binding.
 */
type WorkflowBindingResult<
	TUnwrappedConfig,
	TName extends string,
	TExport extends string,
> =
	TName extends InferWorkerName<TUnwrappedConfig>
		? WorkflowBinding<
				ExtractConfigByName<TUnwrappedConfig, TName>,
				TName,
				TExport
			>
		: WorkflowBinding<void, TName, TExport>;

/**
 * Bindings interface for defining Worker bindings in config.
 *
 * When used without a type parameter, all cross-worker bindings (`worker`,
 * `durableObject`, `workflow`) allow any `workerName` and `exportName`.
 *
 * When parameterized with specific config types, cross-worker bindings become type-safe:
 * - `workerName` is constrained to the `name` from the config(s)
 * - `exportName` is constrained to valid exports for that worker
 * - The resulting binding types are fully parameterized
 *
 * @example
 * ```typescript
 * // Untyped usage with the bindings singleton
 * import { defineConfig, bindings } from "@cloudflare/worker-config";
 *
 * export default defineConfig({
 *   env: {
 *     MY_KV: bindings.kv(),
 *     MY_DO: bindings.durableObject({ workerName: "any-worker", exportName: "AnyExport" }),
 *   },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Typed usage with createBindings
 * import { defineConfig, createBindings } from "@cloudflare/worker-config";
 * import type WorkerAConfig from "@worker-config-examples/worker-a/config";
 *
 * const b = createBindings<typeof WorkerAConfig>();
 *
 * export default defineConfig({
 *   env: {
 *     // Type-safe: workerName must be "worker-a"
 *     WORKER_A: b.worker({ workerName: "worker-a" }),
 *     // Type-safe: exportName must be a valid durable object export
 *     MY_DO: b.durableObject({ workerName: "worker-a", exportName: "MyDurableObject" }),
 *   },
 * });
 * ```
 */
export interface Bindings<
	TConfig,
	TUnwrappedConfig = UnwrapConfig<TConfig>,
> extends BaseBindings {
	/**
	 * Create a worker (Service) binding.
	 * workerName must match a known config's name (or any string for untyped bindings).
	 * exportName must be a valid entrypoint export for that worker.
	 * If exportName is omitted, targets the default export.
	 */
	worker<
		TWorkerName extends WorkerName<TUnwrappedConfig>,
		TExportName extends
			| WorkerExportName<TUnwrappedConfig, TWorkerName>
			| undefined = undefined,
	>(options: {
		workerName: TWorkerName;
		exportName?: TExportName;
		props?: Record<string, unknown>;
		remote?: boolean;
	}): WorkerBindingResult<
		TUnwrappedConfig,
		TWorkerName,
		TExportName extends string ? TExportName : "default"
	>;

	/**
	 * Create a durable object binding.
	 * workerName must match a known config's name (or any string for untyped bindings).
	 * exportName must be a valid durable object export for that worker.
	 */
	durableObject<
		TWorkerName extends WorkerName<TUnwrappedConfig>,
		TExportName extends DurableObjectExportName<TUnwrappedConfig, TWorkerName>,
	>(options: {
		workerName: TWorkerName;
		exportName: TExportName;
	}): DurableObjectBindingResult<TUnwrappedConfig, TWorkerName, TExportName>;

	/**
	 * Create a workflow binding.
	 * workerName must match a known config's name (or any string for untyped bindings).
	 * exportName must be a valid workflow export for that worker.
	 */
	workflow<
		TWorkerName extends WorkerName<TUnwrappedConfig>,
		TExportName extends WorkflowExportName<TUnwrappedConfig, TWorkerName>,
	>(options: {
		workerName: TWorkerName;
		exportName: TExportName;
		remote?: boolean;
	}): WorkflowBindingResult<TUnwrappedConfig, TWorkerName, TExportName>;
}

/**
 * Create a bindings builder for defining Worker bindings.
 *
 * Without a type parameter, creates untyped bindings where cross-worker
 * bindings (worker, durableObject, workflow) accept any workerName/exportName.
 *
 * With a type parameter, creates typed bindings with autocomplete and
 * type checking for known worker configs.
 *
 * @example
 * ```typescript
 * // Untyped
 * import { createBindings } from "@cloudflare/worker-config";
 * const bindings = createBindings();
 *
 * // Typed (single config)
 * import type WorkerAConfig from "./worker-a/config";
 * const b = createBindings<typeof WorkerAConfig>();
 *
 * // Typed (multiple configs)
 * import type WorkerAConfig from "./worker-a/config";
 * import type WorkerBConfig from "./worker-b/config";
 * const b = createBindings<typeof WorkerAConfig | typeof WorkerBConfig>();
 * ```
 */
export function createBindings<TConfig>(): Bindings<TConfig> {
	return {
		// Value-first bindings
		text: (value) => ({ type: "text", value }),
		json: (value) => ({ type: "json", value }),

		// No-argument or optional-argument bindings
		ai: (options) => ({ type: "ai", ...options }),
		aiSearch: (options) => ({ type: "ai-search", ...options }),
		aiSearchNamespace: (options) => ({
			type: "ai-search-namespace",
			...options,
		}),
		analyticsEngineDataset: (options) => ({
			type: "analytics-engine-dataset",
			...options,
		}),
		artifacts: (options) => ({ type: "artifacts", ...options }),
		assets: () => ({ type: "assets" }),
		browser: (options) => ({ type: "browser", ...options }),
		d1: (options) => ({ type: "d1", ...options }),
		dispatchNamespace: (options) => ({
			type: "dispatch-namespace",
			...options,
		}),
		flagship: (options) => ({ type: "flagship", ...options }),
		hyperdrive: (options) => ({ type: "hyperdrive", ...options }),
		images: (options) => ({ type: "images", ...options }),
		kv: (options) => ({ type: "kv", ...options }),
		logfwdr: (options) => ({ type: "logfwdr", ...options }),
		media: (options) => ({ type: "media", ...options }),
		mtlsCertificate: (options) => ({ type: "mtls-certificate", ...options }),
		pipeline: (options) => ({ type: "pipeline", ...options }),
		queue: (options) => ({ type: "queue", ...options }),
		rateLimit: (options) => ({ type: "rate-limit", ...options }),
		r2: (options) => ({ type: "r2", ...options }),
		secret: () => ({ type: "secret" }),
		secretsStoreSecret: (options) => ({
			type: "secrets-store-secret",
			...options,
		}),
		sendEmail: (options) => ({ type: "send-email", ...options }),
		stream: (options) => ({ type: "stream", ...options }),
		unsafe: (options) => ({ type: "unsafe", value: options }),
		vectorize: (options) => ({ type: "vectorize", ...options }),
		versionMetadata: () => ({ type: "version-metadata" }),
		vpcService: (options) => ({ type: "vpc-service", ...options }),
		vpcNetwork: (options) => ({ type: "vpc-network", ...options }),
		workerLoader: () => ({ type: "worker-loader" }),

		// Cross-worker bindings
		worker: (options) => ({ type: "worker", ...options }),
		durableObject: (options) => ({ type: "durable-object", ...options }),
		workflow: (options) => ({ type: "workflow", ...options }),
	} as Bindings<TConfig>;
}

/**
 * Pre-created untyped bindings for convenience.
 * Use this when you don't need typed cross-worker bindings.
 *
 * @example
 * ```typescript
 * import { defineConfig, bindings } from "@cloudflare/worker-config";
 *
 * export default defineConfig({
 *   env: {
 *     MY_KV: bindings.kv(),
 *     MY_DB: bindings.d1(),
 *   },
 * });
 * ```
 */
export const bindings = createBindings();
