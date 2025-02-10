const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const activitiesRoutes = require('./routes/activities');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/activities', activitiesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});