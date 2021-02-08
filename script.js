//Generates matrix
var i = 0;
let m = 10; //12 doable performance max

while (i <= m * m) {
  if (i > 0) {
    let newElement = document.createElement("div");
    
    newElement.classList.add("box");
    document.querySelector(".wrapper").appendChild(newElement);
    
    if (i % m === 0) {
      let breakElement = document.createElement("br");
      document.querySelector(".wrapper").appendChild(breakElement);
    }
  } 
  i++;
}

//Variables declarations
const box = document.querySelectorAll(".box");
const fpsIndicator = document.querySelector("#fps");

let radius = 700;
let originX = 0;
let originY = 0;
let originForceX = 0;
let originForceY = 0;

const mouse = {
  x: null, 
  y: null
};

//Handles mouse position
document.addEventListener("mousemove", function(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  
  // mouseCircle.style.left = mouse.x + "px";
  // mouseCircle.style.top = mouse.y + "px";
});

//Radius amplifier
document.addEventListener("mousedown", function(e) {
  radius *= 5;
});

//Sets original radius 
document.addEventListener("mouseup", function(e) {
  radius /= 5;
});

//Gets the original position of the elements
box.forEach(function(element) {
  element.originX = element.getBoundingClientRect().left;
  element.originY = element.getBoundingClientRect().top;
});

//Sets boxes to move freely
for (let element of box) {
  element.style.position = "absolute";
}

//Particle system logic
//Could be optimized for big amounts of particles
//Do not update every particle, but only particles in the reach of the radius
//Set maxDistance, past that distance ignore forces
setInterval(function () {
  box.forEach(function(element, index) {

    //Gets the position of the element
    elementX = element.getBoundingClientRect().left;
    elementY = element.getBoundingClientRect().top;
    
    //Calculates Euclidean distance between mouse position and the element position
    distanceX = mouse.x - elementX;
    distanceY = mouse.y - elementY;
    
    distance = Math.sqrt( (distanceX * distanceX) + (distanceY * distanceY) );
    
    //Calculates the force of repel
    repelForceX = elementX - (distanceX / distance) * radius / distance;
    repelForceY = elementY - (distanceY / distance) * radius / distance;
    
    //Calculates the drawback force
    originForceX = (element.originX - elementX) / 4;
    originForceY = (element.originY - elementY) / 4;
    
    //Sets the position of the element dependent of the power of the forces
    element.style.left = repelForceX + originForceX + "px";
    element.style.top = repelForceY + originForceY + "px";
    
    //Colors the elements depending of the distance between the mouse and elements
    element.style.backgroundColor = "rgb(" + Math.round(distance) + ", 172, 169)";
    // element.textContent = Math.floor(distance);
    // mouseCircle.style.backgroundColor = "rgb(" + Math.round(distanceX) + ", 172, 169)";
  });
}, 15);

//Styles cursor
// const mouseCircle = document.querySelector("#mouse");

// mouseCircle.style.width = radius / 4 + "px";
// mouseCircle.style.height = radius / 4 + "px";
  
//Fps function
const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    
    const now = performance.now();
    
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
      
    times.push(now);
    fps = times.length;
    fpsIndicator.textContent = fps;
    refreshLoop();
  });
}

refreshLoop();
