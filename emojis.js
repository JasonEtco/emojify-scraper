const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

function download(uri, filename, callback) {
  console.log(uri);
  request.head(uri, (err, res, body) => {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(path.join(__dirname, 'images', filename))).on('close', callback);
  });
};

const url = 'http://emojipedia.org/microsoft/windows-10-anniversary-update/';

request(url, (err, resp, body) => {
  $ = cheerio.load(body);
  const images = $('.emoji-grid img');

  $(images).each((i, img) => {
    const url = $(img).attr('data-src');
    const alt = $(img).attr('alt');

    if (url !== undefined && alt !== undefined) {
      download(url, `${alt}.png`, () => console.log(i));
    }
  });
});
