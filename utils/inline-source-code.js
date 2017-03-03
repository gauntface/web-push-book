'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const yamlFrontMatter = require('yaml-front-matter');
const mustache = require('mustache');
const moment = require('moment');

const DEBUG = false;
const seperator = chalk.grey('------------------------------------------');
const rootOfProject = path.join(__dirname, '..');
const contentPath = path.join(rootOfProject, 'src', '_content');

const log = msg => {
  if (!DEBUG) {
    return;
  }

  if (!msg) {
    msg = '';
  }

  console.log(msg);
};

const inlineSourceCode = (relativePath, fileContents) => {
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

const removeWFTags = (contents, keepContent = true) => {
  const regex = /<%\s*START_WF_EXCLUSION\s*%>((?:(?:[a-z]*)\n(?:[\s\S]*?))*)<%\s*END_WF_EXCLUSION\s*%>/g
  return contents.replace(regex, (match, insideTags) => {
    if (!keepContent) {
      return '';
    }

    return insideTags;
  });
};

const writeJekyllVersion = (filePath, contents) => {
  log(chalk.blue('  Jekyll Output Path:') + ' ' + filePath);

  // Remove WF_EXTRACT THING
  contents = removeWFTags(contents);

  mkdirp.sync(path.parse(filePath).dir);
  fs.writeFileSync(filePath, contents);
};

const writeWFVersion = (filePath, contents) => {
  log(chalk.blue('  WF Output Path:') + ' ' + filePath);

  const parsedContent = yamlFrontMatter.loadFront(contents);
  const frontMatterTmpl = fs.readFileSync(path.join(__dirname, '..', 'webfundamentals', 'front-matter.tmpl'));
  const frontMatterString = mustache.render(frontMatterTmpl.toString(), {
    title: parsedContent.title,
    updatedOnDate: moment().format('YYYY-MM-DD'),
    author: 'mattgaunt'
  })

  let markdownContent = parsedContent.__content;

  // This swaps github backticks for four space indentation
  const githubCodeRegex = /```\s?([a-z]*)\n([\s\S]*?)\n```/g;
  const result = githubCodeRegex.exec(markdownContent);
  markdownContent = markdownContent.replace(githubCodeRegex, (match, language, code) => {
    const codeLines = code.split('\n');
    const codeWithSpaces = '\n    ' + codeLines.join('\n    ') + '\n';
    return codeWithSpaces;
  });

  // This swaps out /images/....jpg to ./images/.....jpg
  const imageRegex = /(!\[.*\]\()\/images\/(.*\))/g;
  markdownContent = markdownContent.replace(imageRegex, (match, imgStart, imgEnd) => {
    return `${imgStart}./images/${imgEnd}`;
  });

  let markdownLines = markdownContent.split('\n');
  markdownLines = markdownLines.map((line) => {
    if (line.length < 100) {
      return line;
    }

    const words = line.split(' ');
    let returnedResponse = '';
    let currentLine = words[0];
    for(let i = 1; i < words.length; i++) {
      const word = words[i];
      if (currentLine.length + word.length > 100) {
        returnedResponse += currentLine + '\n';
        currentLine = '';
      }

      currentLine += ' ' + words[i];
    }

    return returnedResponse + currentLine;
  });
  markdownContent = markdownLines.join('\n');

  markdownContent = removeWFTags(markdownContent, false);

  mkdirp.sync(path.parse(filePath).dir);
  fs.writeFileSync(filePath, `${frontMatterString}${markdownContent}`);
};


const writeEbookVersion = (filePath, contents) => {
  // Remove WF_EXTRACT THING
  contents = removeWFTags(contents);

  // This warps all images to use 'images/' instead of '/images/'
  contents = contents.replace(/\/images\/svgs\/(.*)\.svg/g, '/images/png-version/$1.png');
  contents = contents.replace(/\/images\//g, 'build/images/');

  // This fixes a latex issue when dealing with '\0' where backslash has
  // special meaning in latext
  contents = contents.replace(/'\\0\'/g, `'\textbackslash'`);

  // Write new File
  log(chalk.blue('  Ebook Output Path:') + ' ' + filePath);
  mkdirp.sync(path.parse(filePath).dir);
  fs.writeFileSync(filePath, contents);
};

const parseSingleFile = (filePath, ebookBuildPath, jekyllBuildPath, wfBuildPath) => {
  const fileContents = fs.readFileSync(filePath).toString();
  const relativePath = path.parse(path.relative(rootOfProject, filePath)).dir;
  const contentsRelativePath = path.relative(contentPath, filePath);

  const ebookOutputPath = path.join(ebookBuildPath, contentsRelativePath);
  const jekyllOutputPath = path.join(jekyllBuildPath, contentsRelativePath);

  // Remove integers for WF.
  const fileName = path.basename(contentsRelativePath);
  const result = /\d\d-(.*)/g.exec(fileName);
  const wfOutputPath = path.join(wfBuildPath, result[1]);

  if (ebookOutputPath === filePath) {
    throw new Error('[inline-source-code.js] EBook output path is the same as the ' +
      'source file.');
  }

  if (jekyllOutputPath === filePath) {
    throw new Error('[inline-source-code.js] Jekyll output path is the same as the ' +
      'source file.');
  }

  if (wfOutputPath === filePath) {
    throw new Error('[inline-source-code.js] WF output path is the same as the ' +
      'source file.');
  }

  let inlinedContents = inlineSourceCode(relativePath, fileContents);

  writeJekyllVersion(jekyllOutputPath, inlinedContents);

  writeEbookVersion(ebookOutputPath, inlinedContents);

  writeWFVersion(wfOutputPath, inlinedContents);

  log();
};

const parseContent = (ebookBuildPath, jekyllBuildPath, wfBuildPath) => {
  console.log();
  console.log(chalk.magenta('EBook Build Path: ') + ebookBuildPath);
  console.log(chalk.magenta('Jekyll Build Path: ') + jekyllBuildPath);
  console.log(chalk.magenta('WF Build Path: ') + wfBuildPath);
  console.log();
  console.log();

  try {
    let filePaths = glob.sync(path.join(contentPath, '/**/*.md'));
    filePaths.forEach(filePath => {
      log(seperator);
      log();

      log(chalk.blue('  File Path:') + ' ' + filePath);
      log();

      parseSingleFile(filePath, ebookBuildPath, jekyllBuildPath, wfBuildPath);

      log(seperator);
    });

    return Promise.resolve();
  } catch(err) {
    return Promise.reject(err);
  }
}

module.exports = parseContent;
