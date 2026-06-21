'use strict';

/**
 * @module formatter
 * @description ..
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { getNextFilePath } = require('./fileManager');

/** @constant {string} OUTPUT_DIR - Absolute path to the output directory. */
const OUTPUT_DIR = path.resolve(__dirname, '..', 'output');

/**

 * @returns {Promise<string>} Absolute path for the next report file.
 */
async function getNextReportPath() {
  const { filePath } = await getNextFilePath(OUTPUT_DIR, 'report', '.json');
  return filePath;
}

/**
 * Prints a colored CLI banner.
 * @returns {void}
 */
function printBanner() {
  console.log('');
  console.log(chalk.cyan.bold('╔══════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║') + chalk.white.bold('    THUNDER HACKATHON 3.0 — System Info Collector  ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('╚══════════════════════════════════════════════════════╝'));
  console.log('');
}

/**
 * Prints a section header in color.
 * @param {string} title - Section title.
 * @returns {void}
 */
function printSection(title) {
  console.log('');
  console.log(chalk.yellow.bold(`── ${title} ${'─'.repeat(Math.max(0, 50 - title.length))}`));
}

/**
 * Prints a key-value pair with color.
 * @param {string} key
 * @param {*} value
 * @returns {void}
 */
function printKeyValue(key, value) {
  const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  console.log(`  ${chalk.green(key)}: ${chalk.white(displayValue)}`);
}

/**
 * Prints a nested object section.
 * @param {string} title
 * @param {object} data
 * @returns {void}
 */
function printObject(title, data) {
  printSection(title);
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      // Handle arrays: print count and first few items
      printKeyValue(key, `${value.length} item(s)`);
      const preview = value.slice(0, 4);
      for (let i = 0; i < preview.length; i++) {
        const item = preview[i];
        const itemStr = typeof item === 'object' ? JSON.stringify(item) : String(item);
        console.log(`    ${chalk.dim('-')} [${i}] ${chalk.white(itemStr)}`);
      }
      if (value.length > 4) {
        console.log(`    ${chalk.dim(`... and ${value.length - 4} more`)}`);
      }
    } else if (typeof value === 'object' && value !== null) {
      printKeyValue(key, '');
      for (const [subKey, subValue] of Object.entries(value)) {
        if (typeof subValue === 'object' && subValue !== null) {
          console.log(`    ${chalk.dim('-')} ${chalk.green(subKey)}: ${chalk.white(JSON.stringify(subValue))}`);
        } else {
          console.log(`    ${chalk.dim('-')} ${chalk.green(subKey)}: ${chalk.white(String(subValue))}`);
        }
      }
    } else {
      printKeyValue(key, value);
    }
  }
}

/**
 * Builds the complete report object.
 * @param {object} systemInfo - System information from collector.
 * @param {object} envInfo - Environment variables from envCollector (has required + platformSpecific).
 * @param {object} crudResult - CRUD demo results from fileManager.
 * @param {number} durationMs - Execution duration in milliseconds.
 * @returns {object} Complete report object ready for serialization.
 */
function buildReport(systemInfo, envInfo, crudResult, durationMs) {
  // Count env variables: required + platform-specific (excluding meta fields)
  const requiredCount = envInfo.required ? Object.keys(envInfo.required).length : 0;
  const platformVars = envInfo.platformSpecific
    ? Object.keys(envInfo.platformSpecific).filter((k) => k !== 'platformDetected' && k !== 'error').length
    : 0;

  return {
    timestamp: new Date().toISOString(),
    system: systemInfo,
    environment: envInfo,
    crudDemo: crudResult,
    summary: {
      totalSystemFields: Object.keys(flattenObject(systemInfo)).length,
      totalEnvVariables: requiredCount + platformVars,
      platformDetected: envInfo.platformSpecific?.platformDetected || 'Unknown',
      crudOperationsCompleted: Object.keys(crudResult).length,
      executionDurationMs: durationMs,
    },
  };
}

/**
 * Flattens a nested object to a single level for counting fields.
 * @param {object} obj
 * @returns {object}
 */
function flattenObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value));
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Pretty-prints the full report to the console.
 * @param {object} report - The built report object.
 * @returns {void}
 */
function printReport(report) {
  printObject('System Information', report.system);

  // Print required environment variables
  if (report.environment.required) {
    printObject('Environment Variables (Required)', report.environment.required);
  } else {
    printObject('Environment Variables', report.environment);
  }

  // Print platform-specific environment variables
  if (report.environment.platformSpecific) {
    printObject('Environment Variables (Platform-Specific)', report.environment.platformSpecific);
  }

  printSection('CRUD Demo Results');
  for (const [operation, result] of Object.entries(report.crudDemo)) {
    const status = result.success ? chalk.green('✓') : chalk.red('✗');
    console.log(`  ${status} ${chalk.bold(operation.toUpperCase())}: ${result.message}`);
  }
  printSection('Summary Statistics');
  printKeyValue('System fields collected', report.summary.totalSystemFields);
  printKeyValue('Environment variables', report.summary.totalEnvVariables);
  printKeyValue('Platform detected', report.summary.platformDetected);
  printKeyValue('CRUD operations', report.summary.crudOperationsCompleted);
  printKeyValue('Execution duration', `${report.summary.executionDurationMs}ms`);
  console.log('');
}

/**
 * Saves the report as formatted JSON to the next available report file
 * (report.json, report1.json, report2.json, ...).
 * @param {object} report - The report object to save.
 * @returns {Promise<{ success: boolean, path: string, message: string }>}
 */
async function saveReport(report) {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const reportFile = await getNextReportPath();
    const jsonString = JSON.stringify(report, null, 2);
    await fs.writeFile(reportFile, jsonString, 'utf-8');
    const fileName = path.basename(reportFile);
    return { success: true, path: reportFile, message: `Report saved to ${reportFile}` };
  } catch (error) {
    return { success: false, path: OUTPUT_DIR, message: `Save failed: ${error.message}` };
  }
}

module.exports = {
  printBanner,
  printObject,
  buildReport,
  printReport,
  saveReport,
  getNextReportPath,
  OUTPUT_DIR,
};
