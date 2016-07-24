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
        this.lastB = this.b + 10;
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
    var ctx = canvas.getContext("2d");
    var ctxList = [];
    for (var k = 0; k <=255; k+=1) {
        ctxList.push("rgb("+k+","+k+","+k+")");
    }
    function renderStars(timestamp) {
        var brightList = [];
        for (var i = 0; i <=255; i+=1) {
            brightList.push([]);
        }
        ctx.clearRect(0,0, canvas.width, canvas.height);
        var theta = 2 * Math.PI * ((timestamp % 500000)/500000);

        starList.forEach(function(star) {
            var x = (star.r * Math.cos(theta+star.theta));
            var y = 0.55*(star.r * Math.sin(theta+star.theta));
            if (Math.abs(x) > screenW || Math.abs(y) > screenH) {
                return;
            }
            x += cX;
            y += cY;
            var rand = Math.random();
            if (rand < 0.125) {
                star.lastB = 10 + Math.floor( star.b * (0.25 + 6*rand) );
            }
            brightList[star.lastB].push([x,y]);
        });
        brightList.forEach(function(coordList, ind) {
            if (!coordList) {
                return;
            }
            ctx.fillStyle = ctxList[ind];
            coordList.forEach(function(coord) {
                ctx.fillRect(coord[0], coord[1], 1, 1);
            });
        });
    }
    function starLoop(timestamp) {
        renderStars(timestamp);
        window.requestAnimationFrame(starLoop);
    }
    starLoop(0);
})();
