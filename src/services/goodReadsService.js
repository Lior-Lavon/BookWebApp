const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodReadsService');

const parser = xml2js.Parser({ explicitArray: false });

const goorReadsService = () => {
  const getBookById = (id) => {
    const promise = new Promise((resolve, reject) => {
      axios.get('https://www.goodreads.com/book/show/656.xml?key=kSb5mMisz6F8EFgsw5UNg')
        .then((response) => {
          // const cleanedString = response.data.replace('\ufeff', '');
          parser.parseString(response.data, (err, result) => {
            if (err) {
              debug(err);
              reject(err);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((err) => {
          debug(err);
          reject(err);
        });
    });
    return promise;
  };

  return {
    getBookById
  };
};

module.exports = goorReadsService();