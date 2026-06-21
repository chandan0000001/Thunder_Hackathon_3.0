'use strict';

/**
 * @module fileShell
 * @description Interactive cross-platform file manager shell using Node.js fs APIs.
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function parseArgs(input) {
  const args = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;

  while ((match = pattern.exec(input)) !== null) {
    args.push(match[1] ?? match[2] ?? match[3]);
  }

  return args;
}

function resolveTarget(target = '.') {
  return path.resolve(process.cwd(), target);
}

function printShellHelp() {
  console.log('');
  console.log(chalk.yellow.bold('File Manager Shell Commands'));
  console.log('  help                         Show commands');
  console.log('  pwd                          Print current directory');
  console.log('  cd <dir>                     Change directory');
  console.log('  ls [dir]                     List files and folders');
  console.log('  mkdir <dir>                  Create a directory');
  console.log('  create <file> [content]      Create a new file');
  console.log('  read <file>                  Read a file');
  console.log('  update <file> <content>      Append content to a file');
  console.log('  write <file> <content>       Overwrite a file');
  console.log('  delete <file>                Delete a file after confirmation');
  console.log('  rename <from> <to>           Rename or move a file');
  console.log('  exit                         Leave the shell');
  console.log('');
}

async function listDirectory(target = '.') {
  const dirPath = resolveTarget(target);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  if (entries.length === 0) {
    console.log(chalk.dim('  Directory is empty.'));
    return;
  }

  for (const entry of entries) {
    const marker = entry.isDirectory() ? '/' : '';
    console.log(`  ${entry.name}${marker}`);
  }
}

async function changeDirectory(target) {
  if (!target) {
    console.log(chalk.red('  Usage: cd <dir>'));
    return;
  }

  const dirPath = resolveTarget(target);
  const stat = await fs.stat(dirPath);

  if (!stat.isDirectory()) {
    console.log(chalk.red(`  Not a directory: ${dirPath}`));
    return;
  }

  process.chdir(dirPath);
  console.log(chalk.green(`  Current directory: ${process.cwd()}`));
}

async function createFile(args) {
  const [target, ...contentParts] = args;
  if (!target) {
    console.log(chalk.red('  Usage: create <file> [content]'));
    return;
  }

  const filePath = resolveTarget(target);
  const content = contentParts.length > 0 ? `${contentParts.join(' ')}\n` : '';
  await fs.writeFile(filePath, content, { encoding: 'utf-8', flag: 'wx' });
  console.log(chalk.green(`  Created: ${filePath}`));
}

async function readFile(target) {
  if (!target) {
    console.log(chalk.red('  Usage: read <file>'));
    return;
  }

  const filePath = resolveTarget(target);
  const content = await fs.readFile(filePath, 'utf-8');
  console.log('');
  console.log(content || chalk.dim('(empty file)'));
}

async function updateFile(args) {
  const [target, ...contentParts] = args;
  if (!target || contentParts.length === 0) {
    console.log(chalk.red('  Usage: update <file> <content>'));
    return;
  }

  const filePath = resolveTarget(target);
  await fs.appendFile(filePath, `${contentParts.join(' ')}\n`, 'utf-8');
  console.log(chalk.green(`  Updated: ${filePath}`));
}

async function writeFile(args, rl) {
  const [target, ...contentParts] = args;
  if (!target || contentParts.length === 0) {
    console.log(chalk.red('  Usage: write <file> <content>'));
    return;
  }

  const filePath = resolveTarget(target);
  try {
    await fs.access(filePath);
    const answer = await ask(rl, `  Overwrite ${filePath}? Type yes: `);
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log(chalk.yellow('  Write cancelled.'));
      return;
    }
  } catch {
    // File does not exist yet; writeFile will create it.
  }

  await fs.writeFile(filePath, `${contentParts.join(' ')}\n`, 'utf-8');
  console.log(chalk.green(`  Written: ${filePath}`));
}

async function deleteFile(target, rl) {
  if (!target) {
    console.log(chalk.red('  Usage: delete <file>'));
    return;
  }

  const filePath = resolveTarget(target);
  const stat = await fs.stat(filePath);

  if (!stat.isFile()) {
    console.log(chalk.red('  Delete only supports files, not directories.'));
    return;
  }

  const answer = await ask(rl, `  Delete ${filePath}? Type yes: `);
  if (answer.trim().toLowerCase() !== 'yes') {
    console.log(chalk.yellow('  Delete cancelled.'));
    return;
  }

  await fs.unlink(filePath);
  console.log(chalk.green(`  Deleted: ${filePath}`));
}

async function renameFile(from, to) {
  if (!from || !to) {
    console.log(chalk.red('  Usage: rename <from> <to>'));
    return;
  }

  const sourcePath = resolveTarget(from);
  const targetPath = resolveTarget(to);
  await fs.rename(sourcePath, targetPath);
  console.log(chalk.green(`  Renamed: ${sourcePath} -> ${targetPath}`));
}

async function runCommand(input, rl) {
  const [command, ...args] = parseArgs(input.trim());

  if (!command) return true;

  try {
    switch (command.toLowerCase()) {
      case 'help':
        printShellHelp();
        break;
      case 'pwd':
        console.log(`  ${process.cwd()}`);
        break;
      case 'cd':
        await changeDirectory(args[0]);
        break;
      case 'ls':
      case 'dir':
        await listDirectory(args[0]);
        break;
      case 'mkdir':
        if (!args[0]) {
          console.log(chalk.red('  Usage: mkdir <dir>'));
        } else {
          const dirPath = resolveTarget(args[0]);
          await fs.mkdir(dirPath, { recursive: true });
          console.log(chalk.green(`  Created directory: ${dirPath}`));
        }
        break;
      case 'create':
        await createFile(args);
        break;
      case 'read':
      case 'cat':
        await readFile(args[0]);
        break;
      case 'update':
      case 'append':
        await updateFile(args);
        break;
      case 'write':
        await writeFile(args, rl);
        break;
      case 'delete':
      case 'rm':
        await deleteFile(args[0], rl);
        break;
      case 'rename':
      case 'mv':
        await renameFile(args[0], args[1]);
        break;
      case 'exit':
      case 'quit':
        return false;
      default:
        console.log(chalk.red(`  Unknown command: ${command}`));
        console.log(chalk.dim('  Type "help" to see available commands.'));
    }
  } catch (error) {
    console.log(chalk.red(`  ${error.message}`));
  }

  return true;
}

async function startFileShell() {
  const rl = createInterface();

  console.log('');
  console.log(chalk.cyan.bold('File Manager Shell'));
  console.log(chalk.dim('Use Node.js file commands across Linux, macOS, and Windows. Type "help" for commands.'));
  console.log(chalk.dim(`Starting directory: ${process.cwd()}`));

  try {
    let keepRunning = true;
    while (keepRunning) {
      const input = await ask(rl, chalk.cyan('file-shell> '));
      keepRunning = await runCommand(input, rl);
    }
  } finally {
    rl.close();
  }
}

async function maybeStartFileShell() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return;
  }

  const rl = createInterface();
  try {
    const answer = await ask(rl, '\nPress Enter to open File Manager Shell, or type n to exit: ');
    if (answer.trim().toLowerCase() === 'n') {
      return;
    }
  } finally {
    rl.close();
  }

  await startFileShell();
}

module.exports = {
  maybeStartFileShell,
  startFileShell,
  runCommand,
};
