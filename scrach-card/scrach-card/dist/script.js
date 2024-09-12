const DOT_PATTERN = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath fill-rule="evenodd" d="M0 0h4v4H0V0zm4 4h4v4H4V4z"/%3E%3C/g%3E%3C/svg%3E';


function createCanvas(parent, id, width, height) {
    const canvas = { isDrawing: false, node: null };
    canvas.node = document.createElement('canvas');
    canvas.node.id = id;
    canvas.context = canvas.node.getContext('2d');
    canvas.node.width = width || 100;
    canvas.node.height = height || 100;
    if (parent != null) {
        parent.appendChild(canvas.node);
    }
    return canvas;
}

function getMoney() {
    const number = parseInt(Math.random() * 2);
    const isLucky = number !== 0;
    if (!isLucky) {
        return `😕 Better Luck Next Time `
    }
    else {
        const money = parseInt(number * 3 * performance.now() );
        return `💃 Yayy! You have won ${money} bitcoins`;
    }
}

function removeCanvas(parent, id) {
    const canvas = document.getElementById(id);
    canvas.onmousemove = null;
    canvas.ontouchmove = null;
    canvas.onmousedown = null;
    canvas.onmouseup = null;
    canvas.ontouchstart = null;
    canvas.ontouchend = null;
    parent.removeChild(canvas);
}

function init(container, width, height, fillColor) {
    const overlayLayer = createCanvas(container, 'overlay-layer', width, height);

    const overlayLayerCtx = overlayLayer.context;

    function fillCanvasWithColor(ctx, fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, width, height);
        ctx.fill();

    }

    function writeOnCanvas(ctx, text, color, x, y) {
        ctx.fillStyle = color;
        ctx.font = "32px Arial";
        ctx.fillText(text, x, y);
    }

    function scratchCircle(x, y, radius, color) {
        this.fillStyle = color;
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI * 2, true);
        this.fill();
    }

    function attachPattern(src, ctx, width, height) {
        let pattern = null;
        const image = new Image();

        image.onload = function () {
            pattern = ctx.createPattern(image, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, width, height);
        }
        image.src = src;

    }

    function handleMouseMove(e, canvas) {
        e.preventDefault();
        if (!canvas.isDrawing) {
            return;
        }
        const canvasDOMRect = canvas.node.getBoundingClientRect();
        const x = (e.pageX || e.targetTouches[0].clientX) - canvasDOMRect.left;
        const y = (e.pageY || e.targetTouches[0].clientY) - canvasDOMRect.top;
        canvas.context.globalCompositeOperation = 'destination-out';
        // console.log(e);
        canvas.context.scratchCircle(x, y, 30, '#ff0000');
    }


    function attachListeners(canvas) {
        canvas.node.ontouchstart = (_e) => canvas.isDrawing = true;
        canvas.node.onmousedown = (_e) => canvas.isDrawing = true;

        canvas.node.onmousemove = (e) => handleMouseMove(e, canvas);
        canvas.node.ontouchmove = (e) => handleMouseMove(e, canvas);

        canvas.node.onmouseup = (e) => canvas.isDrawing = false;
        canvas.node.ontouchend = (_e) => canvas.isDrawing = false;
    }

    fillCanvasWithColor(overlayLayerCtx, fillColor);

    writeOnCanvas(overlayLayerCtx, 'Scratch the Card', '#1010c0', overlayLayer.node.width/6, overlayLayer.node.height/2)

    attachPattern(DOT_PATTERN, overlayLayerCtx, width, height);

    overlayLayerCtx.scratchCircle = scratchCircle;

    attachListeners(overlayLayer);
}



const container = document.getElementById('scratch-card');
const textContainer = document.querySelector('#text-layer');
 //under the scratch card is the money value
textContainer.textContent = getMoney();
init(container, 400, 300, '#325FDE');

// remove canvas node and remount it on click of reset
const resetBtn = document.querySelector('.reset-btn');
resetBtn.addEventListener('click', () => {
    removeCanvas(container, 'overlay-layer');
    init(container, 400, 300, '#325FDE');

    textContainer.textContent = getMoney();
});