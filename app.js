const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const database = module.exports = () => {
    const connectionsParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    try {
        console.log("Database connected succesfully");
        mongoose.connect("mongodb+srv://Ilzbergs:korn6171620@cluster0.jwzczxn.mongodb.net/test");
    }
    catch (error) {
        console.log(error);
        console.log("Database connection failed");
    }
};

database();

const itemsSchema = {
    name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: 'Welcome to your todolist'
});
const item2 = new Item({
    name: 'Hit the + button to add a new ToDo'
});
const item3 = new Item({
    name: '<--Hit this to delete ToDo'
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Success");
    }
});

app.get('/', function (req, res) {
    // let day = date.getDate();
    Item.find({}, function (err, foundItems) {
        if (foundItems.lenght === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success");
                }
            });
            res.redirect('/');
        } else {
            res.render('list', { listTitle: 'Today', newListItems: foundItems });
        }
    });

});
app.post('/', function (req, res) {
    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect('/');
});

app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (!err) {
            console.log('Successfylly deleted');
            res.redirect('/')
        }
    })
});

app.get('/work', function (req, res) {
    res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.get('/about', function (req, res) {
    res.render('about');
});



app.listen(3000, function (req, res) {
    console.log('Server running on port 3000!');
});