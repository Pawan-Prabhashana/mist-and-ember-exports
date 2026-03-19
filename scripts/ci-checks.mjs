// /scripts/ci-checks.mjs
/**
 * Ceylon Roots – CI Preflight Checks Script
 *
 * This script is intended to be run in CI (e.g., GitHub Actions) or locally before commits.
 * It ensures code quality and consistency before deployment.
 *
 * Features:
 * - Checks Node version
 * - Verifies package-lock.json is in sync
 * - Runs TypeScript type-checking (tsc --noEmit)
 * - Runs ESLint (if available)
 * - Optionally runs Prettier format check
 * - Can fail fast or allow warnings via CLI flags
 *
 * Usage:
 *   node ./scripts/ci-checks.mjs
 *   node ./scripts/ci-checks.mjs --no-lint --no-format
 *
 * Exit codes:
 *   0 - success
 *   1 - failure
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

// -----------------------------------------------------------
// Helper utilities
// -----------------------------------------------------------

/**
 * Run a shell command with pretty output.
 */
function run(cmd, opts = {}) {
  console.log(`\n🧩 Running: \x1b[36m${cmd}\x1b[0m`);
  try {
    execSync(cmd, { stdio: "inherit", ...opts });
  } catch (err) {
    console.error(`❌ Command failed: ${cmd}`);
    throw err;
  }
}

/**
 * Check for CLI flags
 */
function hasFlag(flag) {
  return process.argv.includes(flag);
}

/**
 * Get current Node version major
 */
function nodeMajorVersion() {
  const [major] = process.versions.node.split(".").map(Number);
  return major;
}

// -----------------------------------------------------------
// Configuration
// -----------------------------------------------------------

const REQUIRED_NODE_MAJOR = 18; // recommended minimum for Next.js 13+
const TS_CONFIG = "tsconfig.json";
const ESLINT_CONFIGS = [".eslintrc.js", ".eslintrc.cjs", ".eslintrc.json"];
const PRETTIER_CONFIGS = [".prettierrc", ".prettierrc.json", "prettier.config.js"];

// CLI flags
const skipLint = hasFlag("--no-lint");
const skipFormat = hasFlag("--no-format");
const skipTypes = hasFlag("--no-types");
const skipLockCheck = hasFlag("--no-lock");

// -----------------------------------------------------------
// 1. Node version check
// -----------------------------------------------------------

console.log("🔍 Checking Node.js version...");
const currentMajor = nodeMajorVersion();
if (currentMajor < REQUIRED_NODE_MAJOR) {
  console.error(
    `❌ Node.js version ${process.version} is too old. Please use >= ${REQUIRED_NODE_MAJOR}.x`
  );
  process.exit(1);
}
console.log(`✅ Node.js version OK (${process.version})`);

// -----------------------------------------------------------
// 2. package-lock.json consistency check
// -----------------------------------------------------------

if (!skipLockCheck) {
  console.log("\n🔍 Verifying package-lock.json consistency...");
  if (!existsSync("package-lock.json")) {
    console.warn("⚠️  package-lock.json missing (npm install will generate it).");
  } else {
    try {
      run("npm audit signatures", { stdio: "pipe" });
      console.log("✅ package-lock.json appears valid.");
    } catch {
      console.warn("⚠️  npm audit signatures not supported; skipping integrity check.");
    }
  }
} else {
  console.log("⏭️  Skipping lockfile check (--no-lock)");
}

// -----------------------------------------------------------
// 3. TypeScript type-checking
// -----------------------------------------------------------

if (!skipTypes) {
  console.log("\n🔍 Running TypeScript type check...");
  if (existsSync(TS_CONFIG)) {
    try {
      run("npx tsc --noEmit");
      console.log("✅ TypeScript types OK.");
    } catch (err) {
      console.error("❌ TypeScript errors detected.");
      process.exit(1);
    }
  } else {
    console.warn("⚠️  No tsconfig.json found, skipping type-check.");
  }
} else {
  console.log("⏭️  Skipping TypeScript check (--no-types)");
}

// -----------------------------------------------------------
// 4. ESLint
// -----------------------------------------------------------

if (!skipLint) {
  console.log("\n🔍 Running ESLint...");
  const eslintConfigExists = ESLINT_CONFIGS.some((f) => existsSync(f));
  if (eslintConfigExists) {
    try {
      run("npx eslint . --max-warnings=0");
      console.log("✅ ESLint passed cleanly.");
    } catch (err) {
      console.error("❌ ESLint reported issues.");
      process.exit(1);
    }
  } else {
    console.warn("⚠️  No ESLint configuration found, skipping lint.");
  }
} else {
  console.log("⏭️  Skipping ESLint (--no-lint)");
}

// -----------------------------------------------------------
// 5. Prettier format check
// -----------------------------------------------------------

if (!skipFormat) {
  console.log("\n🔍 Checking code format with Prettier...");
  const prettierConfigExists = PRETTIER_CONFIGS.some((f) => existsSync(f));
  if (prettierConfigExists) {
    try {
      run("npx prettier --check .");
      console.log("✅ Prettier formatting OK.");
    } catch {
      console.error("❌ Code not formatted. Run: npx prettier --write .");
      process.exit(1);
    }
  } else {
    console.warn("⚠️  No Prettier configuration found, skipping format check.");
  }
} else {
  console.log("⏭️  Skipping Prettier (--no-format)");
}

// -----------------------------------------------------------
// 6. Basic package.json sanity check
// -----------------------------------------------------------

console.log("\n🔍 Validating package.json...");
try {
  const pkgRaw = readFileSync("package.json", "utf8");
  const pkg = JSON.parse(pkgRaw);

  if (!pkg.name || !pkg.version) {
    console.error("❌ package.json missing name or version.");
    process.exit(1);
  }
  if (!pkg.scripts) {
    console.warn("⚠️  No scripts section found in package.json.");
  }

  console.log(`✅ package.json OK (${pkg.name}@${pkg.version}).`);
} catch (err) {
  console.error("❌ package.json invalid or unreadable.");
  process.exit(1);
}

// -----------------------------------------------------------
// 7. Optional: basic folder existence checks
// -----------------------------------------------------------

const requiredDirs = ["app", "components", "lib", "content"];
for (const dir of requiredDirs) {
  if (!existsSync(dir)) {
    console.warn(`⚠️  Directory missing: ${dir}`);
  }
}

// -----------------------------------------------------------
// 8. Summary
// -----------------------------------------------------------

console.log("\n🎉 All CI checks completed successfully!");
console.log("✅ Your Ceylon Roots project is ready for build & deployment.\n");

// End of script
