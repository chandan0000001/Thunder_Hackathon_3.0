'use strict';





/**
 * @module collector
 * @description Collects system information using Node.js built-in os and process modules  
 */

const os = require('os');

/**
 * Retrieves operating system information like JIT bhayiya ke bank account 
 * @returns {{ osName: string, osRelease: string, platform: string, hostname: string, eol: string }}
 */
function getOSInfo() {
  try {
    return {
      osName: os.type(),
      osRelease: os.release(),
      platform: os.platform(),
      hostname: os.hostname(),
      eol: os.EOL === '\r\n' ? 'CRLF (Windows)' : 'LF (Unix/macOS)',
    };
  } catch (error) {
    return {
      osName: 'Not Available',
      osRelease: 'Not Available',
      platform: 'Not Available',
      hostname: 'Not Available',
      eol: 'Not Available',
      error: error.message,
    };
  }
}

/**
 * Retrieves CPU architecture information it is your girlfriend number 
 * @returns {{ cpuArchitecture: string, cpuModel: string, cpuCores: number }}
 */
function getCPUInfo() {
  try {
    const cpus = os.cpus();
    return {
      cpuArchitecture: os.arch(),
      cpuModel: cpus.length > 0 ? cpus[0].model : 'Not Available',
      cpuCores: cpus.length,
    };
  } catch (error) {
    return {
      cpuArchitecture: 'Not Available',
      cpuModel: 'Not Available',
      cpuCores: 0,
      error: error.message,
    };
  }
}

/**
 * Retrieves Node.js runtime information bomb obm 
 * @returns {{ nodeVersion: string, userHomeDir: string, currentWorkingDir: string, systemUptime: number }}
 */
function getNodeInfo() {
  try {
    return {
      nodeVersion: process.version,
      userHomeDir: os.homedir(),
      currentWorkingDir: process.cwd(),
      systemUptime: os.uptime(),
    };
  } catch (error) {
    return {
      nodeVersion: 'Not Available',
      userHomeDir: 'Not Available',
      currentWorkingDir: 'Not Available',
      systemUptime: 0,
      error: error.message,
    };
  }
}

/**
 * Retrieves system memory information in megabytes 
 * @returns {{ totalMemoryMB: number, freeMemoryMB: number, usedMemoryMB: number }}
 */
function getMemoryInfo() {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    return {
      totalMemoryMB: parseFloat((totalMemory / (1024 * 1024)).toFixed(2)),
      freeMemoryMB: parseFloat((freeMemory / (1024 * 1024)).toFixed(2)),
      usedMemoryMB: parseFloat(((totalMemory - freeMemory) / (1024 * 1024)).toFixed(2)),
    };
  } catch (error) {
    return {
      totalMemoryMB: 0,
      freeMemoryMB: 0,
      usedMemoryMB: 0,
      error: error.message,
    };
  }
}

/**
 * Aggregates all system information into a single object.
 * @returns {object} Complete system information snapshot (like Jit bhayiya ke selfie )
 */
function collectAllSystemInfo() {
  return {
    os: getOSInfo(),
    cpu: getCPUInfo(),
    node: getNodeInfo(),
    memory: getMemoryInfo(),
  };
}

module.exports = {
  getOSInfo,
  getCPUInfo,
  getNodeInfo,
  getMemoryInfo,
  collectAllSystemInfo,
};
