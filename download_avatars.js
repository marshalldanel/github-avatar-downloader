var request = require('request');

function getReqOptions (path) {
  return {
    url: 'https://api.github.com' + path,
    headers: {
      'User-Agent': 'pinkElephant'
    },
    qs: {
      access_token: process.env.GITHUB_ACCESS_TOKEN
    }
  };
}

function getRepoContributors(path, callback) {

  request(getReqOptions(path), function (error, response, body) {
    try {
      const data = JSON.parse(body);
      callback(data);
    } catch (err) {
      console.log('Failed to parse content body');
    }
  });
}

getRepoContributors(`/repos/${process.argv[2]}/${process.argv[3]}/contributors`, (data) => {
  data.forEach((contributor) => {
    console.log(contributor.avatar_url);
  });
});
