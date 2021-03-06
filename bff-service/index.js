const env = require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const mcache = require('memory-cache');
const { PORT = 8080 } = process.env;
const cacheConfig = {
    methods: /(GET|OPTIONS)/i,
    path: /products$/i,
    url: `${process.env.PRODUCTSERVICE}/products`
}

const cache = duration => {
    return async (req, res, next) => {
        try {
            if (cacheConfig.methods.test(req.method) && cacheConfig.path.test(req.url)) {
                let key = `${req.method}_${req.url}`;
                const cached = mcache.get(key);
                if (cached) {
                    console.log('Cache have been leveraged!')
                    res.set(cached.headers).status(cached.status).send(cached.data)
                    return
                } else {
                    const response = await axios({
                        method: req.method,
                        url: cacheConfig.url,
                    })
                    const { status, headers, data } = response;
                    if (status === 200) {
                        const store = { headers, data, status };
                        const result = mcache.put(key, store, duration * 1000);
                        console.log('The following data have just been Cached. \nKEY: |%o|\nVALUE:\n|%o|', key, JSON.stringify(result));
                    } else {
                        res.set(headers).status(status).send(data);
                    }
                }
            }
        } catch (error) {
            console.log('Error in Cache middleware: [%o]', JSON.stringify(error));
            res.set({ 'Access-Control-Allow-Origin': '*' }).status(500).send(error.message);
        } finally {
            next();
        }
    }
}

const validator = (req, res, next) => {
    const result = Object.keys(env.parsed).find(key => { return (new RegExp(`/${key}/`, 'i')).test(req.originalUrl) })
    result ? next() : res.status(502).send('Cannot process request');
}

const app = express();

app.use(morgan('dev'));
app.get('/info', (req, res, next) => {
    res.send('This is a PROXY, baby.')
});
app.use(validator);
app.use(cache(120));

Object.entries(env.parsed).forEach(([key, value]) => {
    console.log('KEY: [%o], VALUE: [%O]', key, value)
    app.use(`/${key.toLowerCase()}`, createProxyMiddleware({
        target: value,
        changeOrigin: true,
        hostRewrite: false,
        pathRewrite: {
            [`^/${key.toLowerCase()}`]: '',
        },
        onProxyRes: async (proxyRes, req, res) => {
            // console.log('PROXY_RES: [%o]', 'proxyRes');
        },
        onProxyReq: (proxyReq, req, res) => {
            // console.log('PROXY_REQ: [%o]', 'proxyReq');
        }
    }));
})

app.listen(PORT);