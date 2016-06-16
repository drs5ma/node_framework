

function eql_tri(x, y, a){
  var that = this;
  this.a = a;
  this.alt = this.a* Math.sqrt(3)/2.0;
  this.offsets =[[-1*a/2.0,0-(this.alt/3.0)],
                 [0,this.alt-(this.alt/3.0)],
                 [a/2.0,0-(this.alt/3.0)]];
  this.points =[[this.offsets[0][0]+x,this.offsets[0][1]+y],
                [this.offsets[1][0]+x,this.offsets[1][1]+y],
                [this.offsets[2][0]+x,this.offsets[2][1]+y]];
  return this.points;
}


var tricircle2 = function(x,y,r){

    this.x = x;
    this.y = y;
    this.points = eql_tri(x,y,2*r);
    this.radius = r; 
    this.group;
    this.mask;

    this.drawIt = function(){
      var background = paper.circle(x,y,r).attr({fill:"#fff"});
      var left = paper.circle(this.points[0][0], this.points[0][1], this.radius);
      var top = paper.circle(this.points[1][0], this.points[1][1], this.radius);
      var right = paper.circle(this.points[2][0], this.points[2][1], this.radius);
      this.group = paper.g(background,left,top,right);
      this.mask = paper.circle(x,y,r).attr({fill:"#0f0"});
      this.mask.attr({mask:this.group});
    }

    function format_transform(deg,x, y){
      return  'r' +String(deg)+ ','+ String(x)+ ',' +String(y) ;
    }

    function infRotate( el ,x ,y ) {
      el.transform(format_transform(0,x,y));
      el.animate({ transform: format_transform(360,x,y) }, 1000, mina.linear, function() { infRotate(el, x, y)} );
    }

    this.spin  = function () {
      infRotate(this.group, this.x, this.y);  
    }



    this.drawIt();
    this.spin();
    return this;
}

