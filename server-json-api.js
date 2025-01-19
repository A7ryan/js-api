// API -> CRUD using json file

const express = require('express');
const fs = require('fs');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();
const port = 7000;
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname)));

const  dataFilePath = path.join(__dirname,'data.json');

// Read data from File
function readFileData()
{
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
}

// Write data to File
function writeFileData(data)
{
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.get('/users', (req,res) => 
    {
        const users = readFileData();
        res.json(users);
    }
);


app.get('/users/:id', (req, res) =>
    {
        const users = readFileData();
        const userID = parseInt(req.params.id,10);
        const user = users.find(user => user.id === userID);
        if(user)
        {
            res.json(user);
        }
        else
        {
            res.status(404).json({error : 'User not Found..'});
        }
    }
);


app.post('/users', (req, res) =>
    {
        const users = readFileData();
        const newUser = 
        {
            id: users.length ? users[users.length-1].id + 1 : 1,
            name: req.body.name,
            email: req.body.email
        };
        users.push(newUser);
        writeFileData(users);
        res.status(201).json(newUser);
    }
);


app.put('/users/:id', (req, res) => 
    {
        const users = readFileData();
        const userID = parseInt(req.params.id,10);
        const userIndex = users.findIndex(user => user.id === userID);
        if(userIndex >= 0)
        {
            users[userIndex].name = req.body.name || users[userIndex].name;
            users[userIndex].email = req.body.email || users[userIndex].email;
            writeFileData(users);
            res.json(users[userIndex]);
        }
        else
        {
            res.status(404).json({error: 'User not Found!'});
        }
    }
);


app.delete('/users/:id', (req, res) => 
    {
        const users = readFileData();
        const userID = parseInt(req.params.id, 10);
        const newUser = users.filter(user => user.id !== userID);
        if(newUser.length !== users.length)
        {
            writeFileData(newUser);
            res.json({message: 'User Deleted..'});
        }
        else 
        {
            res.status(404).json({error: 'User not found!'});
        }
    }
);


app.listen(port,() =>
    {
        console.log(`App is running on Port http://localhost:${port}`);
    }
);
