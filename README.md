#  Thunder Hackathon 3.0 — System Info Collector

## Project Overview

A production-quality **Node.js CLI application** built for the Thunder Hackathon 3.0.  
It collects system information, selected environment variables, performs sandboxed CRUD file operations, and generates a formatted JSON report — all for **JIT bhayiya OP**.The sample reports are stored in output and their timestamp store in workspace.

---

## Features

| Feature | Description |
|---------|-------------|
| System Info Collection | OS name, release, CPU architecture, hostname, platform, uptime, EOL type, **CPU speed (MHz)** |
| Node.js Info | Node version, home directory, current working directory |
| Memory Info | Total memory, free memory, used memory (in MB) |
| **Network Info** | All interfaces with IPv4, IPv6, MAC address, internal flag |
| **Load Average** | System load over 1min, 5min, 15min (cross-platform) |
| **User Info** | Current OS user: username, UID, GID, shell, homedir |
| **Process Info** | PID, parent PID, heap used/total, RSS, external memory, exec path |
| **Date/Time** | Current time (ISO + local), timezone, UTC offset, locale |
| Battery Info | Battery level (%), charging status, battery health, cycle count (cross-platform) |
| Environment Variables | Required: USER, USERNAME, HOME, PATH + platform-specific vars for Windows/macOS/Linux |
| Cross-Platform | Runs on **Linux**, **macOS**, and **Windows** with platform-adaptive collection |
| Sandbox CRUD | Create, Read, Update, Delete — restricted to `workspace/` only |
| JSON Report | Pretty-printed `output/report.json` via `JSON.stringify(data, null, 2)` |
| Colored Console | ANSI-colored output using `chalk` |
| Execution Timing | Duration measurement from start to finish |
| Summary Statistics | Count of fields collected, CRUD operations, platform detected |
| CLI Banner | Visual banner on startup |
| Error Handling | try/catch everywhere, graceful failure, no unexpected crashes |

---

## Architecture

```
project-root/
├── src/
│   ├── collector.js       # System info: os, cpu, node, memory
│   ├── envCollector.js    # Environment variables: USER, USERNAME, HOME, PATH
│   ├── fileManager.js     # Sandboxed CRUD: create, read, update, delete
│   ├── formatter.js       # Report builder, colored printer, JSON saver
│   └── index.js           # Main controller — orchestrates all modules
├── workspace/
│   └── sample.txt         # Demo file managed by fileManager
├── output/
│   └── report.json        # Generated JSON report
├── README.md
├── package.json
└── task-flow.md
```

### Module Responsibilities

- **`collector.js`** — Uses Node.js `os`, `process`, `fs`, and `child_process` modules. Exposes `getOSInfo()`, `getCPUInfo()`, `getNodeInfo()`, `getMemoryInfo()`, `getNetworkInfo()`, `getLoadInfo()`, `getUserInfo()`, `getProcessInfo()`, `getDateTimeInfo()`, `getBatteryInfo()`, and `collectAllSystemInfo()`. All collectors are **100% cross-platform** (Linux/macOS/Windows) using pure Node.js built-in APIs.
- **`envCollector.js`** — Reads `process.env` for USER, USERNAME, HOME, PATH. Also collects **platform-specific** variables: USERPROFILE/COMPUTERNAME on Windows, SHELL/LOGNAME/TMPDIR on macOS, SHELL/DISPLAY/XDG_SESSION_TYPE on Linux. Returns `"Not Available"` for missing values.
- **`fileManager.js`** — Async CRUD operations restricted to `workspace/`. `createFile()`, `readFile()`, `updateFile()`, `deleteDemoFile()` (only deletes `workspace/temp.txt`, never arbitrary files).
- **`formatter.js`** — Builds the report object, prints colored sections to console, saves `output/report.json`.
- **`index.js`** — Main entry point. Sequentially calls all modules, measures execution time, handles fatal errors.

---

## Execution Flow

```
START
  ↓
Print CLI Banner
  ↓
[1/5] Collect System Information (collector.js)
  ↓
[2/5] Collect Environment Variables (envCollector.js)
  ↓
[3/5] Run CRUD Demo in workspace/ (fileManager.js)
  ↓
[4/5] Build JSON Report (formatter.js)
  ↓
[5/5] Save output/report.json
  ↓
Print Report + Summary to Console
  ↓
END
```

See `task-flow.md` for a Mermaid diagram.

---

## Prerequisites

You need **Node.js v14 or higher** installed on your device.

| Platform | How to install Node.js |
|----------|----------------------|
| **Linux** | `sudo apt install nodejs npm` (Debian/Ubuntu) or `sudo dnf install nodejs npm` (Fedora) |
| **macOS** | Download from [nodejs.org](https://nodejs.org) or use `brew install node` |
| **Windows** | Download from [nodejs.org](https://nodejs.org) or use `winget install OpenJS.NodeJS` |

---

## Installation

Open a terminal (or Command Prompt / PowerShell on Windows) and run:

```bash
# Step 1: Navigate to the Hackathon project folder  [Folder  khud create karro ye bhi batna padyega  ? LOL Folder pe jake git init karna ok ]
cd /path/to/Hackathon  

git clone https://github.com/chandan0000001/Thunder_Hackathon_3.0

# Step 2: Install the only dependency (chalk)
npm install
```

---

## Run

```bash
node src/index.js
```


```
Igone THIS OK 
I am USING FEDORA so my ->
cd ~/Desktop/codePlayground/Hackathon
npm install
node src/index.js
```

Or via npm script:

```bash
npm start
```

### Platform-specific notes:

| Platform | Terminal | Command |
|----------|----------|----------|
| **Linux** | Any terminal | `node src/index.js` |
| **macOS** | Terminal.app / iTerm | `node src/index.js` |
| **Windows** | PowerShell / Windows Terminal | `node src/index.js` |
| **Windows** | cmd.exe | `node src\index.js` (backslash also works) |

> **Tip:** On Windows, use **Windows Terminal** or **PowerShell 7+** for best Unicode/emoji rendering in the CLI banner.

---

## Sample Output

```json
{
  "timestamp": "2026-06-21T03:36:07.000Z",
  "system": {
    "os": {
      "osName": "Linux",
      "osRelease": "7.0.12-101.fc43.x86_64",
      "platform": "linux",
      "hostname": "fedora",
      "eol": "LF (Unix/macOS)"
    },
    "cpu": {
      "cpuArchitecture": "x64",
      "cpuModel": "13th Gen Intel(R) Core(TM) i5-1334U",
      "cpuCores": 12,
      "cpuSpeedMHz": 3780
    },
    "node": {
      "nodeVersion": "v24.16.0",
      "userHomeDir": "/home/chanadan",
      "currentWorkingDir": "/path/to/Hackathon",
      "systemUptime": 15938
    },
    "memory": {
      "totalMemoryMB": 15622.95,
      "freeMemoryMB": 7647.36,
      "usedMemoryMB": 7975.59
    },
    "network": {
      "lo": { "ipv4": "127.0.0.1", "ipv6": "::1", "mac": "00:00:00:00:00:00", "internal": "Yes" },
      "wlo1": { "ipv4": "10.34.167.86", "ipv6": "2409:4062:...", "mac": "46:f9:84:fc:aa:ed", "internal": "No" },
      "totalAddresses": 6
    },
    "load": { "loadAvg1min": 1.89, "loadAvg5min": 1.42, "loadAvg15min": 0.77 },
    "user": { "username": "chanadan", "uid": 1000, "gid": 1000, "shell": "/bin/bash", "homedir": "/home/chanadan" },
    "processInfo": {
      "pid": 8552,
      "ppid": 8295,
      "heapUsedMB": 4.93,
      "heapTotalMB": 7.2,
      "rssMB": 51.31,
      "externalMB": 1.85,
      "nodeExecPath": "/home/chanadan/.nvm/versions/node/v24.16.0/bin/node"
    },
    "dateTime": {
      "currentDateTime": "2026-06-21T03:36:07.292Z",
      "localTime": "6/21/2026, 9:06:07 AM",
      "timezone": "Asia/Calcutta",
      "utcOffset": "UTC+05:30",
      "locale": "en-US"
    },
    "battery": {
      "batteryLevel": 94,
      "batteryStatus": "Discharging",
      "batteryHealth": "Not Available",
      "cycleCount": 46,
      "isCharging": "No"
    }
  },
  "environment": {
    "required": {
      "USER": "chanadan",
      "USERNAME": "Not Available",
      "HOME": "/home/chanadan",
      "PATH": "/usr/local/bin:/usr/bin:/bin"
    },
    "platformSpecific": {
      "platformDetected": "Linux",
      "SHELL": "/bin/bash",
      "LANG": "en_US.UTF-8",
      "TERM": "xterm-256color",
      "DISPLAY": ":0",
      "XDG_SESSION_TYPE": "wayland"
    }
  },
  "crudDemo": {
    "create": { "success": true, "file": "...", "message": "sample.txt created successfully." },
    "read":   { "success": true, "file": "...", "message": "sample.txt read successfully." },
    "update": { "success": true, "file": "...", "message": "sample.txt updated successfully." },
    "delete": { "success": true, "file": "...", "message": "temp.txt deleted successfully." }
  },
  "summary": {
    "totalSystemFields": 43,
    "totalEnvVariables": 9,
    "platformDetected": "Linux",
    "crudOperationsCompleted": 5,
    "executionDurationMs": 42
  }
}
```

### What changes on each platform:

| Field | Linux | macOS | Windows |
|-------|-------|-------|----------|
| `os.osName` | `Linux` | `Darwin` | `Windows_NT` |
| `os.eol` | `LF (Unix/macOS)` | `LF (Unix/macOS)` | `CRLF (Windows)` |
| `cpu.cpuSpeedMHz` | `os.cpus()[0].speed` | `os.cpus()[0].speed` | `os.cpus()[0].speed` |
| `network` | `os.networkInterfaces()` | `os.networkInterfaces()` | `os.networkInterfaces()` |
| `load` | `os.loadavg()` | `os.loadavg()` | `os.loadavg()` |
| `user.shell` | `/bin/bash` | `/bin/zsh` | `null` |
| `processInfo` | `process.memoryUsage()` | `process.memoryUsage()` | `process.memoryUsage()` |
| `dateTime.timezone` | `Asia/Calcutta` | `America/Los_Angeles` | `America/New_York` |
| `env.required.USER` | `"user"` | `"user"` | `"Not Available"` |
| `env.required.USERNAME` | `"Not Available"` | `"Not Available"` | `"user"` |
| `env.required.HOME` | `/home/user` | `/Users/user` | `"Not Available"` |
| `env.platformSpecific` | SHELL, LANG, TERM, DISPLAY | SHELL, LOGNAME, TERM, LANG, TMPDIR | USERPROFILE, COMPUTERNAME, SYSTEMROOT, APPDATA |
| `battery.source` | sysfs + `pmset` | `pmset` + `system_profiler` | `WMIC` + PowerShell |

---

## Security Notes

- **No data transmission** — All information stays on the local machine. Nothing is sent over the network.
- **No malware functionality** — No persistence, no privilege escalation, no data exfiltration.
- **Educational project only** — Built to demonstrate Node.js system APIs and modular CLI design.
- **CRUD restricted to `workspace/`** — File operations are sandboxed. `deleteDemoFile()` only removes `workspace/temp.txt`. Arbitrary file deletion is never performed.
- **No arbitrary file deletion** — The application never accepts user-supplied paths for deletion.

---

## License

MIT
# Thunder_Hackathon_3.0 By CHANDAN
