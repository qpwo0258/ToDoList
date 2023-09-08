const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const getConnection = require('./db_config');

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let toDoLists = [];

app.get('/', (req, res) => {
    getConnection((conn) => {
        conn.query('select * from ToDoList', function (err, rows, fields) {
            if (err) {
                console.error('errer connectiong: ' + err.stack);
            }
            toDoLists = [];
            rows.forEach(row => {
                toDoLists.push(row.ToDo);
            });
            res.render('index', { toDoListTitle: '오늘의 할 일 : ' + toDoLists.length, toDoLists: toDoLists });
        });
    });
});

app.post('/add_list', (req, res) => {
    getConnection((conn) => {
        const newContent = req.body.content;
        console.log(newContent + " 추가");
        conn.query(`insert into ToDoList(ToDo) values ("?")`, [newContent], function (err, rows, fields) {
            if (err) {
                console.error('errer connectiong: ' + err.stack);
            }
            res.redirect('/');
        });
    });
});

app.get('/delete_list/:id?', (req, res) => {
    getConnection((conn) => {
        const deleteContent = req.params.id;
        console.log(deleteContent + '삭제');
        conn.query(`delete from ToDoList where ToDo="?"`, [deleteContent], function (err, rows, fields) {
            if (err) {
                console.error('errer connectiong: ' + err.stack);
            }
            res.redirect('/');
        });
    });
});

app.get('/open_update/:id', (req, res) => {
    res.render('update', { prevContent: req.params.id });
});

app.post('/update_list', (req, res) => {
    getConnection((conn) => {
        let prevContent = req.body.prevContent;
        let newContent = req.body.newContent;
        conn.query(`update ToDoList set ToDo="?" where ToDo="?"`, [newContent, prevContent]);
        console.log(prevContent + '을(를)' + newContent + '(으)로 수정');
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('connected');
});