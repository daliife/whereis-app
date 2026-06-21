/**
 * Verifies First Load JS budgets from the last `next build` log.
 * The build script pipes output to .build-output.log.
 */
import fs from "fs";

const LOG_FILE = ".build-output.log";
const SHARED_BUDGET_KB = 120;
const ROUTE_BUDGET_KB = 130;

if (!fs.existsSync(LOG_FILE)) {
  console.error(
    "verify-bundle: .build-output.log not found — run pnpm build first",
  );
  process.exit(1);
}

const output = fs.readFileSync(LOG_FILE, "utf8");

const sharedMatch = output.match(/First Load JS shared by all\s+([\d.]+)\s+kB/);
if (!sharedMatch) {
  console.error("verify-bundle: could not parse shared bundle size");
  process.exit(1);
}

const sharedKb = Number.parseFloat(sharedMatch[1]);
if (sharedKb > SHARED_BUDGET_KB) {
  console.error(
    `verify-bundle: shared First Load JS ${sharedKb} kB exceeds budget ${SHARED_BUDGET_KB} kB`,
  );
  process.exit(1);
}

const routeLines = [
  ...output.matchAll(/[○●]\s+(\S+)\s+([\d.]+)\s+kB\s+([\d.]+)\s+kB/g),
];
const offenders = routeLines.filter(([, , , firstLoad]) => {
  return Number.parseFloat(firstLoad) > ROUTE_BUDGET_KB;
});

if (offenders.length > 0) {
  for (const [, route, , firstLoad] of offenders) {
    console.error(
      `verify-bundle: route ${route} First Load JS ${firstLoad} kB exceeds budget ${ROUTE_BUDGET_KB} kB`,
    );
  }
  process.exit(1);
}

console.log(
  `verify-bundle: OK (shared ${sharedKb} kB ≤ ${SHARED_BUDGET_KB} kB, routes ≤ ${ROUTE_BUDGET_KB} kB)`,
);
