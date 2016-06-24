function turnover (cons, rand){return cons+Math.random()*rand;};


function bigfire(){}
bigfire.prototype = {
    init: function init(x,y){
      this.x = x;
      this.y = y;
      this.lifespan =10;
      this.radius = 100;
      this.particles = Snap.set();
      var i;

            for(i=0;i<this.lifespan;i+=1){
          //create circle
          //this.grp.add(particle);
          this.particles.push(paper.circle(this.x,this.y, 48).attr({fill: "orange",
                                                                strokeWidth: 3, 
                                                                opacity:0.4}));
          //set in motion
          
          //console.log(mystring);
          //
          // particle.animate({transform:myMatrix.toTransformString(), opacity:0.0}, rand_t, callback(i) );
          //particle.animate({fill:'red',opacity:0.0,r: 48, cx:rand_x, cy:rand_y },rand_t ,callback(i)  );
      }


      this.begin();
    },
    callback: function(a){
              var self = this;
              return function(){

                    // self.particles[a].attr({
                    //         visibility: "hidden"
                    //     });
                    //console.log(self.grp[a]);
                    //console.log(self.grp[0]);
                    //self.grp[a].matrix = null;
                    self.particles[a].matrix = null;
                    self.particles[a].remove();
                    //console.log(self.particles[a]);
                    //self.particles[a] = null;
                    self.lifespan -= 1;
              }
      
    },
    begin: function begin(){
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

 for(i=0;i<this.lifespan;i+=1){

  var rand_x = Math.random()*this.radius*2 - this.radius  ;//+this.x ;
          var rand_y = Math.random()*this.radius*2  - this.radius;//+ this.y;
          //var rand_t = this.turnover(240,960);
          var rand_t = turnover(500,250);
          
          
          //myMatrix = myMatrix.translate(rand_x, rand_y);

          //particle.animate({transform:myMatrix.toTransformString(), opacity:0.0}, rand_t, callback(i) );
          //myMatrix = null;
          var mystring  = 't'+rand_x+' '+rand_y;

          this.particles[i].animate({transform:mystring, opacity:0.0}, rand_t) ;//self.callback(i) );
          

      //self = null;
      //myMatrix = null;

    }
  },
    killme: function killme(){


      // var  i;
      // for(i=this.particles.length-1;i>=0;i-=1){
      //   // this.grp[i].stop();
      //   // this.grp[i] = null;
      //   // this.grp.remove(this.grp[i]);
      //   //this.particles[i].stop();
      //   this.particles[i].remove();
      //   this.particles[i] = null;
      //   //this.particles.splice(i,1);
      // }
      this.particles.clear();
      this.particles = null;
      // this.grp.stop();
      // this.grp.remove();
      // this.grp = null;
      // console.log(this.grp);
      
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