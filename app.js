const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const port = 8080;
const dbHost = 'db-service';
const dbUri = `mongodb://${dbHost}:27017`;

function handler (request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  getStringFromDb()
    .then(str => {
      response.writeHead(200);
      response.end(str);
    })
    .catch(err => {
      console.log(err)
      response.writeHead(500);
      response.end("Internal Server Error\n");
    });
}

http.createServer(handler).listen(port);
console.log(`Listening on port ${port}...`);

async function getStringFromDb(fun) {
  const dbClient = new MongoClient(dbUri, {useNewUrlParser: true});
  await dbClient.connect();
  const col = dbClient.db('html').collection('html');
  const docs = await col.find({index: {$exists: true}}).toArray();
  dbClient.close();
  if (docs.length < 1) throw new Error(`String not found in: ${docs}`);
  return docs[0].index;
}
