'use strict';

/**
 * @module envCollector
 * @description Collects selected environment variables safely, returning "Not Available" for any missing values.
 *              Supports Linux, macOS, and Windows by collecting both the standard required variables
 *              and platform-specific alternatives
 * Me insan nahii  HUMAN CHANDAN HU 
 */

const os = require('os');

/**
 * Safely retrieves an environment variable value.
 * @param {string} key - The environment variable name.
 * @returns {string} The value or "Not Available" if undefined.
 */
function getEnvVar(key) {
  try {
    const value = process.env[key];
    return value !== undefined && value !== '' ? value : 'Not Available';
  } catch {
    return 'Not Available';
  }
}

/**
 * Returns the platform-specific environment variable mappings.
 * These supplement the four required variables (USER, USERNAME, HOME, PATH)
 * with OS-native alternatives.
 * @returns {object} Platform-specific env var key-value pairs.
 */
function getPlatformSpecificVars() {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows-specific environment variables i hate WINDOWS 
    return {
      platformDetected: 'Windows',
      USERPROFILE: getEnvVar('USERPROFILE'),
      COMPUTERNAME: getEnvVar('COMPUTERNAME'),
      SYSTEMROOT: getEnvVar('SYSTEMROOT'),
      APPDATA: getEnvVar('APPDATA'),
      LOGONSERVER: getEnvVar('LOGONSERVER'),
    };
  } else if (platform === 'darwin') {
    // macOS-specific environment variables
    return {
      platformDetected: 'macOS',
      SHELL: getEnvVar('SHELL'),
      LOGNAME: getEnvVar('LOGNAME'),
      TERM: getEnvVar('TERM'),
      LANG: getEnvVar('LANG'),
      TMPDIR: getEnvVar('TMPDIR'),
    };
  } else {
    // Linux and other Unix-like systems as a fedora user i using it ( my brain already boom)
    return {
      platformDetected: platform === 'linux' ? 'Linux' : platform,
      SHELL: getEnvVar('SHELL'),
      LANG: getEnvVar('LANG'),
      TERM: getEnvVar('TERM'),
      DISPLAY: getEnvVar('DISPLAY'),
      XDG_SESSION_TYPE: getEnvVar('XDG_SESSION_TYPE'),
    };
  }
}

/**
 * Collects the required environment variables: USER, USERNAME, HOME, PATH.
 * Also collects platform-specific supplementary variables for Windows, macOS, and Linux.
 * @returns {{ required: object, platformSpecific: object }}
 */
function collectEnvVariables() {
  try {
    const required = {
      USER: getEnvVar('USER'),
      USERNAME: getEnvVar('USERNAME'),
      HOME: getEnvVar('HOME'),
      PATH: getEnvVar('PATH'),
    };

    const platformSpecific = getPlatformSpecificVars();

    return {
      required,
      platformSpecific,
    };
  } catch (error) {
    return {
      required: {
        USER: 'Not Available',
        USERNAME: 'Not Available',
        HOME: 'Not Available',
        PATH: 'Not Available',
      },
      platformSpecific: {
        platformDetected: 'Unknown',
        error: error.message,
      },
    };
  }
}

module.exports = {
  getEnvVar,
  getPlatformSpecificVars,
  collectEnvVariables,
};
