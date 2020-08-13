const { Pool } = require("pg")

const dbUser = "postgres"
const dbHost = "localhost"
const dbDatabase = "ass-5"
const dbPassword = "-"
const dbPort = "5432"

const connectionPool = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;

const pool = new Pool({
    connectionString: connectionPool
})

if (pool) {
    console.log("connected")
}

module.exports = { pool };