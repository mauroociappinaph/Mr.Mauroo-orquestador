import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DIRNAME = ".openclaw";

export const resolveStateDir = (
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = os.homedir,
): string => {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) return path.resolve(override.replace(/^~(?=$|[\\/])/, homedir()));
  const home = homedir();
  const dir = path.join(home, DIRNAME);
  try {
    if (fs.existsSync(home)) return dir;
  } catch {
    // ignore
  }
  return path.join(os.tmpdir(), DIRNAME);
};
