const { spawn } = require("child_process");
const path = require("path");

// Environment and arguments
const env = process.env.ENV || "dev";
const action = process.argv[2]; // 'up' or 'down'
const target = process.argv[3]; // 'infra:all', 'svc:core', etc.

// Console colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

if (!action || !target) {
  console.error(
    `${colors.red}Usage: node ops/scripts/ctrl.js [up|down] [target]${colors.reset}`
  );
  process.exit(1);
}

// Layers
const layers = {
  // --- Infrastructure ---
  "infra:security": ["ops/compose/infra.security.yml"],
  "infra:edge": [
    "ops/compose/infra.edge.store.yml",
    "ops/compose/infra.edge.service.yml",
  ],
  "infra:data": [
    "ops/compose/infra.data.store.yml",
    "ops/compose/infra.data.active.yml",
  ],
  "infra:monitor": ["ops/compose/infra.monitor.yml"],
  "infra:devtools": ["ops/compose/infra.devtools.yml"],

  // --- Services ---
  "svc:core": ["ops/compose/service.core.yml"],
  "svc:worker": ["ops/compose/service.worker.yml"],
  "svc:engine": ["ops/compose/service.matchmaker.yml"],
  "svc:store": ["ops/compose/service.store.yml"],
  "svc:music": ["ops/compose/service.music.yml"],

  // --- App ---
  "app:client": ["ops/compose/app.client.yml"],
};

// Aliases for combined layers
layers["infra:all"] = [
  ...layers["infra:security"],
  ...layers["infra:edge"],
  ...layers["infra:data"],
  ...(env === "prod" || env === "stage"
    ? layers["infra:monitor"]
    : layers["infra:devtools"]),
];

layers["svc:all"] = [
  ...layers["svc:core"],
  ...layers["svc:worker"],
  ...layers["svc:engine"],
  ...layers["svc:store"],
  ...layers["svc:music"],
];

// Collect selected files
const selectedFiles = layers[target];

if (!selectedFiles) {
  console.error(`${colors.red}Target not found: ${target}${colors.reset}`);
  console.log(`Available targets: ${Object.keys(layers).join(", ")}`);
  process.exit(1);
}

// ENV file path (multi-os friendly)
const envFile = path.join(__dirname, `../env/.env.${env}`);

// Docker Compose arguments
const args = [
  "compose",
  "--env-file",
  envFile,
  ...selectedFiles.flatMap((file) => ["-f", file]),
  action === "up" ? "up" : "down",
];

// Use '-d' (detach) if action is 'up'
if (action === "up") args.push("-d");

// Single service targeting (optional, for special cases like svc:store)
const extraService = process.argv[4];
if (extraService) args.push(extraService);

// Run Docker Compose command
console.log(`${colors.cyan}Riffle Controller (${env})${colors.reset}`);
console.log(`${colors.yellow}Target:${colors.reset} ${target}`);
console.log(`${colors.yellow}Action:${colors.reset} ${action.toUpperCase()}`);
console.log(`${colors.yellow}Config:${colors.reset} ${envFile}`);

const cmd = spawn("docker", args, { stdio: "inherit", shell: true });

cmd.on("close", (code) => {
  if (code !== 0) {
    console.error(
      `${colors.red}Process failed with error code: ${code}${colors.reset}`
    );
    process.exit(code);
  } else {
    console.log(`${colors.green}Process completed successfully.${colors.reset}`);
  }
});
