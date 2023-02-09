const puppeteer = require('puppeteer');
const pug = require('pug');

const render = async (opts) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.setContent(opts.content);
  const data = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
  });

  await browser.close();
  return data;
};

exports.renderFile = async (opts) => {
  try {
    const file = await render({
      content: pug.renderFile(opts.template, opts.render),
      size: 'A4',
      type: 'pdf',
      extension: 'pdf',
    })
    return file;
  } catch (e) {
    console.error(e);
  }
}
