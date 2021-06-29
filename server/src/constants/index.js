module.exports = {
  A_WEEK: 604800000,
  GITHUB_API: {
    BASE_URL: 'https://api.github.com',
    HEADERS: {
      ACCEPT: 'application/vnd.github.v3+json',
      ACCEPT_LUKE_CAGE: 'application/vnd.github.luke-cage-preview+json' // Use for branch protection API
    }
  },
  GITHUB_REPOSITORY_PERMISSIONS: {
    read: 'pull',
    write: 'push',
    admin: 'admin'
  },
  METRICS_QUERY_TIME_RANGE: '10s'
};
