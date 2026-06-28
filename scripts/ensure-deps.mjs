import { spawn } from "node:child_process";

async function canImportPg() {
  try {
    await import("pg");
    return true;
  } catch {
    return false;
  }
}

if (!(await canImportPg())) {
  console.log("Installing runtime dependencies...");
  await new Promise((resolve, reject) => {
    const child = spawn("npm", ["install", "--no-audit", "--no-fund", "--package-lock=false"], {
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install exited with code ${code}`));
    });
  });
}
