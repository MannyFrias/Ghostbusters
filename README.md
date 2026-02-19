# Ghostbusters 👻
**Stop phantom endpoints from haunting your codebase.**

[Ghostbusters](https://github.com/MannyFrias/Ghostbusters) is a lightweight [JavaScript](https://www.javascript.com/) utility designed to identify "ghost routes" (unused or broken endpoints) in [React](https://react.dev/)-to-[Express](https://expressjs.com/) routing. By integrating directly into your Git workflow, it ensures that dead code is eliminated before it ever hits production.

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
npm install ghostbusters --save-dev
```

## 🧼 Usage
To scan your project for ghost routes, execute the utility from your command line:
```bash
# Run the ghost route detection suite
npm start
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
