'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const DEBUG = true;

const log = msg => {
  if (!DEBUG) {
    return;
  }

  if (!msg) {
    msg = '';
  }

  console.log(msg);
};

const folderName = '_src_content';
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
  const contentsRelativePath = path.relative(contentPath, filePath);
  const ebookOutputPath = path.join(__dirname, '..', '_ebook', contentsRelativePath);
  const jekyllOutputPath = path.join(__dirname, '..', '_content', contentsRelativePath);

  if (ebookOutputPath === filePath) {
    throw new Error('[inline-source-code.js] EBook output path is the same as the ' +
      'source file.');
  }

  if (jekyllOutputPath === filePath) {
    throw new Error('[inline-source-code.js] Jekyll output path is the same as the ' +
      'source file.');
  }

  let inlinedContents = inlineSourceCode(relativePath, fileContents);

  log(chalk.blue('  Jekyll Output Path:') + ' ' + jekyllOutputPath);
  mkdirp.sync(path.parse(jekyllOutputPath).dir);
  fs.writeFileSync(jekyllOutputPath, inlinedContents);

  // This warps all images to use 'images/' instead of '/images/'
  inlinedContents = inlinedContents.replace(/\(\/images\//g, '(images/');

  // Write new File
  log(chalk.blue('  Ebook Output Path:') + ' ' + ebookOutputPath);
  mkdirp.sync(path.parse(ebookOutputPath).dir);
  fs.writeFileSync(ebookOutputPath, inlinedContents);

  log();
});

log(seperator);


function inlineSourceCode(relativePath, fileContents) {
  let inlineCount = 0;
  let regexResult = null;
  while(regexResult =
    /<%\s*include\(\s*'([^']*)'\s*(?:,\s*'([^']*)'\s*)?\)\s*%>/g.exec(fileContents)) {
    const fullRegexString = regexResult[0];
    const fileToInline = regexResult[1];
    const snippetToInline = regexResult[2];

    const fileToInlinePath = path.join(__dirname, '..', relativePath, fileToInline);
    log(chalk.magenta('  File to Inline:') + ' ' + fileToInlinePath);

    let highlightValue = '';
    const fileExtension = path.parse(fileToInlinePath).ext;
    switch(fileExtension) {
      case '.js':
        highlightValue = 'javascript';
        break;
      case '.json':
        highlightValue = 'json';
        break;
      case '.html':
        highlightValue = 'html';
        break;
      default:
        log(chalk.red('Unknown file extension: ' + fileExtension));
    }

    let codeContent = fs.readFileSync(fileToInlinePath).toString();
    codeContent = codeContent.replace(/^\s+|\s+$/g, '');
    if (snippetToInline) {
      // const snippetRegex = /\/\*\*\*\* START (.*) \*\*\*\*\/[\n]?((?:.|\s)*)\/\*\*\*\* END \1 \*\*\*\*\/[\n]?/g;
      // const regexString = `\\/\\*\\*\\*\\* START ${snippetToInline} \\*\\*\\*\\*\\/[\\n]?((?:.|\\s)*)\\/\\*\\*\\*\\* END ${snippetToInline} \\*\\*\\*\\*\\/[\\n]?`;
      const regexString = `\\/\\*\\*\\*\\* START ${snippetToInline} \\*\\*\\*\\*\\/[\\n]?([^]*)\\/\\*\\*\\*\\* END ${snippetToInline} \\*\\*\\*\\*\\/[\\n]?`;
      const snippetRegex = new RegExp(regexString, 'g');
      const snippetResult = snippetRegex.exec(codeContent);
      if (!snippetResult) {
        throw new Error('Unable to find snippet: ' + snippetToInline);
      }
      codeContent = snippetResult[1].trimRight();
    }
    let cleanupResult = null;
    while (cleanupResult = /.*\/\*\*\*\* (?:START|END) (.*) \*\*\*\*\/[\n]/g.exec(codeContent)) {
      codeContent = codeContent.replace(cleanupResult[0], '');
    };

    fileContents = fileContents.slice(0, regexResult.index) + '``` ' + highlightValue + '\n' +
      codeContent + '\n```' +
      fileContents.slice(regexResult.index + fullRegexString.length, fileContents.length);
    inlineCount ++;
  }

  if (inlineCount === 0) {
    log(chalk.magenta('  No Code Samples'));
  }

  return fileContents;
}
