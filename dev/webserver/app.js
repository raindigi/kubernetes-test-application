const http = require('http');
const MongoClient = require('mongodb').MongoClient;

// Check and read required environment variables
const dbUsername = checkEnvVar('MONGODB_USERNAME');
const dbPassword = checkEnvVar('MONGODB_PASSWORD');
const dbHost = checkEnvVar('MONGODB_HOST');
const dbDatabase = checkEnvVar('MONGODB_DB');
const dbCollection = checkEnvVar('MONGODB_COLLECTION');

// MongoDB connection URI string (https://docs.mongodb.com/manual/reference/connection-string)
const dbUsernameSafe = encodeURIComponent(dbUsername);
const dbPasswordSafe = encodeURIComponent(dbPassword);
const dbUri = `mongodb://${dbUsernameSafe}:${dbPasswordSafe}@${dbHost}:27017`;

// Web server
const port = 8080
function handler (request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  console.log("Getting string from database");
  getStringFromDb()
    .then(str => {
      console.log(`Returning "${str}"`);
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
console.log(`Listening on port ${port}`);

// Connect to database and retrieve pre-defined string
async function getStringFromDb(fun) {
  const dbClient = new MongoClient(dbUri, {useNewUrlParser: true});
  await dbClient.connect();
  const collection = dbClient.db(dbDatabase).collection(dbCollection);
  const docs = await collection.find({data: {$exists: true}}).toArray();
  dbClient.close();
  if (docs.length < 1) throw new Error("String not found in database");
  return docs[0].data;
}

// Assert that the specified environment variables is set and return its value
function checkEnvVar(name) {
  if (!process.env[name])
    throw new Error(`Error: ${name} environment variable is not set`);
  else
    return process.env[name];
}
