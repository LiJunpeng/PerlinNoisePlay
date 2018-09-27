const winWidth = 1000;
const winHeight = 1000;

var renderer = PIXI.autoDetectRenderer(winWidth, winHeight, {backgroundColor : 0x000000});
document.body.appendChild(renderer.view);

// 创建舞台 Container
// 之后的对象都存在于舞台之上
var stage = new PIXI.Container();


PIXI.loader
  .add("point", "/assets/img/point.png")
  .load(setup);

function setup() {
  //This code will run when the loader has finished loading the image


	let row = 100;
	let col = 100;
	let width = parseInt(winWidth / row);
	let count = 0;
let test = [];

	for (let r = 0; r < row; r++) {
	    for (let c = 0; c < col; c++) {
	        let noise = Math.abs(PerlinNoise(r, c) / 2);

			// let texture = PIXI.utils.TextureCache["point"];
	  //       let sprite = new PIXI.Sprite(texture);
	  //       sprite.x = c * width;
	  //       sprite.y = r * width;
	  //       sprite.alpha = noise;

	  //       stage.addChild(sprite);
	        // console.log(noise);

	        noise = parseInt(noise * 255);
	        noise = noise.toString(16);
	        noise = noise.length == 1 ? "0" + noise : noise;
			let color = "0xAAFF" + noise.toString(16);
			// console.log(color);

			let rectangle = new PIXI.Graphics();
			rectangle.beginFill(parseInt(color, 16));
			// rectangle.beginFill(0xFFFFFF, noise);
			rectangle.drawRect(0, 0, width, width);
			rectangle.endFill();
			rectangle.x = c * width;
			rectangle.y = r * width;
			stage.addChild(rectangle);

			test.push(noise);
			count++;
	    }
	}

	console.log(count);

}







animate();
// ========================

function animate() {
    requestAnimationFrame(animate);

    // 渲染 Container
    renderer.render(stage);
}

function PerlinNoise (x, y) {
    let persistence = 1 / 4;
    let Number_Of_Octaves = 4;

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




