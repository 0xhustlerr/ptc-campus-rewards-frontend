/**
 * Run with: npx tsx src/lib/__tests__/role-helpers.test.ts
 */

import assert from "node:assert/strict";

import { ROLE_DASHBOARD_PATHS } from "@/lib/constants";
import { canAccessRoute, getSafeRedirectPath } from "@/lib/role-helpers";

assert.equal(canAccessRoute("admin", "/vendor/scanner"), false);
assert.equal(canAccessRoute("admin", "/staff/rewards"), false);
assert.equal(canAccessRoute("admin", "/admin"), true);
assert.equal(canAccessRoute("vendor", "/vendor/scanner"), true);
assert.equal(canAccessRoute("staff", "/staff/rewards"), true);

assert.equal(getSafeRedirectPath("admin", "/vendor/scanner"), ROLE_DASHBOARD_PATHS.admin);
assert.equal(getSafeRedirectPath("admin", "/admin/approvals"), "/admin/approvals");
assert.equal(getSafeRedirectPath("vendor", "/vendor/scanner"), "/vendor/scanner");
assert.equal(getSafeRedirectPath("staff", "/vendor/scanner"), ROLE_DASHBOARD_PATHS.staff);

console.log("role-helpers.test.ts: all assertions passed");
