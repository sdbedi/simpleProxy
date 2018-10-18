
var cluster = require('cluster');

// Code to run if we're in the master process; create workers for each CPU;replace dying workers
if (cluster.isMaster) {
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    const express = require("express");
    const bodyParser = require("body-parser");
    const routes = require("./routes/routes.js");
    const app = express();
    const https = require('https');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    routes(app);
    console.log('Worker %d running!', cluster.worker.id);
    const server = app.listen(3000, () => {
        console.log("app running on port.", server.address().port);
    });
}