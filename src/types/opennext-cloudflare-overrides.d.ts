// The project uses TypeScript's classic "node" moduleResolution, which cannot
// resolve package "exports" subpaths. These declarations let the OpenNext
// config import the official cache/queue overrides without changing tsconfig.
declare module "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache" {
  const r2IncrementalCache: any;
  export default r2IncrementalCache;
}

declare module "@opennextjs/cloudflare/overrides/queue/memory-queue" {
  const memoryQueue: any;
  export default memoryQueue;
}
