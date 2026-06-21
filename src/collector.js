'use strict';





/**
 * @module collector
 * @description Collects system information using Node.js built-in os and process modules  
 */

const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

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
      cpuSpeedMHz: cpus.length > 0 ? cpus[0].speed : 'Not Available',
    };
  } catch (error) {
    return {
      cpuArchitecture: 'Not Available',
      cpuModel: 'Not Available',
      cpuCores: 0,
      cpuSpeedMHz: 'Not Available',
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
 * Retrieves network interface information — IPs, MAC addresses, internal/external.
 * @returns {object[]} Array of interface objects with name, family, address, mac, internal.
 */
function getNetworkInfo() {
  try {
    const interfaces = os.networkInterfaces();
    const result = {};
    let totalCount = 0;
    for (const [name, addrs] of Object.entries(interfaces)) {
      const ipv4 = addrs.find((a) => a.family === 'IPv4');
      const ipv6 = addrs.find((a) => a.family === 'IPv6' && !a.scopeid);
      result[name] = {
        ipv4: ipv4 ? ipv4.address : 'None',
        ipv6: ipv6 ? ipv6.address : 'None',
        mac: ipv4 ? ipv4.mac : (ipv6 ? ipv6.mac : 'Not Available'),
        internal: (ipv4 || ipv6)?.internal ? 'Yes' : 'No',
      };
      totalCount += addrs.length;
    }
    result.totalAddresses = totalCount;
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Retrieves system load average (1min, 5min, 15min).
 * @returns {{ loadAvg1min: number, loadAvg5min: number, loadAvg15min: number }}
 */
function getLoadInfo() {
  try {
    const loadAvg = os.loadavg();
    return {
      loadAvg1min: parseFloat(loadAvg[0].toFixed(2)),
      loadAvg5min: parseFloat(loadAvg[1].toFixed(2)),
      loadAvg15min: parseFloat(loadAvg[2].toFixed(2)),
    };
  } catch (error) {
    return {
      loadAvg1min: 0,
      loadAvg5min: 0,
      loadAvg15min: 0,
      error: error.message,
    };
  }
}

/**
 * Retrieves current OS user information.
 * @returns {{ username: string, uid: number, gid: number, shell: string, homedir: string }}
 */
function getUserInfo() {
  try {
    const info = os.userInfo();
    return {
      username: info.username,
      uid: info.uid,
      gid: info.gid,
      shell: info.shell || 'Not Available',
      homedir: info.homedir,
    };
  } catch (error) {
    return {
      username: 'Not Available',
      uid: 'Not Available',
      gid: 'Not Available',
      shell: 'Not Available',
      homedir: 'Not Available',
      error: error.message,
    };
  }
}

/**
 * Retrieves current Node.js process information — PID, memory usage.
 * @returns {object} Process details including PID and heap memory stats.
 */
function getProcessInfo() {
  try {
    const mem = process.memoryUsage();
    return {
      pid: process.pid,
      ppid: process.ppid,
      heapUsedMB: parseFloat((mem.heapUsed / (1024 * 1024)).toFixed(2)),
      heapTotalMB: parseFloat((mem.heapTotal / (1024 * 1024)).toFixed(2)),
      rssMB: parseFloat((mem.rss / (1024 * 1024)).toFixed(2)),
      externalMB: parseFloat((mem.external / (1024 * 1024)).toFixed(2)),
      nodeExecPath: process.execPath,
    };
  } catch (error) {
    return {
      pid: 'Not Available',
      ppid: 'Not Available',
      heapUsedMB: 0,
      heapTotalMB: 0,
      rssMB: 0,
      externalMB: 0,
      nodeExecPath: 'Not Available',
      error: error.message,
    };
  }
}

/**
 * Retrieves current date, time, timezone name, and UTC offset.
 * @returns {object} Date and timezone information.
 */
function getDateTimeInfo() {
  try {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(utcOffset) / 60);
    const offsetMins = Math.abs(utcOffset) % 60;
    const sign = utcOffset >= 0 ? '+' : '-';
    const offsetString = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

    return {
      currentDateTime: now.toISOString(),
      localTime: now.toLocaleString(),
      timezone,
      utcOffset: offsetString,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
    };
  } catch (error) {
    return {
      currentDateTime: new Date().toISOString(),
      localTime: 'Not Available',
      timezone: 'Not Available',
      utcOffset: 'Not Available',
      locale: 'Not Available',
      error: error.message,
    };
  }
}

/**
 * Retrieves battery information using platform-specific methods.
 * - Linux: reads from /sys/class/power_supply/BAT{0,1,...}
 * - macOS: parses output of pmset -g batt
 * - Windows: parses output of WMIC Path Win32_Battery
 *
 * @returns {{ batteryLevel: string|number, batteryStatus: string, isCharging: string }}
 */
function getBatteryInfo() {
  const platform = os.platform();

  try {
    if (platform === 'linux') {
      return getBatteryLinux();
    } else if (platform === 'darwin') {
      return getBatteryMacOS();
    } else if (platform === 'win32') {
      return getBatteryWindows();
    }
    return {
      batteryLevel: 'Not Available',
      batteryStatus: 'Platform not supported',
      isCharging: 'Not Available',
    };
  } catch (error) {
    return {
      batteryLevel: 'Not Available',
      batteryStatus: 'Not Available',
      isCharging: 'Not Available',
      error: error.message,
    };
  }
}

/**
 * Reads battery info from Linux sysfs (/sys/class/power_supply/BAT*).
 * @returns {{ batteryLevel: number, batteryStatus: string, isCharging: string }}
 */
function getBatteryLinux() {
  const basePath = '/sys/class/power_supply';
  // Find the first BAT directory (BAT0, BAT1, etc.)
  let batteryDir = null;
  try {
    const entries = fs.readdirSync(basePath);
    batteryDir = entries.find((entry) => entry.startsWith('BAT'));
  } catch {
    return {
      batteryLevel: 'Not Available',
      batteryStatus: 'No battery detected',
      isCharging: 'Not Available',
    };
  }

  if (!batteryDir) {
    return {
      batteryLevel: 'Not Available',
      batteryStatus: 'No battery detected',
      isCharging: 'Not Available',
    };
  }

  const fullPath = `${basePath}/${batteryDir}`;

  // Read capacity (percentage)
  let level = 'Not Available';
  try {
    level = parseInt(fs.readFileSync(`${fullPath}/capacity`, 'utf-8').trim(), 10);
  } catch { /* capacity file not found */ }

  // Read status (Charging, Discharging, Full, etc.)
  let status = 'Not Available';
  try {
    status = fs.readFileSync(`${fullPath}/status`, 'utf-8').trim();
  } catch { /* status file not found */ }

  // Read health (charge_full / charge_full_design) if available
  let health = 'Not Available';
  try {
    const chargeFull = parseInt(fs.readFileSync(`${fullPath}/charge_full`, 'utf-8').trim(), 10);
    const chargeDesign = parseInt(fs.readFileSync(`${fullPath}/charge_full_design`, 'utf-8').trim(), 10);
    if (chargeDesign > 0) {
      health = `${((chargeFull / chargeDesign) * 100).toFixed(1)}%`;
    }
  } catch { /* health files may not exist on all systems */ }

  // Read cycle count if available
  let cycleCount = 'Not Available';
  try {
    cycleCount = parseInt(fs.readFileSync(`${fullPath}/cycle_count`, 'utf-8').trim(), 10);
  } catch { /* cycle_count file may not exist */ }

  const isCharging = status === 'Charging' ? 'Yes' : status === 'Discharging' ? 'No' : status;

  return {
    batteryLevel: level,
    batteryStatus: status,
    batteryHealth: health,
    cycleCount,
    isCharging,
  };
}

/**
 * Reads battery info from macOS using pmset and system_profiler commands.
 * system_profiler SPPowerDataType provides battery health, cycle count, and max capacity.
 * @returns {{ batteryLevel: number|string, batteryStatus: string, batteryHealth: string, isCharging: string }}
 */
function getBatteryMacOS() {
  let level = 'Not Available';
  let status = 'Not Available';
  let isCharging = 'Not Available';
  let health = 'Not Available';
  let cycleCount = 'Not Available';
  let maxCapacity = 'Not Available';
  let designCapacity = 'Not Available';

  // Step 1: Get current level and charging status from pmset
  try {
    const pmsetOutput = execSync('pmset -g batt', { encoding: 'utf-8', timeout: 5000 });
    const percentMatch = pmsetOutput.match(/(\d+)%/);
    level = percentMatch ? parseInt(percentMatch[1], 10) : 'Not Available';

    if (/discharging/i.test(pmsetOutput)) {
      status = 'Discharging';
      isCharging = 'No';
    } else if (/charging/i.test(pmsetOutput) && !/charged/i.test(pmsetOutput)) {
      status = 'Charging';
      isCharging = 'Yes';
    } else if (/charged/i.test(pmsetOutput) || /AC attached/i.test(pmsetOutput)) {
      status = 'Fully Charged';
      isCharging = 'Yes';
    }
  } catch { /* pmset failed */ }

  // Step 2: Get health info from system_profiler
  try {
    const profilerOutput = execSync('system_profiler SPPowerDataType 2>/dev/null', { encoding: 'utf-8', timeout: 10000 });

    // Cycle Count
    const cycleMatch = profilerOutput.match(/Cycle Count:\s*(\d+)/i);
    cycleCount = cycleMatch ? parseInt(cycleMatch[1], 10) : 'Not Available';

    // Condition (Normal, Service Recommended, etc.)
    const conditionMatch = profilerOutput.match(/Condition:\s*(.+)/i);
    const condition = conditionMatch ? conditionMatch[1].trim() : 'Not Available';

    // Maximum Capacity (health percentage on newer macOS)
    const maxCapMatch = profilerOutput.match(/Maximum Capacity:\s*(\d+)%/i);
    if (maxCapMatch) {
      maxCapacity = `${maxCapMatch[1]}%`;
      health = maxCapacity; // Maximum Capacity IS the health percentage
    }

    // Fallback: Calculate from Full Charge Capacity / Design Capacity
    if (health === 'Not Available') {
      const fullChargeMatch = profilerOutput.match(/Full Charge Capacity:\s*(\d+)\s*mAh/i);
      const designCapMatch = profilerOutput.match(/Design Capacity:\s*(\d+)\s*mAh/i);
      if (fullChargeMatch && designCapMatch) {
        const fullCharge = parseInt(fullChargeMatch[1], 10);
        const designCap = parseInt(designCapMatch[1], 10);
        if (designCap > 0) {
          health = `${((fullCharge / designCap) * 100).toFixed(1)}%`;
        }
      }
    }

    // If still no health, use condition as fallback
    if (health === 'Not Available' && condition !== 'Not Available') {
      health = condition;
    }
  } catch { /* system_profiler failed (desktop Mac or no battery) */ }

  return {
    batteryLevel: level,
    batteryStatus: status,
    batteryHealth: health,
    cycleCount,
    maxCapacity,
    isCharging,
  };
}

/**
 * Reads battery info from Windows using WMIC and PowerShell commands.
 * PowerShell is used to calculate health from FullChargeCapacity / DesignCapacity.
 * @returns {{ batteryLevel: number|string, batteryStatus: string, batteryHealth: string, isCharging: string }}
 */
function getBatteryWindows() {
  let level = 'Not Available';
  let status = 'Not Available';
  let isCharging = 'Not Available';
  let health = 'Not Available';
  let cycleCount = 'Not Available';

  // Step 1: Get level and status from WMIC
  try {
    const wmicOutput = execSync(
      'WMIC Path Win32_Battery Get EstimatedChargeRemaining,BatteryStatus /Format:List',
      { encoding: 'utf-8', timeout: 5000 }
    );

    const percentMatch = wmicOutput.match(/EstimatedChargeRemaining=(\d+)/);
    level = percentMatch ? parseInt(percentMatch[1], 10) : 'Not Available';

    const statusMatch = wmicOutput.match(/BatteryStatus=(\d+)/);
    const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : 0;
    const statusMap = {
      1: 'Discharging',
      2: 'AC Connected',
      3: 'Fully Charged',
      4: 'Low',
      5: 'Critical',
    };
    status = statusMap[statusCode] || 'Not Available';
    isCharging = statusCode === 2 || statusCode === 3 ? 'Yes' : 'No';
  } catch { /* WMIC failed */ }

  // Step 2: Get health via PowerShell — FullChargeCapacity / DesignCapacity
  try {
    const psCommand = 'powershell -Command "Get-WmiObject -Namespace root\\WMI -Class BatteryFullChargedCapacity | Select-Object -ExpandProperty FullChargedCapacity; Get-WmiObject -Namespace root\\WMI -Class BatteryStaticData | Select-Object -ExpandProperty DesignedCapacity"';
    const psOutput = execSync(psCommand, { encoding: 'utf-8', timeout: 10000 });
    const values = psOutput.trim().split(/\r?\n/).filter((v) => v.trim() !== '');
    if (values.length >= 2) {
      const fullCharge = parseInt(values[0].trim(), 10);
      const designCap = parseInt(values[1].trim(), 10);
      if (designCap > 0 && !isNaN(fullCharge)) {
        health = `${((fullCharge / designCap) * 100).toFixed(1)}%`;
      }
    }
  } catch {
    // Fallback: try powercfg /batteryreport and parse the HTML
    try {
      const tmpReport = require('path').join(require('os').tmpdir(), 'battery-report.html');
      execSync(`powercfg /batteryreport /output "${tmpReport}"`, { encoding: 'utf-8', timeout: 10000 });
      const html = fs.readFileSync(tmpReport, 'utf-8');
      const designMatch = html.match(/DESIGN CAPACITY<\/td>\s*<td>(\d[\d,]*)\s*mWh/i);
      const fullMatch = html.match(/FULL CHARGE CAPACITY<\/td>\s*<td>(\d[\d,]*)\s*mWh/i);
      if (designMatch && fullMatch) {
        const designCap = parseInt(designMatch[1].replace(/,/g, ''), 10);
        const fullCharge = parseInt(fullMatch[1].replace(/,/g, ''), 10);
        if (designCap > 0) {
          health = `${((fullCharge / designCap) * 100).toFixed(1)}%`;
        }
      }
      // Cycle count from the report
      const cycleMatch = html.match(/CYCLE COUNT<\/td>\s*<td>(\d+)/i);
      if (cycleMatch) cycleCount = parseInt(cycleMatch[1], 10);
    } catch { /* powercfg also failed */ }
  }

  return {
    batteryLevel: level,
    batteryStatus: status,
    batteryHealth: health,
    cycleCount,
    isCharging,
  };
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
    network: getNetworkInfo(),
    load: getLoadInfo(),
    user: getUserInfo(),
    processInfo: getProcessInfo(),
    dateTime: getDateTimeInfo(),
    battery: getBatteryInfo(),
  };
}

module.exports = {
  getOSInfo,
  getCPUInfo,
  getNodeInfo,
  getMemoryInfo,
  getNetworkInfo,
  getLoadInfo,
  getUserInfo,
  getProcessInfo,
  getDateTimeInfo,
  getBatteryInfo,
  collectAllSystemInfo,
};
