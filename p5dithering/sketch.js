let MODE = 1; // true to use my palette or not
//https://coolors.co/303633-57184d-820d3e-b8336a-f2639f-fbb7c0-c6d8d3-abdafc-7fb7be-346282
let DITHER = 1; // true to turn on dithering
let DEPTH = 7; // how many colors there will be
// only works with MODE set to false
// 255 for all colors
let PICTURE = 0; // which picture to use, 1 2 3...

let DOWNLOAD = false

let pic
function preload() {
  let image = "cat.jpeg"
  switch (PICTURE) {
    default:
      image = "cat.jpeg"
      break;
    case 1:
      image = "field.jpg"
      break;
    case 2:
      image = "flowerfield.jpg"
      break
    case 3:
      image = "mountains1.jpg"
      break
    case 4:
      image = "mountains2.jpg"
      break
    case 5:
      image = "rainbow.jpg"
      break
    case 6:
      image = "rainbowtest.jpg"
      break;
    case 7:
      image = "kocho.jpg"
      break;
    case 8:
      image = "forestsmall.jpg"
      break
    case 9:
      image = "forest.jpg"
      break
      
  }
  pic = loadImage("images/"+image)
}
let PALETTE
function setup() {
  PALETTE = [
    color(48, 54, 51),
    color(87, 24, 77),
    color(130, 13, 62),
    color(184, 51, 106),
    color(242, 99, 159),
    color(251, 183, 192),
    color(198, 216, 211),
    color(171, 218, 252),
    color(127, 183, 190),
    color(52, 98, 130)
  ]
  
  createCanvas(pic.width, pic.height);
  
  pixelDensity(1)
}

function imageIndex(img, x,y) {
  return (x + y * img.width) * 4
}
function indexGet(img, x,y) {
  let idx = imageIndex(img,x,y)
  let r = img.pixels[idx]
  let g = img.pixels[idx+1]
  let b = img.pixels[idx+2]
  let a = img.pixels[idx+3]
  return color(r,g,b,a)
}
function indexSet(img, x,y, clr) {
  let idx = imageIndex(img,x,y)
  
  img.pixels[idx] = red(clr)
  img.pixels[idx+1] = green(clr)
  img.pixels[idx+2] = blue(clr)
  img.pixels[idx+3] = alpha(clr)
}

function closestStep(max, steps, value) {
  return round(steps * value / 255) * floor(255 / steps);
}
function closestColor(col, pal) {
  let close = 99999
  let closeIndex = -1
  for (let i = 0; i < pal.length; i++) {
    let dr = red(col) - red(pal[i])
    let dg = green(col) - green(pal[i])
    let db = blue(col) - blue(pal[i])
    
    let d = (dr*dr) + (dg*dg) + (db*db)
    
    if (d < close) {
      close = d
      closeIndex = i
    }
  }
  return pal[closeIndex]
}

function draw() {
  background(220);
  
  pic.loadPixels()
  

  //loadPixels()
  for (let y = 0; y < pic.height; y++) {
    for (let x = 0; x < pic.width; x++) {
      let c = indexGet(pic,x,y)
      let oldr = red(c)
      let oldg = green(c)
      let oldb = blue(c)
      
      let r = 255
      let g = 255
      let b = 255
      
      if (!MODE) {
        r = closestStep(255, DEPTH, oldr)
        g = closestStep(255, DEPTH, oldg)
        b = closestStep(255, DEPTH, oldb)
      } else {
        let newColor = closestColor(color(oldr,oldg,oldb),PALETTE)
        r = red(newColor)
        g = green(newColor)
        b = blue(newColor)
      }
      
      indexSet(pic,x,y,color(r,g,b,255))
      
      let errR = oldr - r
      let errG = oldg - g
      let errB = oldb - b
      
      if (DITHER) {
        distributeError(pic, x, y, errR, errG, errB)
      }
    }
  }
  //updatePixels()
  pic.updatePixels()
  
  image(pic,0,0)
  
  let name = floor(random(99999999))
  if (DOWNLOAD) {
    saveCanvas("pic"+name+".png")
  }
  
  noLoop()
}

function distributeError(img, x, y, errR, errG, errB) {
  addError(img, 7 / 16.0, x + 1, y, errR, errG, errB);
  addError(img, 3 / 16.0, x - 1, y + 1, errR, errG, errB);
  addError(img, 5 / 16.0, x, y + 1, errR, errG, errB);
  addError(img, 1 / 16.0, x + 1, y + 1, errR, errG, errB);
}

function addError(img, factor, x,y, errR,errG,errB) {
  if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
  let clr = indexGet(img,x,y)
  let r = red(clr)
  let g = green(clr)
  let b = blue(clr)
  
  clr.setRed(r + errR * factor)
  clr.setGreen(g + errG * factor)
  clr.setBlue(b + errB * factor)
  
  indexSet(img,x,y,clr)
}