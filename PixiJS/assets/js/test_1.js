let mode = 0;

const winWidth = 1000;
const winHeight = 1000;
let movingY = 0;
let movingStep = 5;
let framePerStep = 60;
let currentFrameCount = 0;

var renderer = PIXI.autoDetectRenderer(winWidth, winHeight, {backgroundColor : 0x000000});
document.body.appendChild(renderer.view);

// 创建舞台 Container
// 之后的对象都存在于舞台之上
stage = new PIXI.Container();


PIXI.loader
	.add("point", "/assets/img/point.png")
  	.load(setup);

function setup() {
  //This code will run when the loader has finished loading the image

  	if (mode == 0) {

		let row = 100;
		let col = 100;
		let width = parseInt(winWidth / row);
		let count = 0;

		let noiseArray = [];
		let maxNoise = -1000000;
		let minNoise = 1000000;
		for (let r = 0; r < row; r++) {
			noiseArray[r] = [];
		    for (let c = 0; c < col; c++) {
		    	let tempNoise = PerlinNoise(r * 0.1, c * 0.1);
		    	noiseArray[r][c] = tempNoise;
		    	maxNoise = maxNoise > tempNoise ? maxNoise : tempNoise;
		    	minNoise = minNoise < tempNoise ? minNoise : tempNoise;
	    	}
	    }
		
	let test = [];
	    let noiseScale = maxNoise - minNoise;
		for (let r = 0; r < row; r++) {
		    for (let c = 0; c < col; c++) {
		        // let noise = p5PerlinNoise(r * 0.1, c * 0.1);
		        let noise = (noiseArray[r][c] - minNoise) / noiseScale;

				// let texture = PIXI.utils.TextureCache["point"];
		  //       let sprite = new PIXI.Sprite(texture);
		  //       sprite.x = c * width;
		  //       sprite.y = r * width;
		  //       sprite.alpha = noise;

		  //       stage.addChild(sprite);
		        // console.log(noise);

		        // noise = parseInt(noise * 255);
		        // noise = noise.toString(16);
		        // noise = noise.length == 1 ? "0" + noise : noise;
				// let color = "0xAAFF" + noise.toString(16);
				// console.log(color);

				let rectangle = new PIXI.Graphics();
				// rectangle.beginFill(parseInt(color, 16));
				rectangle.beginFill(0xFFFFFF, noise);
				rectangle.drawRect(0, 0, width, width);
				rectangle.endFill();
				rectangle.x = c * width;
				rectangle.y = r * width;
				stage.addChild(rectangle);

				test.push(noise);
				// count++;
		    }
		}

		console.log(test);
	} else if (mode == 1) {
		updateNoise();
	}

}







animate();
// ========================

function animate() {
    requestAnimationFrame(animate);

    // 渲染 Container
    if (mode == 0) {
    	renderer.render(stage);
    } else if (mode == 1) {
    	currentFrameCount++;
    	if (currentFrameCount >= framePerStep) {
    		currentFrameCount = 0;
    		movingY += movingStep;
			updateNoise();
    	} 
    }
}

function updateNoise() {
	stage.removeChildren();

	console.log("update");

	let row = 100;
	let col = 100;
	let width = parseInt(winWidth / row);

	for (let r = 0; r < row; r++) {
	    for (let c = 0; c < col; c++) {
	    	let tempR = r + movingY;
	        let noise = p5PerlinNoise(tempR * 0.1, c * 0.1);
	        // let noise = (noiseArray[r][c] - minNoise) / noiseScale;

			let rectangle = new PIXI.Graphics();
			// rectangle.beginFill(parseInt(color, 16));
			rectangle.beginFill(0xFFFFFF, noise);
			rectangle.drawRect(0, 0, width, width);
			rectangle.endFill();
			rectangle.x = c * width;
			rectangle.y = r * width;
			stage.addChild(rectangle);
	    }
	}
}

function PerlinNoise (x, y) {
    let persistence = 1 / 2;
    let Number_Of_Octaves = 8;

    let noise = 0;
    let p = persistence;
    let n = Number_Of_Octaves;
    for(let i = 0; i < n; i++)
    {
        let frequency = Math.pow(2,i);
        let amplitude = Math.pow(p,i);
        noise = noise + InterpolatedNoise(x * frequency, y * frequency) * amplitude;
    }

    return noise;
}


let Noise = function (x, y) {
    let n=x+y*59;
    n = (n >> 13) ^ n;
    let nn = (n * (n * n * 15731 + 789211) + 700000001) & 0x7fffffff;
    return 1.0 - (nn / 1073741824.0);



    // let n = x + y * 57;
    // n = (n<<13) ^ n;
    // return ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);

    // let originNoise = ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
    // let normalizedNoise = (originNoise + 1) / 2;
    // return normalizedNoise;
}

let SmoothedNoise = function (x, y) {  //光滑噪声
    let corners = (Noise(x-1, y-1)+Noise(x+1, y-1)+Noise(x-1, y+1)+Noise(x+1, y+1) ) / 16;
    let sides = ( Noise(x-1, y) +Noise(x+1, y) +Noise(x, y-1) +Noise(x, y+1) ) / 8;
    let center = Noise(x, y) / 4;
    return corners + sides + center;
}

let Cosine_Interpolate = function (a, b, x) { // 余弦插值
    let ft = x * 3.1415927;
    let f = (1 - Math.cos(ft)) * 0.5;
    return a*(1-f) + b*f;
}

let Linear_Interpolate = function (a, b, x) {//线性插值
    return a*(1-x) + b*x;
}

let InterpolatedNoise = function (x, y) {  // 获取插值噪声
    let integer_X = parseInt(x);
    let fractional_X = x - integer_X;
    let integer_Y = parseInt(y);
    let fractional_Y = y - integer_Y;
    let v1 = SmoothedNoise(integer_X, integer_Y);
    let v2 = SmoothedNoise(integer_X + 1, integer_Y);
    let v3 = SmoothedNoise(integer_X, integer_Y + 1);
    let v4 = SmoothedNoise(integer_X + 1, integer_Y + 1);
    let i1 = Cosine_Interpolate(v1, v2, fractional_X);
    let i2 = Cosine_Interpolate(v3, v4, fractional_X);
    return Cosine_Interpolate(i1, i2, fractional_Y);
}

// ===============================
var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave

var scaled_cosine = function(i) {
  return 0.5 * (1.0 - Math.cos(i * Math.PI));
};

var perlin; 

let p5PerlinNoise = function(x, y, z) {
  	y = y || 0;
  	z = z || 0;

  	if (perlin == null) {
    	perlin = new Array(PERLIN_SIZE + 1);
    	for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      		perlin[i] = Math.random();
    	}
  	}

  	if (x < 0) {
    	x = -x;
  	}
  	if (y < 0) {
    	y = -y;
  	}
  	if (z < 0) {
    	z = -z;
  	}

  	var xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  	var xf = x - xi;
  	var yf = y - yi;
  	var zf = z - zi;
  	var rxf, ryf;

  	var r = 0;
  	var ampl = 0.5;

	var n1, n2, n3;

  	for (var o = 0; o < perlin_octaves; o++) {
   		var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    	rxf = scaled_cosine(xf);
    	ryf = scaled_cosine(yf);

   		n1 = perlin[of & PERLIN_SIZE];
    	n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    	n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    	n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    	n1 += ryf * (n2 - n1);

    	of += PERLIN_ZWRAP;
    	n2 = perlin[of & PERLIN_SIZE];
    	n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    	n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    	n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    	n2 += ryf * (n3 - n2);

    	n1 += scaled_cosine(zf) * (n2 - n1);

    	r += n1 * ampl;
    	ampl *= perlin_amp_falloff;
    	xi <<= 1;
    	xf *= 2;
    	yi <<= 1;
    	yf *= 2;
    	zi <<= 1;
    	zf *= 2;

    	if (xf >= 1.0) {
			xi++;
			xf--;
    	}
    	if (yf >= 1.0) {
      		yi++;
     	 	yf--;
    	}
    	if (zf >= 1.0) {
    		  zi++;
     		 zf--;
    	}
  	}
	return r;
};


