//provision the database
var mongoose = require ("mongoose"); // The reason for this demo.
var mongoURI = 'localhost:27017/node_template';
var uristring = process.env.MONGODB_URI || mongoURI;
mongoose.connect(uristring);
// mongoose.connect(uristring, function (err, res) {
//       if (err) {
//       console.log ('ERROR connecting to: ' + uristring + '. ' + err);} 
//       else {
//       console.log ('Succeeded connected to: ' + uristring);}
// });


//creating the db / setting up schema
var generic_callback = function (err, data) {
  if (err){console.log(err);}
  else{console.log(data);}
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection to mongoose, check");
});

var ElementSchema = new mongoose.Schema({
  name: String,
  type: String,
  jsonobj: Object
});

ElementSchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

ElementSchema.statics.removeDaha = function(){
  //remove all instances of name:daha and THEN log updated 
  //db contents after completed
  var self = this;
  this.remove({name: 'dahatree'},function(){
    self.find({},generic_callback);
  });
}

ElementSchema.statics.printAll = function(){
  this.find({},generic_callback);
  return 0;
}

ElementSchema.statics.addElement = function(jsonstring){
// writing to db
  var obj = {name: "dahatree",
            type:"path",
            jsonobj: {
                        path:'M0,0L10,30L90,45L0,0', 
                        fill:'green', 
                        stroke:'black', 
                        strokeWidth:3
                      } 
            };

  obj = JSON.parse(JSON.stringify(obj));
  console.log(obj);
  var newElm = new Element(obj);

  newElm.save(function (err, entry) {
    if (err) return console.error(err);
    entry.speak();
  });
  return newElm.id;
}



var Element = mongoose.model('Element', ElementSchema);

// var myid = Element.addElement(24);
// Element.removeDaha();

Element.printAll();


  var query ={name: "dahatsree",
              type:"path",
              "jsonobj.path" :'M0,0L10,30L90,45L0,0',
              "jsonobj.fill" :'green', 
              "jsonobj.stroke":'black', 
              "jsonobj.strokeWidth":3
              }

 Element.find( query, generic_callback);

// //console.log


// writing to db
// var newElm = new Element(
// {name: "daha",jsonobj: {cx: "24", cy: "24", r: "200", style: "opacity: 0.24;", fill: "#ffa500"}}
// );

// newElm.save(function (err, entry) {
//   if (err) return console.error(err);
//   entry.speak();
// });
//removing from database

var i = "noo way"

module.exports ={


 hithere: function(){console.log(i);}


}