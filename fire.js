
function bigfire(){}
bigfire.prototype = {
    init: function(x,y){
      this.x = x;
      this.y = y;
      this.lifespan = 10;
      this.width = 10;
      this.radius = 100;
      this.turnover = function(cons, rand){return cons+Math.random()*rand;};
      this.grp = paper.g();
      this.particles =[];
      this.begin();
    },
    begin: function(){
      var i;
      var particle;
      function callback(a){
              return function(){
                    self.particles[a].attr({
                            visibility: "hidden"
                        });
                    self.particles[a].remove();
                    self.lifespan -= 1;

              }
      }
      for(i=0;i<this.width;i+=1){
          //create circle
          particle = paper.circle(this.x,this.y, 8).attr({fill: "orange",
                                                                strokeWidth: 3, 
                                                                opacity:0.4});
          this.grp.add(particle);
          this.particles.push(particle);
          //set in motion
          var rand_x = Math.random()*this.radius*2 + this.x - this.radius;
          var rand_y = Math.random()*this.radius*2 + this.y - this.radius;
          var rand_t = this.turnover(240,960);
          var self = this;
          
          particle.animate({fill:'red',opacity:0.1,r: 48, cx:rand_x, cy:rand_y },rand_t, function(){this.remove();}  );
          //particle.animate({fill:'red',opacity:0.1,r: 48, cx:rand_x, cy:rand_y },rand_t, callback(i)  );
      }
    },
    killme: function(){
      var  i;
      for(i=this.particles.length-1;i>=0;i-=1){
        this.particles[i].stop();
        this.particles[i] = null;
        this.particles.splice(i,1);
      }
      this.particles = null;
      // console.log(this.grp);
      this.grp.remove();
      this.grp = null;
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