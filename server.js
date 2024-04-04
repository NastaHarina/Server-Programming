const fs = require('fs'); // node-модуль для работы с файловой системой сервера
const express = require('express') // подключаем express-библиотеку в наше серверное приложение
const path = require('path'); 

const app = express() // мы создаем экземпляр сервера express
const port = 3000 // задали порт 

const logger = (req, res) => {
    fs.appendFile('./log.txt', `${new Date(Date.now())} - ${req.socket.remoteAddress} - ${req.originalUrl} - ${res.statusCode}\n`, (err) => {
        if (err) {
          console.error(err);
        } else {
          // done!
        }
    });
}

const getFiles = (dir, files_) => {
	files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (let i in files){
        const name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
};

const static = path.join(__dirname, 'static') // создаем путь к папке static 
const staticMeta = path.join(__dirname, './static/CSS Zen Garden_ The Beauty of CSS Design_files'); 


app.get('/hello', (req, res) => {
  req.status = 200
  res.end('Hello World!');
  logger(req, res);
}) // мы добавили в наше приложение обработку route 

app.get('/:file', (req, res) => {
    const fetchedFile = req.params.file;
    console.log(fetchedFile);
    const files = getFiles('./static');
    if (!files) {
        req.statusCode = 500
        res.end('Внутрення ошибка сервера');
        throw new Error('Папки static нет или в ней нет файлов');
    }
    const fileName = path.join(static, fetchedFile);
    fs.readFile(fileName, function (error, data) {
        if (error) {
            req.statusCode = 404;
            res.end('Файл не найден!');
            logger(req, res);
        } else {
            res.end(data);
            logger(req, res);
        }
    });
});
app.get('/CSS%20Zen%20Garden_%20The%20Beauty%20of%20CSS%20Design_files/:file', (req, res) => {
    const fetchedFile = req.params.file;
    console.log(fetchedFile);
    const files = getFiles('./static');
    if (!files) {
        req.statusCode = 500
        res.end('Внутрення ошибка сервера');
        throw new Error('Папки static нет или в ней нет файлов');
    }
    const fileName = path.join(staticMeta, fetchedFile);
    console.log(fileName);
    fs.readFile(fileName, function (error, data) {
        if (error) {
            req.statusCode = 404;
            res.end('Файл не найден!');
            logger(req, res);
        } else {
            res.end(data);
            logger(req, res);
        }
    });
});
// мы добавили в наше приложение обработку route /files

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) // включили прослушивание запросов нашим сервером заданного порта 
