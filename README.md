# typescript-template

Template using the following tools

- node 20 (https://github.com/nodejs/release#release-schedule)
- nvm (https://github.com/nvm-sh/nvm) or volta (https://volta.sh/)
- yarn (https://yarnpkg.com/)
- typescript (https://www.typescriptlang.org/)
- prettier (https://prettier.io/)
- eslint (https://eslint.org/)
- jest (https://jestjs.io/)
- husky (https://typicode.github.io/husky/#/)
- commitlint (https://commitlint.js.org/#/)
- dependabot (https://docs.github.com/en/code-security/dependabot)
- codeql (https://codeql.github.com/)

Assumes that nvm (or volta) and yarn are installed

Assumes that JetBrains IntelliJ (https://www.jetbrains.com/idea/) or Visual Studio Code (https://code.visualstudio.com/) is the IDE

## Commands

run `nvm install` or `volta install node` to ensure that the correct node version is installed

run `yarn set version berry` or `volta install yarn` to use the latest yarn version

run `yarn` to install packages

run `yarn test` to run tests

run `yarn lint` to run linter

run `yarn up-i` to update packages
