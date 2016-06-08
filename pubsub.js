(function(exports){



	var topics_to_subscribers = {};


	exports.subscribe = function(topic, fn){

		if(!(topic in topics_to_subscribers)){
			topics_to_subscribers[topic] = [];
		}
		topics_to_subscribers[topic].push(fn);

	};

	exports.broadcast = function(topic, data){
		var i;
		var relevant = topics_to_subscribers[topic];
		for(i=0;i<relevant.length;i+=1){
			relevant[i](data);
		}
	};

    // your code goes here

   exports.test = function(){
        
   		return "helloworld24";


    };





})(typeof exports === 'undefined'? this['pubsub']={}: exports);