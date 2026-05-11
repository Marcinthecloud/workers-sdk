import { writeFileSync } from "node:fs";
import { generateTypes } from "@cloudflare/worker-config";

const content = generateTypes({
	configPath: "./worker.config",
});

writeFileSync("worker-configuration.d.ts", content);
console.log("Generated worker-configuration.d.ts");
