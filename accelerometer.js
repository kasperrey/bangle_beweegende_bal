var x = 100;
var y = 100;
var x_v = true;
var y_v = true;
var positionBal = {"x": 0, "y": 0, "z": 0};

const muren_str = [
  [".", ".", ".", ".", ".", ".", ".", ".", ".", "#", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", "#", ".", "#", "#", "#", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", "#", ".", ".", ".", "#", ".", "#", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "#", "#", "#", ".", ".", ".", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", "#", "#", "#", "#", ".", "#", ".", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", ".", ".", ".", "#", "#", "#", ".", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", ".", "#", ".", ".", ".", ".", ".", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", ".", "#", "#", ".", "#", "#", "#", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", ".", ".", "#", ".", "#", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", ".", ".", "#", ".", "#", "#", "#", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "#", "#", "#", "#", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#", "#", "#", "#", "#", "#"],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]
];

var muren = [];


class Botsen {
  botsMetRectCircel(x1, y1, x2, y2, x_r, y_r, r) {
    var dist_x = (x1+5 - x_r);
    var dist_y = (y1+5 - y_r);
    var distance = Math.sqrt((dist_x * dist_x) + (dist_y * dist_y));
    var een_x = dist_x/distance;
    var een_y = dist_y/distance;
    var point_x = (x_r+(een_x*r));
    var point_y = (y_r+(een_y*r));
    return this.botsMetRectPoint(x1, y1, x2, y2, point_x, point_y);
  }

  botsMetRectPoint(x1, y1, x2, y2, x, y) {
    if (x1 <= x && x <= x2)
      if (y1 <= y && y <= y2)
        return true;
    return false;
  }

  botsAchtergrond(x_r, y_r, r) {
    return [((x_r - r) < 0 || (x_r + r) > g.getWidth()), ((y_r - r) < 0 || (y_r + r) > g.getHeight())];
  }
}


class Muur {
  constructor(x, y){
    this.x1 = x*10;
    this.x2 = this.x1+10;
    this.y1 = y*10;
    this.y2 = this.y1+10;
  }
}


function kijkInBuurt(pos_x, pos_y) {
  var bal_x = Math.floor(pos_x/10);
  var bal_y = Math.floor(pos_y/10);
  var lijst = [];
  for (let y = Math.max(0, bal_y-1); y <= Math.min(bal_y+1, muren.length-1); y++) {
    let rij = muren[y];
    for (let x = Math.max(0, bal_x-1); x <= Math.min(bal_x+1, rij.length-1); x++) {
      if (rij[x]) {
        lijst.push(rij[x]);
      }
    }
  }
  return lijst;
}

function isGebotst(pos_x, pos_y) {
  var muren_in_buurt = kijkInBuurt(pos_x, pos_y);
  for (var muur of muren_in_buurt) {
    if (botsen.botsMetRectCircel(muur.x1, muur.y1, muur.x2, muur.y2, pos_x, pos_y, 4)) {
      return [true, muren_in_buurt];
    }
  }
  return [false, muren_in_buurt];
}

function changeX(xyz) {
  var nieuwe_x = x-(xyz.x * 10);
  var nieuwe_y = y-(xyz.y * 10);

  var isgebotst = isGebotst(nieuwe_x, nieuwe_y);
  if (!isgebotst[0]) {
    var b = botsen.botsAchtergrond(nieuwe_x, nieuwe_y, 4);
    x_v = b[0];
    y_v = b[1];
    if (!x_v)
      x = nieuwe_x;

    if (!y_v)
      y = nieuwe_y;
  }
  return isgebotst[1];
}

function draw() {
  g.clearRect(x-4, y-4, x+4, y+4);
  var muren_opnieuw = changeX(positionBal);
  g.fillCircle(x, y, 4);
  g.setColor(0, 0, 0);
  for (var muur of muren_opnieuw)
    g.fillRect(muur.x1, muur.y1, muur.x2, muur.y2);
  g.setColor(255, 0, 0);
}

function maakMuren() {
  for (let y = 0; y < muren_str.length; y++) {
    let rij_str = muren_str[y];
    let rij = [];
    for (let x = 0; x < rij_str.length; x++) {
      if (rij_str[x] == "#") {
        rij.push(new Muur(x, y));
      } else {
        rij.push(null);
      }
    }
    muren.push(rij);
  }
}


maakMuren();

const botsen = new Botsen();

Bangle.on('accel', function(xyz) {
  positionBal = xyz;
});

g.clear();
g.setColor(0, 0, 0);
for (var rij of muren) {
  for (var muur of rij) {
    if (muur)
      g.fillRect(muur.x1, muur.y1, muur.x2, muur.y2);
  }
}
g.setColor(255, 0, 0);

setInterval(draw, 70);
