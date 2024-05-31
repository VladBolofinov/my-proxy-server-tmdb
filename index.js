const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: true,
}));

// Прокси настройка
app.use('/3', proxy('https://api.themoviedb.org', {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjY5NGFhZGIyNWFiZWEyNDFjZjY4MWYxNDI3NGY1MSIsInN1YiI6IjY2NTYxMWI3MTVmYTJiNDYzODcwNzU2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.llQ_n_twbEcs4VpEz5kQ6FlrYOEERvy9TOAQ9AuTc1s';
        proxyReqOpts.headers['accept'] = 'application/json'
        return proxyReqOpts;
    },
    proxyReqPathResolver: function(req) {
        return `/3${req.url}`;
    },
    https: true
}));

// Дополнительная проверка ошибок
app.use('/3', (err, _req, res, _next) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error: ' + err.message);
});

// Слушаем порт
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});