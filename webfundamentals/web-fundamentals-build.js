const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const fs = require('fs-promise');
const yamlFrontMatter = require('yaml-front-matter');
const mustache = require('mustache');
const moment = require('moment');

const writeFile = (origFilePath, newFilePath) => {
  console.log('origFilePath: ', origFilePath);
  console.log('newFilePath: ', newFilePath);
  console.log('  ');

  return fs.readFile(origFilePath)
  .then((fileBuffer) => {
    return fileBuffer.toString();
  })
  .then((fileContents) => {
    const parsedContent = yamlFrontMatter.loadFront(fileContents);
    const frontMatterTmpl = fs.readFileSync(path.join(__dirname, 'front-matter.tmpl'));
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
    fs.writeFile(newFilePath, `${frontMatterString}${markdownContent}`);
  });
};

const buildWFVersion = () => {
  const rootOfProject = path.join(__dirname, '..');
  const webFundamentalsPath = path.join(rootOfProject, 'build', '_webfundamentals');

  mkdirp.sync(webFundamentalsPath);

  const files = glob.sync(path.join(rootOfProject, 'build', '_content', 'chapter-*', '*.md'), {
    ignore: path.join(rootOfProject, 'build', '_content', 'chapter-01', '*-introduction.md')
  });

  // This removes the chapter / page numbers from the files
  const fileWrites = files.map((markdownFile) => {
    const fileName = path.basename(markdownFile);
    const result = /\d\d-(.*)/g.exec(fileName);
    const newPath = path.join(webFundamentalsPath, result[1]);

    return writeFile(markdownFile, newPath);
  });

  return Promise.all(fileWrites)
  .then(() => {
    return fs.copy(
      path.join(rootOfProject, 'build', 'images'),
      path.join(webFundamentalsPath, 'images')
    );
  });
};

module.exports = buildWFVersion;
