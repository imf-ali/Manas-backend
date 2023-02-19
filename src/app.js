const express = require('express');
const cors = require('cors');
require('./db/mongoose')
const adminRouter = require('./routers/admin');
const studentRouter = require('./routers/student')
const commonRouter = require('./routers/common')

const app = express();
app.use(express.json());
app.use(cors());
app.use(adminRouter);
app.use(studentRouter);
app.use(commonRouter);

port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
})
