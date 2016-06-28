function turnover (cons, rand){return cons+Math.random()*rand;};


function bigfire(){}
bigfire.prototype = {
    init: function init(x,y){
      this.x = x;
      this.y = y;
      this.started = false;
      this.lifespan =10;
      this.radius = 100;
      this.timing = [500,500];
      this.particles = Snap.set();
      var i;

            for(i=0;i<this.lifespan;i+=1){
          //create circle
          //this.grp.add(particle);
          this.particles.push(paper.circle(this.x,this.y, 24).attr({fill: "orange",
                                                                strokeWidth: 3, 
                                                                opacity:0.4}));

          //set in motion
          
          //console.log(mystring);
          //
          // particle.animate({transform:myMatrix.toTransformString(), opacity:0.0}, rand_t, callback(i) );
          //particle.animate({fill:'red',opacity:0.0,r: 48, cx:rand_x, cy:rand_y },rand_t ,callback(i)  );
      }


      // this.begin();
    },
    // callback: function callback(a){
    //           var self = this;
    //           return function(){

    //                 self.particles[a].remove();

    //                 self.lifespan -= 1;
    //           }
      
    // },
    begin: function begin(){
      this.started = true;

      var self = this;
      var i;
      // function callback(a){
      //         return function(){

      //               self.particles[a].attr({
      //                       visibility: "hidden"
      //                   });
                    
      //               self.particles[a].matrix = null;
      //               //self.particles[a].remove();
      //               //console.log(self.particles[a]);
      //               //self.particles[a] = null;
      //               self.lifespan -= 1;
      //         }
      // }
      //var myMatrix = new Snap.Matrix();

      function decreaselifespan(){self.lifespan-=1;}
 for(i=0;i<this.lifespan;i+=1){

  var rand_x = Math.random()*this.radius*2 - this.radius  ;//+this.x ;
          var rand_y = Math.random()*this.radius*2  - this.radius;//+ this.y;
          //var rand_t = this.turnover(240,960);
          var rand_t = turnover(this.timing[0],this.timing[1]);
          
          
          //myMatrix = myMatrix.translate(rand_x, rand_y);

          //particle.animate({transform:myMatrix.toTransformString(), opacity:0.0}, rand_t, callback(i) );
          //myMatrix = null;
          var mystring  = 't'+rand_x+' '+rand_y+' s0 0';
          //var mystring  = 't'+rand_x+' '+rand_y;
          //this.particles[i].animate({transform:mystring }, rand_t ,self.callback(i) );
          //function(){self.lifespan -=1}
          this.particles[i].animate({transform:mystring }, rand_t ,decreaselifespan ) ;//self.callback(i) );
          //this.particles[i].animate({transform:mystring, opacity:0.0, r:0}, rand_t, function(){self.lifespan -=1;} ) ;//self.callback(i) );


      //self = null;
      //myMatrix = null;

    }
  },
    killme: function killme(){



      // this.grp.remove();
      // this.grp = null;

      var  i;
      for(i=this.particles.length-1;i>=0;i-=1){
        // this.grp[i].stop();
        // this.grp[i] = null;
        // this.grp.remove(this.grp[i]);
        //this.particles[i].stop();
        this.particles[i].remove();
        this.particles[i] = null;
        //this.particles.splice(i,1);
      }
      this.particles.clear();
      this.particles = null;


      // this.grp.stop();
      // this.grp.remove();
      // this.grp = null;
      // console.log(this.grp);
      
    },
    endafterdone: function endafterdone(){
      var self = this;
      setInterval(
        function(){
      self.killme();
    }, this.timing[0]+this.timing[1]);



    }
}



function screenFire(){}
screenFire.prototype = {


    init:function(freq){
      this.freq = freq;
      this.firelist =[];
      var self = this;

      this.make = setInterval(function(){ 
              var m =  new bigfire();

              m.init(Math.random()*vb[2]+vb[0],vb[1]+Math.random()*vb[3]);
              m.begin();

              self.firelist.push(m);

      }, this.freq);
      
      this.destroy = setInterval(function(){ 
              var i;        
              for(i=0;i<self.firelist.length;i+=1){
                if(self.firelist[i].lifespan==0){
                  self.firelist[i].killme();
                  self.firelist[i] = null;
                  self.firelist.splice(i,1);
                }
              }
      }, this.freq*2);


    },
    endme:function(){
      clearInterval(this.make);
      clearInterval(this.end);
      var i;        
      for(i=0;i<this.firelist.length;i+=1){
        this.firelist[i].killme();
        this.firelist[i] = null;
        this.firelist.splice(i,1);
      }

    }
}