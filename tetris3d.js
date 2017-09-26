'use strict';

const size = 10;
const tets = [];

class Tet {
  constructor(color, vector1, vector2, vector3) {
    this.color = color;
    this.limbs = [vector1, vector2, vector3];
    this.position = new p5.Vector(0, 0, 0);
  }
  rotate(axis) {
    const a = this.limbs[0];
    const b = this.limbs[1];
    const c = this.limbs[2];

    if (axis === 'X') {
      this.limbs[0] = new p5.Vector(a.x, a.z, -a.y);
      this.limbs[1] = new p5.Vector(b.x, b.z, -b.y);
      this.limbs[2] = new p5.Vector(c.x, c.z, -c.y);
    } else if (axis === 'Y') {
      this.limbs[0] = new p5.Vector(-a.z, a.y, a.x);
      this.limbs[1] = new p5.Vector(-b.z, b.y, b.x);
      this.limbs[2] = new p5.Vector(-c.z, c.y, c.x);
    } else if (axis === 'Z') {
      this.limbs[0] = new p5.Vector(a.y, -a.x, a.z);
      this.limbs[1] = new p5.Vector(b.y, -b.x, b.z);
      this.limbs[2] = new p5.Vector(c.y, -c.x, c.z);
    }
  }
  render() {
    fill(color(this.color), 120);
    directionalLight(color(this.color), 120, PI/4, PI/4, 0);
    // ambientLight(60, 90, 70, 9);
    // specularMaterial(120, 0, 0, 120);
    rotateX(PI/4);
    rotateY(PI/4);
    // rotateZ(PI/6);
    box(size, size, size);
    this.limbs.forEach((limb) => {
      push();
      // directionalLight(120, 120, 120, 120, PI/4, PI/4, PI/4);
      translate(size*limb.x, size*limb.y, size*limb.z);
      // specularMaterial(255, 0, 0, 120);
      // fill(color(this.color))
      box(size, size, size);
      pop()
    })
  }
}

const possibleTets = [
  () => {
    return new Tet('#0000ff', new p5.Vector(0, -1, 0), new p5.Vector(0, 1, 0), new p5.Vector(0, 2, 0))
  },
  () => {
    return new Tet('#ff0000', new p5.Vector(-1, 0, 0), new p5.Vector(0, 1, 0), new p5.Vector(1, 0, 0))
  },
  () => {
    return new Tet('#00ff00', new p5.Vector(0, 2, 0), new p5.Vector(0, 1, 0), new p5.Vector(1, 0, 0))
  },
  () => {
    return new Tet('#f5cc08', new p5.Vector(-1, 1, 0), new p5.Vector(0, 1, 0), new p5.Vector(1, 0, 0))
  },
  () => {
    return new Tet('#08f5be', new p5.Vector(0, 1, 0), new p5.Vector(1, 1, 0), new p5.Vector(1, 0, 0))
  },
  () => {
    return new Tet('#cd08fa', new p5.Vector(0, 0, -1), new p5.Vector(0, 1, 0), new p5.Vector(1, 1, 0))
  },
  () => {
    return new Tet('#aa4908', new p5.Vector(0, 1, -1), new p5.Vector(0, 1, 0), new p5.Vector(1, 0, 0))
  },
  () => {
    return new Tet('#4270af', new p5.Vector(0, 0, 1), new p5.Vector(0, 1, 0), new p5.Vector(1, 0, 0))
  },
]


function keyPressed() {
  console.log('KEY PRESSED:', key);

  if (key === 'A') tets.forEach(tet => tet.rotate('X'))

  if (key === 'S') tets.forEach(tet => tet.rotate('Y'))

  if (key === 'D') tets.forEach(tet => tet.rotate('Z'))
}

function setup(){
  createCanvas(800, 100, WEBGL);

  possibleTets.forEach(function(x) { tets.push(x()) });  

}

function draw() {
  background(0);
  // directionalLight(120, 120, 120, 120, PI/4, PI/4, PI/4);
  ambientLight(40, 40, 40)
  ortho();
  for (let i = 0; i < tets.length; i += 1) {
    push();
    translate(-350 + i * 100, 0, -50);
    tets[i].render();
    pop();
  }
}


