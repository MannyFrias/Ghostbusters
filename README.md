# Ghostbusters 👻
**Stop phantom endpoints from haunting your codebase.**

[Ghostbusters](https://ghostbusterscli.netlify.app/) is a lightweight [JavaScript](https://www.javascript.com/) utility designed to identify "ghost routes" (unused or broken endpoints) in [React](https://react.dev/)-to-[Express](https://expressjs.com/) routing. By integrating directly into your Git workflow, it ensures that dead code is eliminated before it ever hits production.

## 📇 Features
- **ESM Support:** Optimized for modern environments using ECMAScript Modules to provide a lightweight and efficient footprint.
- **Git Hooks:** Leverages [Husky](https://typicode.github.io/husky/) to automate code quality checks, catching ghost routes at the point of commit.
- **Dedicated CLI:** Includes a dedicated entry point for terminal-based route detection.

## 🔍 How it Works
Ghostbusters analyzes your codebase to identify discrepancies between your **frontend API calls** and **backend routes**. It specifically flags:
* **Broken Calls:** Requests in your frontend that point to routes that don't exist in your backend.

## 🚦 Getting Started

### Prerequisites
- Node.js
- npm

### Installation
```bash
npm install @ghostbusters/cli --save-dev
```

### Configruation
Create a ```ghostbusters.config.js``` in your project root to customize scan directories and ignore patterns.
```bash
// ghostbusters.config.js
export default {
  frontend: ["./src/client", "./src/components"],
  backend: ["./src/server", "./src/api"],
  ignore: ["node_modules", "dist", "*.test.js"]
};
```

### Package.json Setup
Add a script to your ```package.json``` for easy scanning.
```bash
scripts: {
  "ghostbusters": "ghostbusters scan --frontend ./src/client --backend ./src/server"
  }
```

## 🧼 Usage
```bash
# Basic scan
  npx ghostbusters init

# Specify directories
  npx ghostbusters scan --frontend ./src/client --backend ./src/server

# Output as JSON
  npx ghostbusters scan --format json
```

## 🏛️ Project Structure
* `.husky/`: Pre-commit hook configurations
* `src/`: Core logic & CLI entry point
* `test/`: Quality control test suites
* `scripts/`: Development automation helpers
* `package.json`: ESM configuration & dependencies


## 🧪 Testing
We use a dedicated test suite to ensure the detection logic is accurate.
```bash
npm test
```
## ⚖️ License
This project is licensed under the [MIT License](https://opensource.org/license/MIT).

## ✍🏾 Contributors
* [Manny](https://github.com/MannyFrias)
* [Mohamed](https://github.com/mohamedebada21)
* [Erika](https://github.com/EriMarz)
* [Christian](https://github.com/kowalsole)
* [Robyn](https://github.com/5Runi)
