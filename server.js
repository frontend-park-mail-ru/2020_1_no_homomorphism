const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
const root = path.resolve(__dirname, 'static');

// app.use('/static', express.static('static'));
app.use( express.static(root));
// app.use(express.static(__dirname + '/static'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), function(err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {error: err});
});

app.listen(3000);
