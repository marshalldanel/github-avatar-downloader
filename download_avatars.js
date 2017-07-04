var request = require('request');
var fs = require('fs');

// Get access to GitHub api
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

// First GET request to pull avartar urls from specified user and repo
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

// Second GET request to download all files and write to /avatars with unique filepaths
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

// Function call with 2 command line arguements and callback function
getRepoContributors(`/repos/${process.argv[2]}/${process.argv[3]}/contributors`, (data) => {
  data.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, 'avatars/' + contributor.login + '.jpeg');
  });
});