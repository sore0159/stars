(function() {
    // CONFIG VARIABLES //
    // Default to 100, lower them to increase performance //
    var PERFORMANCE = 100;  // Lower this number to decrease stars rendered

    function Star(x, y, b) {
        if (b === 3) {
            this.b = 200;
        } else if (b === 2) {
            this.b = 100;
        } else if (b === 1) {
            this.b = 50;
        } else {
            this.b = 25;
        }
        b = this.b + 10;
        this.lastStr = "rgb("+b+","+b+","+b+")";
   
        x = x || 0;
        y = y || 0;
        if (x === 0 && y === 0) {
            this.theta = 0;
            this.r = 0;
            return;
        }
        this.r = Math.sqrt(x*x + y*y);
        var cosT = x / this.r;
        if (x < 0 && y < 0) {
            this.theta = Math.PI + Math.acos(-cosT);
        } else if (x < 0) {
            this.theta = Math.PI - Math.acos(-cosT);
        } else if (y < 0) {
            this.theta = 2 * Math.PI - Math.acos(cosT);
        } else {
            this.theta = Math.acos(cosT);
        }
    }
    Star.prototype.sameSpot = function(star2) {
        var dr = this.r - star.r;
        var dt = this.theta - star2.theta;
        return (dr < 0.00002 && dt < 0.00002); 
    };
    Star.prototype.setFill = function(ctx) {
        var rand = Math.random();
        if (rand < 0.125) {
            rand = rand * 2;
            var bUse = 10 + Math.floor( this.b * (0.25 + 3*rand) );
            this.lastStr = "rgb("+bUse+","+bUse+","+bUse+")";
        }
        ctx.fillStyle = this.lastStr;
    };

    var canvas = document.getElementById("starscape");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (PERFORMANCE <= 0) {
        return;
    } else if (PERFORMANCE > 100) {
        PERFORMANCE = 100;
    }
    var screenW = canvas.width;
    var screenH = canvas.height;

    var cX = Math.floor(canvas.width / 2);
    var cY = Math.floor(canvas.height / 2);
    var rad = (screenW > screenH) ? screenW/2: screenH/2;
    rad *= 4;
    console.log("RAD", rad, "SW, SH", screenW, screenH);
    var starList = [];
    var starSet = new Set();
    for (var j = 3; j >= 0; j-=1 ) {
        var density;
        if (j === 0) {
            density = 0.00625;
        } else if (j === 1) {
            density = 0.003125;
        } else if (j === 2) {
            density = 0.0015625;
        } else if (j === 3) {
            density = 0.00038125;
        //density = 0.00078125;
        }
        density *= PERFORMANCE/100;
        var numStars = density * rad * rad;
        for (var i = 0; i < numStars; i++) {
            var x = (0.5 - Math.random())*rad;
            var y = (0.5 - Math.random())*rad;
            var key = ""+Math.floor(x)+","+Math.floor(y);
            if (starSet.has(key)) {
                continue;
            }
            starSet.add(key);
            var star = new Star(x, y, j);
            starList.push(star);
        }
    }
    function renderStars(timestamp) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, canvas.width, canvas.height);
        var theta = 2 * Math.PI * ((timestamp % 500000)/500000);
        starList.forEach(function(star) {
            //var x = cX + (star.r * Math.cos(theta+star.theta));
            //var y = cY + 0.55 * (star.r * Math.sin(theta+star.theta));
            //if (x < 0 || x > screenW || y < 0 || y > screenH) {
            var x = (star.r * Math.cos(theta+star.theta));
            var y = 0.55*(star.r * Math.sin(theta+star.theta));
            if (Math.abs(x) > screenW || Math.abs(y) > screenH) {
                return;
            }
            x += cX;
            y += cY;
            star.setFill(ctx);
            ctx.fillRect(x, y, 1, 1);
        });
    }
    function starLoop(timestamp) {
        renderStars(timestamp);
        window.requestAnimationFrame(starLoop);
    }
    starLoop(0);
})();
