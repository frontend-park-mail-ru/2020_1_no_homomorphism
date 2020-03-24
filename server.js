const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const nunjucks = require('nunjucks');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(__dirname));
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    web: {
        async: true,
    },
});
const loader = nunjucks.WebLoader ? new nunjucks.WebLoader('/views', {async: true, useCache: true}) : undefined;
const env = new nunjucks.Environment(loader);
nunjucks.precompile('views', {env: env});


app.get('/', (req, res) => {
    res.render('templates/base');
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
