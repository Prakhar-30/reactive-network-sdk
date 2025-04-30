/**
 * Utilities for exporting generated contracts
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Exports a generated contract to a file
 * @param {string} contractCode - The contract code to export
 * @param {string} contractName - The name of the contract
 * @param {string} outputPath - Path to export the contract to
 * @returns {string} - The path to the exported file
 */
function exportContract(contractCode: string, contractName: string, outputPath: string): string {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  const fileName = `${contractName}.sol`;
  const filePath = path.join(outputPath, fileName);
  
  fs.writeFileSync(filePath, contractCode, 'utf8');
  
  return filePath;
}

/**
 * Creates a Forge project structure with the reactive contract
 * @param {string} contractCode - The contract code
 * @param {string} contractName - The name of the contract
 * @param {string} outputPath - Path to create the project in
 * @returns {string} - The path to the project
 */
// Interfaces
interface FoundryProjectFiles {
    foundryConfig: string;
    gitignore: string;
    readme: string;
    gitmodules: string;
}

function exportForgeProject(contractCode: string, contractName: string, outputPath: string): string {
    // Create the project directory
    const projectPath: string = path.join(outputPath, contractName.toLowerCase());
    fs.mkdirSync(projectPath, { recursive: true });
    
    // Create src directory
    const srcPath: string = path.join(projectPath, 'src');
    fs.mkdirSync(srcPath, { recursive: true });
    
    // Create contracts directory
    const contractsPath: string = path.join(srcPath, 'contracts');
    fs.mkdirSync(contractsPath, { recursive: true });
    
    // Write the contract file
    const contractPath: string = path.join(contractsPath, `${contractName}.sol`);
    fs.writeFileSync(contractPath, contractCode, 'utf8');
    
    // Create foundry.toml
    const foundryConfig: string = `[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@reactive/=lib/reactive-lib/src/"]

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
`;
    fs.writeFileSync(path.join(projectPath, 'foundry.toml'), foundryConfig, 'utf8');
    
    // Create .gitignore
    const gitignore: string = `# Compiler files
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
    const readme: string = `# ${contractName}

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
    const gitmodules: string = `[submodule "lib/forge-std"]
    path = lib/forge-std
    url = https://github.com/foundry-rs/forge-std
[submodule "lib/reactive-lib"]
    path = lib/reactive-lib
    url = https://github.com/Reactive-Network/reactive-lib
`;
    fs.writeFileSync(path.join(projectPath, '.gitmodules'), gitmodules, 'utf8');
    
    return projectPath;
}

/**
 * Returns the contract code as a JSON object
 * @param {string} contractCode - The contract code
 * @param {string} contractName - The name of the contract
 * @returns {Object} - JSON representation of the contract
 */
interface ContractJson {
    name: string;
    code: string;
    timestamp: string;
}

function exportAsJson(contractCode: string, contractName: string): ContractJson {
    return {
        name: contractName,
        code: contractCode,
        timestamp: new Date().toISOString()
    };
}

export {
  exportContract,
  exportForgeProject,
  exportAsJson
};