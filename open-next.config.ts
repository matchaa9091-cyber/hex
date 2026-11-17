import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// Use R2 for Next.js ISR data so revalidate/revalidatePath actually work
// instead of silently running with the "dummy" cache on the free plan.
// The in-memory queue handles ISR revalidation via the Worker self-binding;
// it avoids Durable Object subrequests and needs no extra bindings.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: memoryQueue,
});
