var spriteFinder = (function(){
    let Context;
    let ImageData;
    let Canvas;
    let pixelArr = [];
    let Data;
    let backgroundCol;
    var module = {};

    function setPixelArr(data){
        for (let i=0; i<data.length; i+=4){
            let pixel = [data[i], data[i+1], data[i+2], data[i+3]];
            pixelArr.push(pixel);
        }
    }

    module.setCanvas = function(canvas, context, imageData){
        Canvas = canvas;
        Context = context;
        ImageData = imageData;
        Data = imageData.data;
        setPixelArr(Data);
    }

    module.comparePixels = function(pixelA, pixelB){
        // change the pixel vals to an integer, r + g + b + a occupying different digits
        let pixelAVal = pixelA[0] * 100 ** 3 + pixelA[1] * 100 ** 2 + pixelA[2] * 100 + pixelA[3];
        let pixelBVal = pixelB[0] * 100 ** 3 + pixelB[1] * 100 ** 2 + pixelB[2] * 100 + pixelB[3];
        return pixelAVal - pixelBVal;
    }

    module.pixelsEqual = function(pixelA, pixelB){
        if (pixelA[3] === 0 && pixelB[3] === 0){
            return true;
        }
        for (let i=0; i<4; i++){
            if (pixelA[i] !== pixelB[i]){
                return false;
            }
        }
        return true;
    }

    module.getPixelArr = function(){
        return pixelArr;
    }

    // find most common color in spritesheet. This is the background color.
    module.setBackgroundCol = function(){
        let max_count = 1;
        let curr_count = 1;
        let pixel;
        let sortedArr = pixelArr.sort(function(pixelA, pixelB){
            return module.comparePixels(pixelA, pixelB);
        });
        for (let i=1; i<sortedArr.length; i++){
            if (module.pixelsEqual(sortedArr[i], sortedArr[i-1])){
                curr_count += 1;
            }
            else {
                if (curr_count > max_count){
                    max_count = curr_count;
                    pixel = sortedArr[i-1];
                }
                curr_count = 1;
            }
        }
        if (curr_count > max_count){
            max_count = curr_count
            pixel = sortedArr[sortedArr.length-1]
        }
        backgroundCol = pixel;
    }

    module.getBackgroundCol = function(){
        return backgroundCol;
    }
    
    module.getCanvas = function(){
        return Canvas;
    }

    module.findBoxes = function(){
        let boxes = [];
        let canvas = module.getCanvas();
        let height = canvas.height;
        let width = canvas.width;
        // scan over each line of the image, walking from left to right, until you
        // find a pixel that's not of backgroundCol
         
        let y = 0;
        while (y < height){
            let x = 0;
            while (x < width){
                let pixel = Context.getImageData(x, y, 1, 1).data;
                // check to see if pixelCol is the same as backgroundCol
                if (module.pixelsEqual(pixel, backgroundCol)){
                    x += 1;
                    continue;
                }
                let box = pixelInBoxes(x, y, boxes);
                if (box !== null){
                    // should return a box, move x to box.x + box.width
                    x += box.width;
                    continue;
                }
                else {
                    box = exploreSpriteBox(x, y);
                    boxes.push(box);
                    x += 1;
                }
            }
            y += 1;
        }
        // if that pixel is already in an existing spritebox, move to the right of that box
        // and continue looking at the rest of the line.

        // if not, make a sprite box containing only that pixel 
        // and expand to fill the dimensions of that sprite
        return boxes;
    }

    // makes and returns a box object. This object contains an x value, y value, height and width.
    function newBox(x, y, width, height){
        return {x: x, y: y, width: width, height: height};
    }

    // for each box, check if the pixel's x and y values are inside the dimensions of the box
    function pixelInBoxes(x, y, boxes){
        for (let index in boxes){
            let box = boxes[index];
            if (x >= box.x && x <= (box.x + box.width)){
                if (y >= box.y && y <= (box.y + box.height)){
                    return box;
                }
            }
        }
        return null;
    }
    // explore the pixels around the starting pixel coordinate, until you reach a point where
    // all edges are that of background color (signaling the borders of the sprite) 
    // or reach the boundaries of the canvas
    function exploreSpriteBox(x, y){
        let box = newBox(x, y, 1, 1);
        let boxBoundaries = boxMeetBoundaries(box);
        let neighbourCol = neighboursBackCol(box);
        while (boxCanExpand(boxBoundaries, neighbourCol)){
            // for each direction, check if the box can expand there
            // expand the box in that direction, redefine boxMeetBoundaries and neighbourCol
            // with new box;
            for (let i=0; i<4; i++) {
                if (!neighbourCol[i] && !boxBoundaries[i]) {
                    expandBox(box, i);
                }
            }
            boxBoundaries = boxMeetBoundaries(box);
            neighbourCol = neighboursBackCol(box);
        }
        // need to contract box by 1 in each direction, since it overshoots
        contractBox(box);
        return box;
    }

    // check if the box's edges meet any of the four strict boundaries of the canvas
    // [left, right, top, bottom]
    function boxMeetBoundaries(box){
        return [
            box.x === 0,
            box.x + box.width === Canvas.width,
            box.y === 0,
            box.y + box.height === Canvas.height,
        ]
    }

    // check each neighbouring direction the box can expand to.
    // if a direction contains any pixel that's not a background color, 
    // you can expand the sprite box in that direction
    function neighboursBackCol(box){
        let left = Context.getImageData(box.x-1, box.y, 1, box.height).data;
        let right = Context.getImageData(box.x + box.width - 1, box.y, 1, box.height).data;
        let top = Context.getImageData(box.x, box.y-1, box.width, 1).data;
        let bottom = Context.getImageData(box.x, box.y + box.height - 1, box.width, 1).data;

        return [
            edgeAllBackgroundCol(left),
            edgeAllBackgroundCol(right),
            edgeAllBackgroundCol(top),
            edgeAllBackgroundCol(bottom)
        ]
    }

    function edgeAllBackgroundCol(edge) {
        // check each pixel. If all of them same col as backgroundCol
        // return true, otherwise return false
        for (let i=0; i<edge.length; i+=4){
            let pixel = [edge[i], edge[i+1], edge[i+2], edge[i+3]];
            if (!module.pixelsEqual(pixel, backgroundCol)){
                return false;
            }
        }
        return true;
    }
    // a sprite box can expand iff any direction has not reached the canvas boundary
    // AND that same direction contains a pixel that's not the same color as backgroundColor.
    function boxCanExpand(edgeColors, edgeBoundaries){
        for (let i=0; i<4; i++){
            if (!edgeColors[i] && !edgeBoundaries[i]){
                return true;
            }
        }
        return false;
    }

    // expand the box in a given direction
    // 0 = left, 1 = right, 2 = top, 3 = bottom
    function expandBox(box, direction){
        switch (direction){
            case 0:
               box.x -= 1;
               box.width += 1;
               break;
            case 1:
               box.width += 1;
               break;
            case 2:
               box.y -= 1;
               box.height += 1;
               break;
            case 3:
               box.height += 1;
               break;
            default:
               break;
        }

    }

    // the box overshoots by 1 in each direction, since box constructor has a size = 1
    // due to index error if set to 0.
    // this function will contract box to proper boundaries
    function contractBox(box){
        if (box.width > 1){
            box.width -= 1;
        }
        if (box.height > 1){
            box.height -= 1;
        }
    }

    return module;
})();