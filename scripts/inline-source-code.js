'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const filePaths = glob.sync(path.join(__dirname, '..', 'content') + '/**/*.md');

const seperator = chalk.grey('------------------------------------------');

filePaths.forEach(filePath => {
  console.log(seperator);
  console.log();

  console.log(chalk.blue('  File Path:') + ' ' + filePath);
  console.log();

  const fileContents = fs.readFileSync(filePath).toString();

  const rootOfProject = path.join(__dirname, '..');
  const relativePath = path.parse(path.relative(rootOfProject, filePath)).dir;

  const inlinedContents = inlineSourceCode(relativePath, fileContents);

  const contentsRelativePath = path.relative(path.join(rootOfProject, 'content'), filePath);
  const outputPath = path.join(__dirname, '..', 'inlined', contentsRelativePath);

  console.log(chalk.blue('  Output Path:') + ' ' + outputPath);

  mkdirp.sync(path.parse(outputPath).dir);

  fs.writeFileSync(outputPath, inlinedContents);

  console.log();
});

console.log(seperator);


function inlineSourceCode(relativePath, fileContents) {
  let inlineCount = 0;
  let regexResult = null;
  while(regexResult =
    /<%\s*include\(\s*['|"](.*)['|"]\s*\)\s*%>/g.exec(fileContents)) {
    const fullRegexString = regexResult[0];
    const fileToInline = regexResult[1];

    const fileToInlinePath = path.join(__dirname, '..', relativePath, fileToInline);
    console.log(chalk.magenta('  File to Inline:') + ' ' + fileToInlinePath);

    let codeContent = fs.readFileSync(fileToInlinePath).toString();
    console.log('before', codeContent);
    codeContent = codeContent.replace(/^\s+|\s+$/g, '');
    console.log('after');

    fileContents = fileContents.slice(0, regexResult.index) + codeContent +
      fileContents.slice(regexResult.index + fullRegexString.length, fileContents.length);

    inlineCount ++;
  }

  if (inlineCount === 0) {
    console.log(chalk.magenta('  No Code Samples'));
  }

  return fileContents;
}
