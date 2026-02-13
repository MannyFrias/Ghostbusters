import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';

/**
 * setupHusky
 * automates Husky installation and sets Ghostbusters hook;
 * Implementing 'node:' protocal for built-in modules to ensure
 * compatibility with ESM and future Node.js versions.
 *  Checks for Git repository, skips checking for existing Husky
 * installation as that is automated in Husky, and adds pre-commit hook if not already present.
 */

const exec = promisify(execCallback);

export async function setupHusky() {
    const rootDir = process.cwd();
    const huskyDir = path.join(rootDir, '.husky');
    const preCommitPath = path.join(huskyDir, 'pre-commit');

    //1. Check for Git (as Husky requires a git repository)
    try {
        await fs.access(path.join(rootDir, '.git'));
    } catch {
        throw new Error('Git repository not found. Please initialize a git repository before setting up Husky.');
    }

    //2. Install Husky (it will check if already installed and ensure up to date) as a dev dependency
    console.log(chalk.blue('Installing Husky as a dev dependency...'));
    await exec('npm install husky --save-dev');

    //3. Initialize Husky (modern v9 approach, will not fail if already initialized)
    //npx husky init is indempotent (safe to run multiple times)
    console.log(chalk.blue('Initializing Husky...'));
    try {
        await exec('npx husky init');
    } catch (error) {
        //If initialization fails, it may be because the .husky directory already exists, which is fine
       console.warn(chalk.yellow('Husky initialization warning:'), error.message);
    }

    //4. Add Ghostbusters to the pre-commit hook
    console.log(chalk.blue('Configuring pre-commit hook...'));
    const command = 'npx ghostbusters';

    //Husky v9 pre-commit usually starts with a shebang and may have other commands, so we need to append our command if it's not already there
    const shebang = '#!/bin/sh\n';

    let currentContent = '';
    try {
        currentContent = await fs.readFile(preCommitPath, 'utf-8');
    } catch {
        // File does not exist, it will be created with our command beginning with the shebang
    }

    if (!currentContent.includes(command)) {
        //ensure we have the shebang and the command
        let newContent = currentContent;

        if (!newContent.startsWith('#!')) {
            newContent = shebang + newContent;
        }

        //Add a newline if the file doesn't end, then add our command
        newContent = newContent.endsWith('\n')
         ? `${newContent}${command}\n` 
         : `${newContent}\n${command}\n`;

        await fs.writeFile(preCommitPath, newContent, { mode: 0o755 });
        console.log(chalk.green('Ghostbusters and Husky united!'));
    } else {
        console.log(chalk.yellow('Pre-commit hook already exists. Skipping hook setup.'));
    }
    console.log(chalk.green.bold('Ghostbusters setup complete!'));                         
}