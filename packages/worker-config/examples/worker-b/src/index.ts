import { WorkerEntrypoint, DurableObject } from "cloudflare:workers";

export class MyEntrypoint extends WorkerEntrypoint {
	add(a: number, b: number) {
		return a + b;
	}
}

export class MyDurableObject extends DurableObject {
	greet(name: string) {
		return `Hello ${name}`;
	}
}

export default {
	async fetch() {
		return new Response("Hello world");
	},
} satisfies ExportedHandler<Env>;
