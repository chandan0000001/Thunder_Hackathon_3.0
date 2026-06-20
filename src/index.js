'use strict';
//JIT Bhyiya appp hamse gaadarii karr rahee hoo 
/**
 * @module index
 * @description Main controller — orchestrates system info collection, env variable gathering,
 *              CRUD demo, report generation, and file saving.
 *
 * Execution Flow:
 *   1. Gather system information
 *   2. Gather environment variables
 *   3. Execute CRUD demo
 *   4. Generate report
 *   5. Save report.json
 *   6. Print success message
 */

const { collectAllSystemInfo } = require('./collector');
const { collectEnvVariables } = require('./envCollector');
const { runCrudDemo } = require('./fileManager');
const { printBanner, buildReport, printReport, saveReport } = require('./formatter');
const chalk = require('chalk');

/**
 * Main entry point for the application.
 * @returns {Promise<void>}
 */
async function main() {
  const startTime = Date.now();

  try {
    // ── Step 0: Print CLI banner ──────────────────────────────────────────────
    printBanner();
    console.log(chalk.dim('  Starting information collection...'));

    // ── Step 1: Gather system information ─────────────────────────────────────
    console.log(chalk.cyan('\n  [1/5] Collecting system information...'));
    const systemInfo = collectAllSystemInfo();

    // ── Step 2: Gather environment variables ──────────────────────────────────
    console.log(chalk.cyan('  [2/5] Collecting environment variables...'));
    const envInfo = collectEnvVariables();

    // ── Step 3: Execute CRUD demo ─────────────────────────────────────────────
    console.log(chalk.cyan('  [3/5] Running CRUD demo in workspace/...'));
    const crudResult = await runCrudDemo();

    // ── Step 4: Generate report ───────────────────────────────────────────────
    const durationMs = Date.now() - startTime;
    console.log(chalk.cyan('  [4/5] Generating JSON report...'));
    const report = buildReport(systemInfo, envInfo, crudResult, durationMs);

    // ── Step 5: Save report.json ──────────────────────────────────────────────
    console.log(chalk.cyan('  [5/5] Saving report to output/report.json...'));
    const saveResult = await saveReport(report);

    // ── Step 6: Print full report to console ──────────────────────────────────
    printReport(report);

    if (saveResult.success) {
      console.log(chalk.green.bold(`   ${saveResult.message}`));
    } else {
      console.log(chalk.red.bold(`   ${saveResult.message}`));
    }

    console.log(chalk.green.bold(`\n   Completed in ${durationMs}ms\n`));
  } catch (error) {
    console.error(chalk.red.bold('\n  ✗ Fatal error occurred:'));
    console.error(chalk.red(`    ${error.message}`));
    console.error(chalk.dim(`    Stack: ${error.stack}`));
    process.exitCode = 1;
  }
}

// Execute
main();
