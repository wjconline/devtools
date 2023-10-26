import http from 'http';
import fs from 'fs';
import path from 'path';
import { existsSync } from 'fs';
import {serverConfig} from './config/serverConfig.js';

let appConfig = serverConfig;

function startServer () {
    console.log('updated appConfig', appConfig);

    http.createServer(function (request, response) {
        console.log('request ', request.url);

        // const rootPath = '/Users/Shared/data/code/098_devtools/devtools';
        const rootPath = appConfig.ROOT_PATH;
        let filePath = rootPath + request.url.split('?')[0];
        // let filePath = rootPath + request.url;
        // const siteIndexPath = rootPath + '/index.html';
        const siteIndexPath = rootPath + appConfig.INDEX_PAGE;
        if (request.url == '/') {
            // if (filePath == './') {
            // if (filePath == './../../') {
            // filePath = '/testindex.html';
            filePath = siteIndexPath;
        }
        // refactor to lok for index.html in each folder if ends in "/" e.g. "...a11y/"
        console.log('filePath ', filePath);

        var extname = String(path.extname(filePath)).toLowerCase();

        var mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.ico': 'image/x-icon',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        let contentType = mimeTypes[extname] || 'application/octet-stream';

// WoDo: Clean up console logging (incl commented out)
        fs.readFile(filePath, (error, content) => {
//            console.log('start initial readFile error ', error);
            if (error) {
//                console.log('error obj', error, '\n');
                console.log('readFile error; message:', error.message, '\n');
// `${msg}`
                switch(error.code) {
                    case 'ENOENT':
                        fs.readFile('./404.html', function(error, content) {
                            response.writeHead(404, { 'Content-Type': 'text/html' });
                            response.end(content, 'utf-8');
                        });
                        break;
                    case 'EISDIR':
                        let initialError = error;
                        console.log('Path is a directory: '+error.code);

                        // WoDo: Should try and redirect here instead? look up how to handle default index.html loading
                        fs.readFile(filePath + '/index.html', (error, content) => {
                            if (error) {
                                // console.log('start index.html readFile filePath', filePath);
                                // console.log('start index.html readFile error ', initialError);
                                console.log('Path is a directory; no index.html available: ' + initialError.code+'\n');
                                response.writeHead(404, {'Content-Type': 'text/html'});
                                response.end('Path is a directory; no index.html available: ' + initialError.code + ' ..\n', 'utf-8');
                            }  else {
                                console.log('Path is a directory; index.html found and served.\n');
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                response.end(content, 'utf-8');
                            }
                        });

                        break;
                    default:
                        response.writeHead(500);
                        // no such file or directory
                        response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });

    }).listen(1337);
    console.log('Server running at http://127.0.0.1:1337/');
}

if (existsSync('./config/localConfig.js')) {
    console.log('loading Local Config...');
    import('./config/localConfig.js')
        .then((localConfig) => {
            appConfig =  { ...serverConfig, ...localConfig.localConfig };
            startServer();
        });
} else {
    console.log('Local Config does not exist.');
    startServer();
}
