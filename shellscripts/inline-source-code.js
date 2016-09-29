'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const DEBUG = false;

const log = msg => {
  if (!DEBUG) {
    return;
  }

  if (!msg) {
    msg = '';
  }

  console.log(msg);
};

const folderName = '_content';
const filePaths = glob.sync(path.join(__dirname, '..', folderName) + '/**/*.md');

const seperator = chalk.grey('------------------------------------------');

const rootOfProject = path.join(__dirname, '..');
const contentPath = path.join(rootOfProject, folderName);

filePaths.forEach(filePath => {
  log(seperator);
  log();

  log(chalk.blue('  File Path:') + ' ' + filePath);
  log();

  const fileContents = fs.readFileSync(filePath).toString();
  const relativePath = path.parse(path.relative(rootOfProject, filePath)).dir;

  let inlinedContents = inlineSourceCode(relativePath, fileContents);

  // This warps all images to use 'images/' instead of '/images/'
  inlinedContents = inlinedContents.replace(/\(\/images\//g, '(images/');

  // Write new File
  const contentsRelativePath = path.relative(contentPath, filePath);
  const outputPath = path.join(__dirname, '..', '_inlined', contentsRelativePath);
  log(chalk.blue('  Output Path:') + ' ' + outputPath);
  mkdirp.sync(path.parse(outputPath).dir);
  fs.writeFileSync(outputPath, inlinedContents);

  log();
});

log(seperator);


function inlineSourceCode(relativePath, fileContents) {
  let inlineCount = 0;
  let regexResult = null;
  while(regexResult =
    /<%\s*include\(\s*['|"](.*)['|"]\s*\)\s*%>/g.exec(fileContents)) {
    const fullRegexString = regexResult[0];
    const fileToInline = regexResult[1];

    const fileToInlinePath = path.join(__dirname, '..', relativePath, fileToInline);
    log(chalk.magenta('  File to Inline:') + ' ' + fileToInlinePath);

    let codeContent = fs.readFileSync(fileToInlinePath).toString();
    log('before', codeContent);
    codeContent = codeContent.replace(/^\s+|\s+$/g, '');
    log('after');

    fileContents = fileContents.slice(0, regexResult.index) + '``` javascript\n' +
      codeContent + '\n```' +
      fileContents.slice(regexResult.index + fullRegexString.length, fileContents.length);

    inlineCount ++;
  }

  if (inlineCount === 0) {
    log(chalk.magenta('  No Code Samples'));
  }

  return fileContents;
}
