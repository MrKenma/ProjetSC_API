const Router = require("./routes");
const express = require('express');
const internalIp = require('internal-ip');
const cors = require('cors');

const app = express();
const port = 3001;
const internalIP = internalIp.v4.sync();

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.use(Router);

app.listen(port, internalIP,() => {
    console.log(`Example app listening at http://${internalIP}:${port}`);
});
