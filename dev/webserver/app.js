const http = require('http');
const MongoClient = require('mongodb').MongoClient;

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME; 
const dbCollection = process.env.DB_COLLECTION; 
checkEnvVar(dbUsername, 'DB_USERNAME');
checkEnvVar(dbPassword, 'DB_PASSWORD');
checkEnvVar(dbHost, 'DB_HOST');
checkEnvVar(dbName, 'DB_NAME');
checkEnvVar(dbCollection, 'DB_COLLECTION');

const dbUsernameSafe = encodeURIComponent(dbUsername);
const dbPasswordSafe = encodeURIComponent(dbPassword);

const port = 8080
// Connection URI: https://docs.mongodb.com/manual/reference/connection-string/
const dbUri = `mongodb://${dbUsernameSafe}:${dbPasswordSafe}@${dbHost}:27017`;

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

// Connect to database and get string to display
async function getStringFromDb(fun) {
  console.log(`Connecting to ${dbUri}...`);
  const dbClient = new MongoClient(dbUri, {useNewUrlParser: true});
  await dbClient.connect();
  const collection = dbClient.db(dbName).collection(dbCollection);
  const docs = await collection.find({data: {$exists: true}}).toArray();
  dbClient.close();
  if (docs.length < 1) throw new Error("String not found in database");
  return docs[0].data;
}

function checkEnvVar(value, name) {
  if (!value)
    throw new Error(`Error: ${name} environment variable is not set`);
}
