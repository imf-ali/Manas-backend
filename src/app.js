const express = require('express');
const cors = require('cors');
require('./db/mongoose')
const adminRouter = require('./routers/admin');
const studentRouter = require('./routers/student')
const commonRouter = require('./routers/common')
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: false, parameterLimit: 1000000 }));
app.use(cors());
app.use(adminRouter);
app.use(studentRouter);
app.use(commonRouter);

port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
})
