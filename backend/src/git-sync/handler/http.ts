import {Request, Response} from 'express';
import {SyncConfigsToGit} from "@/git-sync/services/SyncConfigs";


export const SyncToGitHttpHandler = async (req: Request, res: Response) => {
    let error = await SyncConfigsToGit()
    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    return res.json({
        success: true,
        message: 'Successfully synced configs to Git repository'
    });
}
