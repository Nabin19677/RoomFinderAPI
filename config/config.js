module.exports = {
    port : 3000,
    url : 'mongodb://localhost:27017/RoomFinder',
    mongoOnCloudUrl : "mongodb://nabin19677:wwe19677@roomfindercluster-shard-00-00-q3cpd.mongodb.net:27017,roomfindercluster-shard-00-01-q3cpd.mongodb.net:27017,roomfindercluster-shard-00-02-q3cpd.mongodb.net:27017/test?ssl=true&replicaSet=RoomFinderCluster-shard-0&authSource=admin&retryWrites=true",
    hashingSecret : 'staging process',
    jwtSecret : 'It is our jwt secret'
};