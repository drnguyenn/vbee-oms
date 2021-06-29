const { Client } = require('@elastic/elasticsearch');

const { METRICS_QUERY_TIME_RANGE } = require('@constants');

const { ELASTICSEARCH_URL, ELASTIC_USERNAME, ELASTIC_PASSWORD } = process.env;

const client = new Client({
  node: ELASTICSEARCH_URL,
  auth: {
    username: ELASTIC_USERNAME,
    password: ELASTIC_PASSWORD
  }
});

const getServerMetrics = async macAddress => {
  const { body } = await client.search({
    index: 'metricbeat-*',
    pretty: true,
    body: {
      _source: [
        'host.cpu.pct',
        'system.memory.actual.used.pct',
        'host.network.in.bytes',
        'host.network.out.bytes'
      ],
      query: {
        bool: {
          filter: {
            term: {
              'host.mac': macAddress
            }
          },
          must: [
            {
              range: {
                '@timestamp': {
                  gte: `now-${METRICS_QUERY_TIME_RANGE}`,
                  lte: 'now'
                }
              }
            }
          ],
          should: [
            {
              range: {
                'host.cpu.pct': {
                  gte: 0
                }
              }
            },
            {
              range: {
                'system.memory.actual.used.pct': {
                  gte: 0
                }
              }
            },
            {
              range: {
                'host.network.in.bytes': {
                  gte: 0
                }
              }
            }
          ]
        }
      },
      size: 3
    }
  });

  const metrics = {
    cpuUsage: 0,
    memoryUsage: 0,
    networkIn: 0,
    networkOut: 0
  };

  body.hits.hits.forEach(({ _source }) => {
    if (_source.host && _source.host.cpu && _source.host.cpu.pct)
      metrics.cpuUsage = _source.host.cpu.pct * 100;
    else if (_source.system && _source.system.memory.actual.used.pct)
      metrics.memoryUsage = _source.system.memory.actual.used.pct * 100;
    else if (_source.host && _source.host.network) {
      metrics.networkIn = _source.host.network.in.bytes / 1024;
      metrics.networkOut = _source.host.network.out.bytes / 1024;
    }
  });

  return metrics;
};

module.exports = { getServerMetrics };
