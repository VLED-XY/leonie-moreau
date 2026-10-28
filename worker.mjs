import nextWorker from "./.open-next/worker.js";
import { handleBookingRequest } from "./src/lib/booking-handler.ts";

// Handle the form before Next.js so every portfolio page stays prerendered.
const worker = {
  fetch(request, env, ctx) {
    if (new URL(request.url).pathname === "/api/booking") {
      return handleBookingRequest(request, env);
    }
    return nextWorker.fetch(request, env, ctx);
  },
};

export default worker;

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
