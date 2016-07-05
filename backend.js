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
var empty_callback = function(err, data){
  if(err){console.log(err);}
  return;
}
var generic_callback = function (err, data) {
  if (err){console.log(err);return;}
  else{console.log(data);}
  return;
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection to mongoose, check");
});

var ElementSchema = new mongoose.Schema({
  name: String,
  jsonobj: Object
});

ElementSchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
  return;
}
ElementSchema.statics.removeElement = function(name){
  //remove all instances of name:daha and THEN log updated 
  //db contents after completed
  var self = this;
  this.remove({"name": name},function(){
    self.find({},empty_callback);
    return;
  });
  return;
}
ElementSchema.statics.printAll = function(){
  this.find({},generic_callback);
  return;
}
ElementSchema.statics.getAll = function(){

    var query = this.find({});
    
    return query;

}
ElementSchema.statics.addElement = function(name, jsonstring){
// writing to db
  var obj = {
              "name": name,
              jsonobj: JSON.parse(jsonstring)
            };

  //obj = JSON.parse(obj);
  //console.log(obj);
  var newElm = new Element(obj);

  newElm.save(function (err, entry) {
    if (err) return console.error(err);
    //entry.speak();
  });
  return newElm.id;
}


var Element = mongoose.model('Element', ElementSchema);





// var mystring = '{"cx":"0","cy":"0","r":"24","transform":"matrix(1,0,0,1,-45.29,114.66)"}';
//var myid = Element.addElement('blackcircle', mystring);
//Element.removeElement('blackcircle');
// var query ={
//   name: "blackcircle"
  //           type:"path",
  //           "jsonobj.path" :'M0,0L10,30L90,45L0,0',
  //           "jsonobj.fill" :'green', 
  //           "jsonobj.stroke":'black', 
  //           "jsonobj.strokeWidth":3
            // };

 //Element.find( query, generic_callback);




// var i = "noo way"

module.exports = mongoose.model('Element', ElementSchema);
