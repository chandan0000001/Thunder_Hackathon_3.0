'use strict';

/**
 * @module fileManager
 * @description Sandboxed CRUD file operations restricted to the workspace/ directory.
 *              Never deletes arbitrary files — only operates on known demo files.
 *              Uses incremental naming so each run preserves previous files:
 *              sample.txt, sample1.txt, sample2.txt, ...
 */

const fs = require('fs').promises;
const path = require('path');

/** @constant {string} WORKSPACE_DIR - Absolute path to the sandbox workspace folder. */
const WORKSPACE_DIR = path.resolve(__dirname, '..', 'workspace');

/** @constant {string} TEMP_FILE - Path to workspace/temp.txt (always overwritten, used for delete demo) */
const TEMP_FILE = path.join(WORKSPACE_DIR, 'temp.txt');

/**
 * Ensures the workspace directory exists.
 * @returns {Promise<void>}
 */
async function ensureWorkspaceExists() {
  try {
    await fs.mkdir(WORKSPACE_DIR, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create workspace directory: ${error.message}`);
  }
}

/**
 * Scans a directory for existing files matching a base name pattern and returns
 * the next available file path with an incremental number.
 *
 * Pattern: base.ext → base1.ext → base2.ext → base3.ext ...
 *
 * @param {string} dir - Directory to scan.
 * @param {string} baseName - Base file name without extension (e.g. "sample").
 * @param {string} ext - File extension including dot (e.g. ".txt").
 * @returns {Promise<{ filePath: string, runNumber: number }>}
 */
async function getNextFilePath(dir, baseName, ext) {
  try {
    await fs.mkdir(dir, { recursive: true });
    const files = await fs.readdir(dir);
    const pattern = new RegExp(`^${baseName}(\\d*)\\${ext}$`);
    let maxNum = -1;

    for (const file of files) {
      const match = file.match(pattern);
      if (match) {
        const num = match[1] === '' ? 0 : parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }

    const nextNum = maxNum + 1;
    const suffix = nextNum === 0 ? '' : String(nextNum);
    const fileName = `${baseName}${suffix}${ext}`;
    return { filePath: path.join(dir, fileName), runNumber: nextNum };
  } catch (error) {
    // Fallback to base name if directory scan fails
    return { filePath: path.join(dir, `${baseName}${ext}`), runNumber: 0 };
  }
}

/**
 * CREATE — Creates the next available sample file (sample.txt, sample1.txt, sample2.txt, ...).
 * @param {string} [targetFile] - Optional explicit file path. If omitted, auto-increments.
 * @returns {Promise<{ success: boolean, file: string, message: string }>}
 */
async function createFile(targetFile) {
  try {
    await ensureWorkspaceExists();
    let filePath = targetFile;
    if (!filePath) {
      const next = await getNextFilePath(WORKSPACE_DIR, 'sample', '.txt');
      filePath = next.filePath;
    }
    const fileName = path.basename(filePath);
    const content = `Thunder Hackathon - Sample File\nCreated: ${new Date().toISOString()}\nThis file demonstrates the CREATE operation.\n`;
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true, file: filePath, message: `${fileName} created successfully.` };
  } catch (error) {
    return { success: false, file: targetFile || WORKSPACE_DIR, message: `Create failed: ${error.message}` };
  }
}

/**
 * READ — Reads the specified sample file and returns its content.
 * @param {string} targetFile - The file path to read.
 * @returns {Promise<{ success: boolean, file: string, content?: string, message: string }>}
 */
async function readFile(targetFile) {
  try {
    await fs.access(targetFile);
    const content = await fs.readFile(targetFile, 'utf-8');
    const fileName = path.basename(targetFile);
    return { success: true, file: targetFile, content, message: `${fileName} read successfully.` };
  } catch (error) {
    return { success: false, file: targetFile, message: `Read failed: ${error.message}` };
  }
}

/**
 * UPDATE — Appends a timestamp line to the specified sample file.
 * @param {string} targetFile - The file path to update.
 * @returns {Promise<{ success: boolean, file: string, message: string }>}
 */
async function updateFile(targetFile) {
  try {
    await fs.access(targetFile);
    const timestamp = new Date().toISOString();
    const appendContent = `\n[UPDATED] Timestamp appended: ${timestamp}\n`;
    await fs.appendFile(targetFile, appendContent, 'utf-8');
    const fileName = path.basename(targetFile);
    return { success: true, file: targetFile, message: `${fileName} updated successfully.` };
  } catch (error) {
    return { success: false, file: targetFile, message: `Update failed: ${error.message}` };
  }
}

/**
 * DELETE — Deletes only workspace/temp.txt. Never deletes arbitrary files.
 * Creates temp.txt first if it doesn't exist (to demonstrate the delete cycle).
 * @returns {Promise<{ success: boolean, file: string, message: string }>}
 */
async function deleteDemoFile() {
  try {
    // Create temp.txt if it doesn't exist so the delete has something to remove
    try {
      await fs.access(TEMP_FILE);
    } catch {
      await ensureWorkspaceExists();
      await fs.writeFile(TEMP_FILE, 'Temporary demo file for delete operation.\n', 'utf-8');
    }
    await fs.unlink(TEMP_FILE);
    return { success: true, file: TEMP_FILE, message: 'temp.txt deleted successfully.' };
  } catch (error) {
    return { success: false, file: TEMP_FILE, message: `Delete failed: ${error.message}` };
  }
}

/**
 * Runs the full CRUD demo sequence using incremental file naming.
 * Each run creates a new numbered file (sample.txt, sample1.txt, sample2.txt, ...).
 * @returns {Promise<object>} Results of all CRUD operations.
 */
async function runCrudDemo() {
  // Determine the next available sample file for this run
  const { filePath: sampleFile } = await getNextFilePath(WORKSPACE_DIR, 'sample', '.txt');

  const createResult = await createFile(sampleFile);
  const readResult = await readFile(sampleFile);
  const updateResult = await updateFile(sampleFile);
  const readAfterUpdate = await readFile(sampleFile);
  const deleteResult = await deleteDemoFile();

  return {
    create: createResult,
    read: readResult,
    update: updateResult,
    readAfterUpdate: {
      success: readAfterUpdate.success,
      content: readAfterUpdate.content,
      message: 'Verified content after update.',
    },
    delete: deleteResult,
  };
}

module.exports = {
  createFile,
  readFile,
  updateFile,
  deleteDemoFile,
  runCrudDemo,
  getNextFilePath,
  WORKSPACE_DIR,
  TEMP_FILE,
};
