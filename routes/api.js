const express = require('express')
const app = express.Router()
const { Pool } = require('pg')

const { differenceInMinutes } = require('date-fns')

require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode: 'require',
    rejectUnauthorized: false,
  }
});

app.get('/calendar', async (req, res) => {
  const { year, month, page } = req.query
  const client = await pool.connect();

  client.query(`SELECT task, start_date as "startDate", end_date as "endDate", description, is_logged as "isLogged", month, year, id, created_at as "createdAt" FROM calendar WHERE year = '${year}' AND month = INITCAP('${month}') ORDER BY start_date LIMIT 20 OFFSET ${page * 20}; SELECT count(*) from calendar WHERE year = '${year}' AND month = INITCAP('${month}');`, (err, result) => {
    if (err) throw err;

    client.release();

    res.json({
      data: result[0].rows,
      page: Number(page),
      pages: Math.ceil(result[1].rows[0].count / 20),
    })
  });
})


app.get('/tasks', async (req, res) => {
  const client = await pool.connect();

  client.query('SELECT DISTINCT task FROM calendar', (err, result) => {
    if (err) throw err;

    client.release();

    res.json(result.rows.map(({ task }) => task))
  });
})

app.get('/hours', async (req, res) => {
  const { year, month } = req.query
  const client = await pool.connect();

  client.query(`SELECT task, start_date as "startDate", end_date as "endDate" FROM calendar WHERE year = '${year}' AND month = INITCAP('${month}')`, (err, { rows }) => {
    if (err) throw err;

    client.release();

    console.log(differenceInMinutes)
  
    let minutes = 0
    let zenegy = 0

    for (var i = 0; i < rows.length; i += 1) {
      minDiff = differenceInMinutes(rows[i].endDate, rows[i].startDate)

      if (rows[i].task.toLowerCase() === 'zenegy') {
        zenegy += minDiff
      }

      minutes += minDiff
    }

    res.json({
      minutes: {
        minutesTotal: minutes,
        minutesZenegy: zenegy,
      }
    })
  });
})

app.post('/calendar', async (req, res) => {
  const { task, startDate, endDate, year, month, description, isLogged, createdAt } = req.body;
  // WHAT ABOUT POOLING? https://www.youtube.com/watch?v=GTeCtIoV2Tw&t=180s&ab_channel=HusseinNasser
  console.log(createdAt)
  const client = await pool.connect();

  client.query(`INSERT INTO calendar(task, start_date, end_date, description, month, year, is_logged, created_at) values('${task}', '${startDate}', '${endDate}', '${description}', '${month}', '${year}', ${isLogged}, '${createdAt}')`, (err, result) => {
    if (err) throw err;

    client.release();
    res.json({ message: 'Success' })
  });
})

module.exports = app