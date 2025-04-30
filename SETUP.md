# Reactive Contracts SDK Setup Guide

This document provides instructions for setting up, testing, and publishing the Reactive Contracts SDK.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Clone and Install

1. Clone the repository:

```bash
git clone https://github.com/your-username/reactive-contracts-sdk.git
cd reactive-contracts-sdk
```

2. Install dependencies:

```bash
npm install
```

### Project Structure

The SDK is organized as follows:

```
reactive-contracts-sdk/
├── src/                      # Source code
│   ├── templates/            # Contract templates
│   ├── validation/           # Input validation
│   ├── generator/            # Contract generation
│   ├── utils/                # Utility functions
│   └── index.js              # Main export
├── test/                     # Test files
├── examples/                 # Usage examples
├── dist/                     # Compiled output (generated)
├── package.json              # Project metadata
└── README.md                 # Documentation
```

## Running Tests

The SDK uses Jest for testing. To run the tests:

```bash
npm test
```

To run tests with coverage report:

```bash
npm test -- --coverage
```

## Local Development

### Building the SDK

```bash
npm run build
```

This will compile the source files to the `dist` directory.

### Linting and Formatting

To lint the code:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```

### Trying the Examples

To run the basic example:

```bash
node examples/basic.js
```

## Publishing to npm

### Prepare for Publishing

1. Update the version in `package.json`:

```bash
npm version patch  # or minor, or major
```

2. Build the package:

```bash
npm run build
```

3. Test the package locally:

```bash
npm pack
```

This will create a tarball that you can install locally to test:

```bash
npm install ./reactive-contracts-sdk-0.1.0.tgz
```

### Publishing to npm Registry

1. Make sure you're logged in to npm:

```bash
npm login
```

2. Publish the package:

```bash
npm publish
```

For a first release, you might want to use the `--access public` flag:

```bash
npm publish --access public
```

## Usage in Projects

After publishing, you can install the package in your projects:

```bash
npm install reactive-contracts-sdk
```

## Contributing

1. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git commit -m "Add your feature description"
```

3. Push to your branch:

```bash
git push origin feature/your-feature-name
```

4. Create a pull request on GitHub.

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- MAJOR version when making incompatible API changes
- MINOR version when adding functionality in a backwards compatible manner
- PATCH version when making backwards compatible bug fixes