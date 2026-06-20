# THUNDER HACKATHON 3.0

## ROLE

You are a Senior Node.js Security Engineer.

Your task is to build a  JavaScript project that satisfies the hackathon requirements.

IMPORTANT:

- Do NOT create malware.
- Do NOT perform persistence.
- Do NOT perform privilege escalation.
- Do NOT exfiltrate data.
- Do NOT send collected information over network.
- Do NOT delete arbitrary user files.
- CRUD operations must be restricted to a local demo workspace folder only.

The project should demonstrate information gathering and controlled file operations for educational purposes.

---

# PROJECT GOAL

Create a Node.js CLI application that:

1. Collects system information.
2. Collects selected environment variables.
3. Displays results in formatted JSON.
4. Demonstrates CRUD operations inside a sandbox folder.
5. Includes proper error handling.
6. Includes documentation and architecture explanation.

---

# REQUIRED INFORMATION

Collect:

- Operating System Name
- OS Release
- CPU Architecture
- Hostname
- Node.js Version
- Platform Information
- User Home Directory
- Current Working Directory
- System Uptime
- Total Memory
- Free Memory

Selected Environment Variables:

- USER
- USERNAME
- HOME
- PATH

If any variable is unavailable, display:

"Not Available"

---

# PROJECT STRUCTURE

Generate the following structure:

project-root/

├── src/
│   ├── collector.js
│   ├── envCollector.js
│   ├── fileManager.js
│   ├── formatter.js
│   └── index.js
│
├── workspace/
│   └── sample.txt
│
├── output/
│   └── report.json
│
├── README.md
├── package.json
└── task-flow.md

---

# IMPLEMENTATION DETAILS

## collector.js

Create functions:

- getOSInfo()
- getCPUInfo()
- getNodeInfo()
- getMemoryInfo()

Use Node.js built-in:

- os module
- process module

Return structured objects.

---

## envCollector.js

Collect selected environment variables.

Return:

{
  USER: "...",
  USERNAME: "...",
  HOME: "...",
  PATH: "..."
}

Handle missing values safely.

---

## fileManager.js

Create a sandbox CRUD system.

Allowed folder:

workspace/

Implement:

### Create

createFile()

Creates:

workspace/sample.txt

### Read

readFile()

Reads sample.txt

### Update

updateFile()

Appends timestamp

### Delete

deleteDemoFile()

Deletes only:

workspace/temp.txt

Never delete arbitrary files.

---

## formatter.js

Generate:

1. Pretty console output
2. JSON report

Save JSON to:

output/report.json

Use:

JSON.stringify(data, null, 2)

---

## index.js

Main controller.

Execution flow:

1. Gather system information
2. Gather environment variables
3. Execute CRUD demo
4. Generate report
5. Save report.json
6. Print success message

---

# OUTPUT FORMAT

Example:

{
  "timestamp": "...",
  "system": {
      ...
  },
  "environment": {
      ...
  },
  "crudDemo": {
      ...
  }
}

---

# ERROR HANDLING

Implement:

- try/catch everywhere appropriate
- file existence checks
- directory existence checks
- graceful failure messages

Never crash unexpectedly.

---

# CODE QUALITY

Requirements:

- Modern JavaScript
- Async/Await
- Modular design
- Meaningful variable names
- JSDoc comments
- Clean folder separation

---

# README REQUIREMENTS

Generate a professional README containing:

## Project Overview

Explain purpose.

## Features

List all features.

## Architecture

Explain every module.

## Execution Flow

Step-by-step flow diagram.

## Installation

npm install

## Run

node src/index.js

## Sample Output

Include example JSON.

## Security Notes

Explain:

- No data transmission
- No malware functionality
- Educational project only
- CRUD restricted to workspace folder

---

# task-flow.md

Create a detailed flow:

START

↓

Collect System Info

↓

Collect Environment Variables

↓

Perform CRUD Demo

↓

Generate JSON Report

↓

Store report.json

↓

Display Result

↓

END

Use Mermaid diagram too.

---

# BONUS FEATURES

Implement if possible:

1. Colored console output
2. Execution duration measurement
3. Report generation timestamp
4. Summary statistics
5. CLI banner

---

# FINAL GOAL

Produce a complete, runnable, production-quality Node.js project that follows all requirements and can be executed immediately after:

npm install
node src/index.js

Generate all files with full implementation.