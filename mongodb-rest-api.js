const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 2900;
app.use(bodyparser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/mean_crud', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDb connected'))
    .catch((error) => console.log(`Error :`, error));

const itemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model('Item', itemSchema);

app.post('/items', (req, res) => {
    const newItem = new Item(req.body);
    newItem.save().then(item => res.json(item)).catch((error) => res.status(400).json(error));
});
app.get('/items', (req, res) => {
    Item.find().then(items => res.json(items))
        .catch((error) => res.status(400).json(error));
});
app.put('/items/:id', (req, res) => {
    Item.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(item => res.json(item))
        .catch((error) => res.status(400).json(error));
});
app.delete('/items/:id', (req, res) => {
    Item.findByIdAndDelete(req.params.id).then(() => res.json({ success: true }))
        .catch((error) => res.status(400).json(error));
});
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});
