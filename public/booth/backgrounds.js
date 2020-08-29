/// choose 3 backgrounds to start
// https://p5js.org/examples/simulate-penrose-tiles.html
// ported to class
// send a variable backData.choice, from client, to 

let f = 40;
let b = 590;





class PenroseLSystem {
    constructor() {

        this.steps = 0;
        //these are axiom and rules for the penrose rhombus l-system
        //a reference would be cool, but I couldn't find a good one
        this.axiom = "[X]++[X]++[X]++[X]++[X]";
        this.ruleW = "YF++ZF----XF[-YF----WF]++";
        this.ruleX = "+YF--ZF[---WF--XF]+";
        this.ruleY = "-WF++XF[+++YF++ZF]-";
        this.ruleZ = "--YF++++WF[+ZF++++XF]--XF";

        //please play around with the following two lines
        this.startLength = 460.0;
        this.theta = TWO_PI / 10.0; //36 degrees, try TWO_PI / 6.0, ...
        this.reset();
    }


    simulate(gen) {
        console.log('oooh were simulatin')
        while (this.getAge() < gen) {
            this.iterate(this.production);
        }
    }
    reset() {
        this.production = this.axiom;
        this.drawLength = this.startLength;
        this.generations = 0;
    }
    getAge() {
        return this.generations;
    }
    iterate() {
        let newProduction = "";

        for (let i = 0; i < this.production.length; ++i) {
            let step = this.production.charAt(i);
            //if current character is 'W', replace current character
            //by corresponding rule
            if (step == 'W') {
                newProduction = newProduction + this.ruleW;
            } else if (step == 'X') {
                newProduction = newProduction + this.ruleX;
            } else if (step == 'Y') {
                newProduction = newProduction + this.ruleY;
            } else if (step == 'Z') {
                newProduction = newProduction + this.ruleZ;
            } else {
                //drop all 'F' characters, don't touch other
                //characters (i.e. '+', '-', '[', ']'
                if (step != 'F') {
                    newProduction = newProduction + step;
                }
            }
        }

        this.drawLength = this.drawLength * 0.5;
        this.generations++;
        this.production = newProduction;

    }
    render() {
        push();
        translate(width / 2, height / 2);

        this.steps += 20;
        if (this.steps > this.production.length) {
            this.steps = this.production.length;
        }

        for (let i = 0; i < this.steps; ++i) {
            let step = this.production.charAt(i);

            //'W', 'X', 'Y', 'Z' symbols don't actually correspond to a turtle action
            if (step == 'F') {
                stroke(255, 60);
                for (let j = 0; j < this.repeats; j++) {
                    line(0, 0, 0, -this.drawLength);
                    noFill();
                    translate(0, -this.drawLength);
                }
                this.repeats = 1;
            } else if (step == '+') {
                rotate(this.theta);
            } else if (step == '-') {
                rotate(-this.theta);
            } else if (step == '[') {
                push();
            } else if (step == ']') {
                pop();
            }

        }
        pop();
    }
}

function noiseWave() {
    f++

    for (y = 0; y < b; y += 50) {
        beginShape()
        for (x = 0; x < b; ++x)
            vertex(x, y - 200 / (1 + pow(x - 150, 4) / 8e6) * noise(x / 30 + f / 500 + y))
        vertex(x + b, windowHeight / 2)
        vertex(x, y);
        endShape()
    }
}
class Particle {
    // setting the co-ordinates, radius and the
    // speed of a particle in both the co-ordinates axes.
    constructor() {
        this.x = random(0, width);
        this.y = random(0, height);
        this.r = random(1, 8);
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-1, 1.5);
    }

    // creation of a particle.
    createParticle() {
        noStroke();
        fill('rgba(200,169,169,0.5)');
        circle(this.x, this.y, this.r);
    }

    // setting the particle in motion.
    moveParticle() {
        if (this.x < 0 || this.x > width)
            this.xSpeed *= -1;
        if (this.y < 0 || this.y > height)
            this.ySpeed *= -1;
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    // this function creates the connections(lines)
    // between particles which are less than a certain distance apart
    joinParticles(particles) {
        particles.forEach(element => {
            let dis = dist(this.x, this.y, element.x, element.y);
            if (dis < 85) {
                stroke('rgba(255,255,255,0.04)');
                line(this.x, this.y, element.x, element.y);
            }
        });
    }
}

function setupParticle() {
    for (let i = 0; i < width / 10; i++) {
        particles.push(new Particle());
    }
}
// }

//https://www.openprocessing.org/sketch/917861

//https://www.openprocessing.org/sketch/683686
// // this class describes the properties of a single particle.