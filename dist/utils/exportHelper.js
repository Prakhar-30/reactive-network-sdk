"use strict";
/**
 * Utilities for exporting generated contracts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportContract = exportContract;
exports.exportForgeProject = exportForgeProject;
exports.exportAsJson = exportAsJson;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Exports a generated contract to a file
 * @param {string} contractCode - The contract code to export
 * @param {string} contractName - The name of the contract
 * @param {string} outputPath - Path to export the contract to
 * @returns {string} - The path to the exported file
 */
function exportContract(contractCode, contractName, outputPath) {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    const fileName = `${contractName}.sol`;
    const filePath = path.join(outputPath, fileName);
    fs.writeFileSync(filePath, contractCode, 'utf8');
    return filePath;
}
function exportForgeProject(contractCode, contractName, outputPath) {
    // Create the project directory
    const projectPath = path.join(outputPath, contractName.toLowerCase());
    fs.mkdirSync(projectPath, { recursive: true });
    // Create src directory
    const srcPath = path.join(projectPath, 'src');
    fs.mkdirSync(srcPath, { recursive: true });
    // Create contracts directory
    const contractsPath = path.join(srcPath, 'contracts');
    fs.mkdirSync(contractsPath, { recursive: true });
    // Write the contract file
    const contractPath = path.join(contractsPath, `${contractName}.sol`);
    fs.writeFileSync(contractPath, contractCode, 'utf8');
    // Create foundry.toml
    const foundryConfig = `[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@reactive/=lib/reactive-lib/src/"]

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
`;
    fs.writeFileSync(path.join(projectPath, 'foundry.toml'), foundryConfig, 'utf8');
    // Create .gitignore
    const gitignore = `# Compiler files
cache/
out/

# Ignores development broadcast logs
!/broadcast
/broadcast/*/31337/
/broadcast/**/dry-run/

# Docs
docs/

# Dotenv file
.env
`;
    fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore, 'utf8');
    // Create README.md
    const readme = `# ${contractName}

A reactive smart contract generated with Reactive Smart Contracts SDK.

## Setup

1. Install Foundry if you haven't already:
     \`\`\`bash
     curl -L https://foundry.paradigm.xyz | bash
     foundryup
     \`\`\`

2. Install dependencies:
     \`\`\`bash
     forge install Reactive-Network/reactive-lib
     \`\`\`

## Deployment

To deploy to Kopli testnet or Reactive Network, use the Forge deployment command:

\`\`\`bash
forge create --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> src/contracts/${contractName}.sol:${contractName} --constructor-args <ORIGIN_CONTRACT> <DESTINATION_CONTRACT>
\`\`\`

Replace \`<RPC_URL>\`, \`<PRIVATE_KEY>\`, \`<ORIGIN_CONTRACT>\` and \`<DESTINATION_CONTRACT>\` with your values.
`;
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme, 'utf8');
    // Create .gitmodules
    const gitmodules = `[submodule "lib/forge-std"]
    path = lib/forge-std
    url = https://github.com/foundry-rs/forge-std
[submodule "lib/reactive-lib"]
    path = lib/reactive-lib
    url = https://github.com/Reactive-Network/reactive-lib
`;
    fs.writeFileSync(path.join(projectPath, '.gitmodules'), gitmodules, 'utf8');
    return projectPath;
}
function exportAsJson(contractCode, contractName) {
    return {
        name: contractName,
        code: contractCode,
        timestamp: new Date().toISOString()
    };
}
