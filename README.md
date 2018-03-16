[![Build Status](https://travis-ci.org/rehret/ducat-market.svg?branch=master)](https://travis-ci.org/rehret/ducat-market)
[![Coverage Status](https://coveralls.io/repos/github/rehret/ducat-market/badge.svg?branch=master)](https://coveralls.io/github/rehret/ducat-market?branch=master)

# Ducat Market
Find the best value items for turning platinum into ducats in Warframe.

## Getting Started
#### Prerequisites
[NodeJS](https://nodejs.org/) is required. It can be installed [here](https://nodejs.org/en/download/).

This project uses [yarn](https://yarnpkg.com) in place of npm. Follow [these instructions](https://yarnpkg.com/en/docs/install) to install yarn globally.

> Warning: Windows users should not install [yarn](https://yarnpkg.com) via NPM, instead use the [downloadable](https://yarnpkg.com/latest.msi) MSI executable.

Once installed, yarn is used to install all dependencies.
```bash
yarn install
```

#### Local Development
This command will build the server-side with ts-node in watch mode. It will also build the client-side in watch mode with webpack.
```bash
yarn develop
```

#### Running
```bash
yarn build
yarn start
```

#### Testing
```bash
yarn test
```

## Contributing
Make sure you have [tslint](https://www.npmjs.com/package/tslint) installed globally. This project is linted before each build. All code contributions should have zero linting errors.

Also, install [EditorConfig](http://editorconfig.org/) in your editor. This will help keep a consistent code style throughout the project.

This project makes use of [GitHub Flow](https://guides.github.com/introduction/flow/). As such, work should be done on a feature branch and a pull request opened against `master` once the work is complete. Feature branches should following the naming convention `feature/<feature-name>`.

#### Versioning
Version numbers will follow [SemVer](https://semver.org/) versioning:
> Major.Minor.Patch

For example, this is a valid version number:
> 1.2.345

Any changes that affect the major, minor, or patch versioning should have a tag pushed to `origin` with the SemVer version (consisting of major, minor, and patch).
For example, if the project was at version `0.1.0` and it was decided that it was ready for official release, the tag `1.0.0` would be pushed to origin at that commit.
