#!/usr/bin/env node

var Validate = require('git-validate');

Validate.installScript('lint', './node_modules/tslint/bin/tslint -c tslint.json "src/**/*.ts"');
Validate.installHooks('pre-commit');
Validate.configureHook('pre-commit', ['lint']);
