const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');

const writeFile = (origFilePath, newFilePath) => {
  console.log('origFilePath: ', origFilePath);
  console.log('newFilePath: ', newFilePath);
  console.log('  ');
};

const buildWFVersion = () => {
  const rootOfProject = path.join(__dirname, '..');
  const webFundamentalsPath = path.join(rootOfProject, 'build', '_webfundamentals');

  mkdirp.sync(webFundamentalsPath);

  const files = glob.sync(path.join(rootOfProject, 'build', '_content', 'chapter-*', '*.md'), {
    ignore: path.join(rootOfProject, 'build', '_content', 'chapter-01', '*-introduction.md')
  });

  files.forEach((markdownFile) => {
    const fileName = path.basename(markdownFile);
    const result = /\d\d-(.*)/g.exec(fileName);
    const newPath = path.join(webFundamentalsPath, result[1]);

    writeFile(markdownFile, newPath);
  });

  return Promise.resolve();
};

module.exports = buildWFVersion;
