import path from "path";
import process from "node:process";
import simpleGit from "simple-git";
import fs from "fs";

export async function SyncConfigsToGit(): Promise<Error | null> {
    const configDir = path.join(process.cwd(), process.env.CONFIGS_DIR || 'configs')
    const git = simpleGit(configDir);
    const gitBranch = process.env.BRANCH || 'main';

    const {GIT_URL, SSH_KEY} = process.env;

    if (!GIT_URL || !SSH_KEY) {
        const missingVars = [];
        if (!GIT_URL) missingVars.push('GIT_URL');
        if (!SSH_KEY) missingVars.push('SSH_KEY');
        return new Error(
            `Missing required environment variables: ${missingVars.join(', ')}. ` +
            `GIT_URL should be the SSH URL of the Git repository (e.g., git@github.com:username/repo.git). ` +
            `SSH_KEY should be the private key used for Git authentication.`
        );
    }

    // Create .ssh directory if it doesn't exist
    const sshDir = path.join(configDir, '.ssh');
    if (!fs.existsSync(sshDir)) {
        fs.mkdirSync(sshDir, {recursive: true});
    }

    // // Write SSH key to file
    const sshKeyPath = path.join(sshDir, 'id_rsa');
    fs.writeFileSync(sshKeyPath, SSH_KEY);
    fs.chmodSync(sshKeyPath, '600');

    // Configure Git
    await git.addConfig('core.sshCommand', `ssh -i ${sshKeyPath} -o StrictHostKeyChecking=no`);

    const gitDir = path.join(configDir, '.git');

    // Initialize Git if not already initialized
    if (!fs.existsSync(gitDir)) {
        console.log('Initializing Git repository...');
        await git.init();

        // Add remote
        console.log('Adding remote repository...');
        await git.addRemote('origin', GIT_URL);

        // Pull changes from the remote repository
        console.log('Pulling changes from remote repository...');
        try {
            // Step 1: Fetch the latest updates from the remote repository
            await git.fetch('origin', gitBranch);
            // Step 2: Forcefully reset the local branch to match the remote branch
            await git.reset(['--hard', `origin/${gitBranch}`]);
        } catch (pullError: any) {
            if (pullError.message.includes("There is no tracking information for the current branch")) {
                console.log('No tracking information found. Setting upstream branch...');
            } else {
                console.error('Error pulling changes:', pullError.message);
                return Error(pullError.message)
            }
        }

        // Check if .gitignore exists
        const gitignorePath = path.join(configDir, '.gitignore');
        const gitignoreContent = `
            .git/*
            .ssh/*`;

        if (fs.existsSync(gitignorePath)) {
            const existingContent = fs.readFileSync(gitignorePath, 'utf-8');
            if (!existingContent.includes('.git/*') || !existingContent.includes('.ssh/*')) {
                console.log('Updating .gitignore file...');
                fs.appendFileSync(gitignorePath, gitignoreContent);
            } else {
                console.log('.gitignore already contains required entries. Skipping modification.');
            }
        } else {
            console.log('Creating .gitignore file...');
            fs.writeFileSync(gitignorePath, gitignoreContent);
        }


        // Add configs folder
        console.log('Adding configs folder...');
        await git.add(configDir);

        // Initial commit
        console.log('Creating initial commit...');
        await git.commit('Initial commit: Add mock configurations');

        // Push to remote
        console.log('Pushing to remote repository...');
        await git.push('origin', gitBranch);
    } else {
        // Pull changes first
        console.log('Pulling latest changes...');
        try {
            await git.pull('origin', gitBranch);
        } catch (pullError: any) {
            // If pull fails, try to handle merge conflicts
            if (pullError.message?.includes('conflict')) {
                // Stash current changes
                await git.stash();

                // Pull again
                await git.pull('origin', gitBranch);

                // Apply stashed changes
                await git.stash(['pop']);

                // If there are conflicts, abort the merge
                if (await git.status().then(status => status.conflicted.length > 0)) {
                    await git.merge(['--abort']);
                    return Error(`Merge conflict detected. Please resolve conflicts manually. \n${pullError.message}`);
                }
            } else {
                return pullError
            }
        }

        // Add only the configs folder
        console.log('Adding configs folder...');
        await git.add(configDir);

        // Commit changes
        console.log('Committing changes...');
        await git.commit('Sync mock configs');

        // Push to remote
        console.log('Pushing to remote repository...');
        await git.push('origin', gitBranch);
    }

    // // Clean up SSH key
    // try {
    //     if (fs.existsSync(sshKeyPath)) {
    //         fs.unlinkSync(sshKeyPath);
    //         console.log('SSH key cleaned up successfully.');
    //     }
    // } catch (cleanupError: any) {
    //     console.error('Error cleaning up SSH key:', cleanupError?.message);
    // }

    return null;

}
