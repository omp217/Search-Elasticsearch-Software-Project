// Bring all documents from index post

GET /post/_search
{
  "query": {
    "match_all": {}
  }
}

// Get all post where any filed contains spiderman

GET /post/_search
{
  "query": {
    "match": {
      "description": "spiderman"
    }
  }
}

// Analyze the analyzer

GET /post2/_analyze
{
  "analyzer": "query_analyzer",
  "text": "Dhoni"
}

// Get maping of index post

GET /post/_mapping

GET /post/_settings

GET /post/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "MS Dhoni",
              "boost": 3
            }
          }
        },
        {
          "match": {
            "description": {
              "query": "MS Dhoni",
              "boost": 2
            }
          }
        },
        {
          "nested": {
            "path": "comments",
            "query": {
              "match": {
                "comments.comment": "MS Dhoni"
              }
            },
            "inner_hits": {
              "highlight": {
                "fields": {
                  "comments.comment": {
                    "fragment_offset": 0,
                    "number_of_fragments": 0
                  }
                }
              }
            }
          }
        }
      ]
    }
  },
  "highlight": {
    "fields": {
      "description": {
        "fragment_offset": 0,
        "number_of_fragments": 0
      }
    }
  }
}

PUT post
{
    "settings": {
        "analysis": {
            "analyzer": {
                "content_analyzer": {
                    "char_filter": [
                        "html_strip"
                    ],
                    "tokenizer": "standard",
                    "filter": [
                        "asciifolding",
                        "lowercase",
                        "stop",
                        "trim",
                        // "keyword_repeat",
                        "stemmer",
                        // "unique"
                    ]
                },
                "query_analyzer": {
                    "char_filter": [
                        "html_strip"
                    ],
                    "tokenizer": "standard",
                    "filter": [
                        "asciifolding",
                        "lowercase",
                        "stop",
                        "trim",
                        "keyword_repeat",
                        "stemmer",
                        // "unique",
                        "my_edge_filter",
                        // "my_ngram_filter"
                    ]
                }
            },
            "filter": {
                "my_edge_filter": {
                    "type": "edge_ngram",
                    "min_gram": 1,
                    "max_gram": 20 // Set maximum ngram length
                },
                "my_ngram_filter": {
                    "type": "ngram",
                    "min_gram": 2,
                    "max_gram": 3 // Set maximum ngram length
                }
            },
        }
    },
    "mappings": {
        "properties": {
            "user_id": {
                "type": "keyword"
            },
            "title": {
                "type": "text",
                "analyzer": "query_analyzer",
                "search_analyzer": "query_analyzer"
            },
            "description": {
                "type": "text",
                "analyzer": "content_analyzer",
                "search_analyzer": "query_analyzer"
            },
            "comments": {
                "type": "nested",
                "properties": {
                    "user_id": {
                        "type": "keyword"
                    },
                    "comment": {
                        "type": "text",
                        "analyzer": "content_analyzer",
                        "search_analyzer": "query_analyzer"
                    }
                }
            },
            "likes": {
                "type": "nested",
                "properties": {
                    "user_id": {
                        "type": "keyword"
                    }
                }
            }
        }
    }
}

POST _reindex
{
  "source": {
    "index": "post2"
  },
  "dest": {
    "index": "post"
  }
}

// DELETE /post

// Delete the index post

DELETE /post

// Get the mappings of index post

GET /post2/_settings

// Get all post of post2

