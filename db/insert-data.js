const MongoClient = require('mongodb').MongoClient;

checkEnvVar(process.env.DB_NAME, 'DB_NAME');
checkEnvVar(process.env.DB_COLLECTION, 'DB_COLLECTION');
const dbName = process.env.DB_NAME; 
const dbCollection = process.env.DB_COLLECTION;

const dbUri = 'mongodb://127.0.0.1:27017';
const dbClient = new MongoClient(dbUri, {useNewUrlParser: true});
const dbData = {index: "This is the DB string"};

console.log(`Connecting to ${dbUri}...`);
dbClient.connect()
  .then(() => {
    console.log("Success");
    console.log("Inserting data into database...");
    return dbClient.db(dbName).collection(dbCollection).insertOne(dbData);
  })
  .then(() => {
    console.log("Success");
    dbClient.close();
  })
  .catch(err => {
    dbClient.close();
    console.log(err);
    process.exit(1);
  });

function checkEnvVar(value, name) {
  if (!value)
    throw new Error(`Error: ${name} environment variable is not set`);
}
