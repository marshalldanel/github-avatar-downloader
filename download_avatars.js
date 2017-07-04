var request = require('request');
var fs = require('fs');

function getRequestOptions (path) {
  return {
    url: 'https://api.github.com' + path,
    headers: {
      'User-Agent': 'pinkElephant'
    },
    qs: {
      accessToken: process.env.GITHUB_ACCESS_TOKEN
    }
  };
}

function getRepoContributors(path, callback) {
  request(getRequestOptions(path), function (error, response, body) {
    try {
      const data = JSON.parse(body);
      callback(data);
    } catch (err) {
      console.log('Failed to parse content body');
    }
  });
}

function downloadImageByURL(url, filepath) {
  request.get(url)
    .on('error', function (err) {
      console.log('Failed to download');
      throw err;
    })
    .on('response', function (response) {
      console.log('Download complete');
    })
    .pipe(fs.createWriteStream(filepath))
    .end('response', function (response) {
      console.log('Downloading images...');
    });
}

getRepoContributors(`/repos/${process.argv[2]}/${process.argv[3]}/contributors`, (data) => {
  data.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.jpeg');
  });
});
