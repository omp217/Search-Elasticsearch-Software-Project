var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    // 'http://omp217:abcded@localhost:9200/'
  ]
});

module.exports = client;