const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
const root = path.resolve(__dirname, 'static');

app.use( express.static(root));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), function(err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', {error: err});
});

app.listen(3000);
