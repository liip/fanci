# Change Log
All notable changes to this project will be documented in this file.
This project follows [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## 0.5.0 - 2015-05-18
#### Added
- Functionality to match a property name using '*' as wildcard (thanks Elin Ahmedow for this contribution!)

### Changed
- New rules for JSCS based on node preset

## 0.4.0 - 2014-12-30
#### Added
- Added transform functionality to create arbitrary objects based on a template
- Added format function to transform, so that transformation are more flexible

#### Changed
- Refactoring to use the Template Method pattern
- BC-break: the rename template has a new structure, i.e. the new renamed keys are the keys of the template

## 0.3.0 - 2014-12-13
### Added
- New functionality to rename object keys based on a template
- Introduced a change log

## 0.2.1 - 2014-05-26
### Added
- License information in the LICENSE.md file

### Changed
- Transfer repository from 'metaodi' to 'liip'

## 0.2.0 - 2014-05-26
### Added
- Tests for `extract`
- Added support for arrays
- Added wildcard '*' to match all keys of a level

## 0.1.0 - 2014-05-24
### Changed
- Renamed `transform` to `extract` (BC break) as it better describes its function

## 0.0.2 - 2014-05-23
### Changed
- Change description in package.json
- Improved README with examples and better description of fanci

## 0.0.1 - 2014-05-23
### Added
- Initial version of fanci with basic implementation of `transform`
- Added README file
- Added examples (template and source JSON)


# Categories
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for once-stable features removed in upcoming releases.
- `Removed` for deprecated features removed in this release.
- `Fixed` for any bug fixes.
- `Security` to invite users to upgrade in case of vulnerabilities.
