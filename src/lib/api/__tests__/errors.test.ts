/**
 * Run with: npx tsx src/lib/api/__tests__/errors.test.ts
 * (or include in your test runner when added)
 */

import assert from "node:assert/strict";

import { ApiError, getUserFacingErrorMessage } from "@/lib/api/errors";

assert.equal(
  getUserFacingErrorMessage(
    new ApiError("Insufficient PTC Credits balance", 422, "insufficient_credits"),
  ),
  "Insufficient PTC Credits balance for this redemption.",
);

assert.equal(
  getUserFacingErrorMessage(new ApiError("Bad credentials", 401, "unauthorized")),
  "Bad credentials",
);

console.log("errors.test.ts: all assertions passed");
