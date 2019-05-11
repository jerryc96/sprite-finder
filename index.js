var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var scssDisplay = document.getElementById('spriteDisplay');

function handleImage(e){
    let reader = new FileReader();
    reader.onload = function(event){
        let img = new Image();
        console.log(event);
        img.src = event.target.result;
        img.onload = function(){
        	console.log(img);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;
            //console.log(data);
            spriteFinder.setCanvas(canvas, ctx, imageData);
            // background color is most common color in spriteMap
            spriteFinder.setBackgroundCol();
            // find all the boxes in the spritesheet
            let boxes = spriteFinder.findBoxes();
            // for each sprite in spritebox, invert the image.
            for (let index in boxes){
            	let box = boxes[index];
            	let sprite = ctx.getImageData(box.x, box.y, box.width, box.height)
            	let spriteData = sprite.data;
            	for (let i=0; i<spriteData.length; i+=4){
            		spriteData[i] = 255 - spriteData[i];
            		spriteData[i+1] = 255 - spriteData[i+1];
            		spriteData[i+2] = 255 - spriteData[i+2];
            	}
            	ctx.putImageData(sprite, box.x, box.y);
            }

            scssDisplay.innerText = makeSCSS(boxes, img.src);
            // turn each sprite into an scss mixin, write the output to SCSS file.
        }
    }
    reader.readAsDataURL(e.target.files[0]);   
}


// Test function for spriteBox to make sure it's returning the right thing.
function spritefinderTest(){
	// canvas 10 * 10
	let sprite1 = {x:1, y:1, width:1, height:1};
	let sprite2 = {x:4, y:4, width:3, height:3};
	ctx.fillStyle = 'green';
	ctx.fillRect(sprite1.x, sprite1.y, sprite1.width, sprite1.height);
	ctx.fillRect(sprite2.x, sprite2.y, sprite2.width, sprite2.height);
	let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let data = imageData.data;
	spriteFinder.setCanvas(canvas, ctx, imageData);
	spriteFinder.setBackgroundCol();
	let boxes = spriteFinder.findBoxes();
}

//spritefinderTest();

// generate scss mixins to represent the images, 
//and a map of all the sprites with their dimensions
function makeSCSS(boxes, url){
	let mixin = "@mixin image($xpos, $ypos, $width, $height)" + 
	" { \n" +
	"height: $height; \n" + 
	"width: width; \n" + 
	"background-position: $xpos $ypos; \n" + 
	"background-repeat: no-repeat; \n" + 
    "};" + "\n";

	let spriteMap = "$spriteMap: ( \n";

	for (let boxnum in boxes){
		let box = boxes[boxnum];
        // for xpos and ypos, you must make the initial positions negative due to the way
        // css fetches sprites on images.
		let sprite = "sprite" + boxnum + ": (" + -box.x 
		+ "px, " + -box.y + "px, " + box.width + "px, " + box.height + "px)"
		spriteMap = spriteMap + sprite;
		if (boxnum !== boxes.length){
			spriteMap = spriteMap + ", \n"
		}
	}

	spriteMap = spriteMap + "); \n";

    return mixin + spriteMap;
}