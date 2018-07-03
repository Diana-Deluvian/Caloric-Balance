var mongoose   = require('mongoose'),
    express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser');

app.set('view engine', 'html');
app.use(express.static('./'));
var jsonParser = bodyParser.json()


var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);
app.use(urlencodedParser)
mongoose.connect('mongodb://diana:123abc@ds016108.mlab.com:16108/caloric_balance');


var calorieSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    gain: Boolean,
    added: {type: Date, default: new Date()}
});

var Calorie = mongoose.model('Calorie', calorieSchema);

var balanceSchema = new mongoose.Schema({
    total: Number,
    goal: Number
});

var Balance = mongoose.model('Balance', balanceSchema);

app.get('/calories', function(req, res){
    Calorie.find({}, function(err, calories){
        if(err){
            console.log(err);
        } else {
            console.log(calories);
            res.send(calories);
        }
    });
});

app.get('/', function(req, res){
     Calorie.find({}, function(err, calories){
        if(err){
            console.log('Error!');
        } else{
            balance = Balance.findOne();
            res.render('index', {calories:calories, balance:balance});
        }
    });
});

app.get('/total', function(req, res){
    Balance.findOne({}, function(err, balance){
        if(err){
            console.log(err);
        } else {
            console.log(balance);
            res.send(balance);
        }
    });

})

app.post('/Calories', function(req, res){
    Calorie.create(req.body, function(err, newCalorie){
        if(err){
            res.render('new');
        } else{
            Balance.findOne(function(err, balance){
                console.log(balance);
                if(err){console.log(err)}
                else {
                    console.log(newCalorie.amount, balance.total);
                    if(newCalorie.gain) balance.total+= newCalorie.amount;
                    else balance.total -= newCalorie.amount;
                    console.log(balance.total);
                   Balance.update({}, { total: balance.total}, function(err){
                        if(err) console.log(err)
                        else res.redirect('/');
                    });
                }
            })
        }
    });
});



app.listen(8080, function(){
    console.log('Server is running');
});