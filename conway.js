(function() {

function Board(canvas, cellsize, height, width) {

    var ctx = canvas.get(0).getContext('2d');
    var cells = [];

    function draw() {
        ctx.lineSize = 1;
        ctx.strokeStyle = '#888888';
        ctx.beginPath();

        for (var i = -0.5; i < canvas.attr('width'); i += cellsize) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height());
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width(), i);
        }

        ctx.stroke();
        ctx.closePath();
    }

    function reset() {
        cells = [];
        for (var i = 0; i < width * height; i++) {
            cells[i] = false;
        }
    }

    function toggle(x, y) {
        var index = y * width + x;

        setCellState(x, y, !cells[index], cells);
    }

    function resize() {
        canvas.attr({
            width: cellsize * width,
            height: cellsize * height
        });
    }

    function liveNeighbors(x, y) {
        var count = 0;
        var minX = Math.max(x - 1, 0);
        var maxX = Math.min(x + 1, width - 1);
        var minY = Math.max(y - 1, 0);
        var maxY = Math.min(y + 1, height - 1);

        for (var i = minX; i <= maxX; i++) {
            for (var j = minY; j <= maxY; j++) {
                if (i !== x || j !== y) {
                    count += (cells[j * width + i]) ? 1 : 0;
                }
            }
        }

        return count;
    }

    function setCellState(x, y, alive, cellData) {
        cellData[y * width + x] = alive;
        ctx.fillStyle = alive ? '#ff0000' : '#ffffff';
        ctx.fillRect(x * cellsize, y * cellsize, cellsize - 1, cellsize - 1);
    }

    function run() {
        var nextState = [];
        for (var i = 0; i < width * height; i++) {
            var x = i % width;
            var y = Math.floor(i / width);
            var a = alive(x, y);

            setCellState(x, y, a, nextState);
        }

        cells = nextState;
        setTimeout(run, 1000);
    }

    function alive(x, y) {
        var live_neighbors = liveNeighbors(x, y);

        return ((cells[y * width + x] && live_neighbors >= 2 && live_neighbors
                 <= 3) || (!cells[y * width + x] && live_neighbors === 3))
    }

    function setCellSize(value) {
        cellsize = value;
        resize()
        draw();
    }

    function setWidth(value) {
        width = value;
        reset();
        resize();
        draw();
    }

    function setHeight(value) {
        height = value;
        reset();
        resize();
        draw();
    }


    this.setCellSize = setCellSize;
    this.setWidth = setWidth;
    this.setHeight = setHeight;
    this.run = run;

    canvas.click(function(e) {
        toggle(Math.floor(e.offsetX / cellsize), Math.floor(e.offsetY / cellsize));
    });

    reset();
    resize();
    draw();
}

$(document).ready(function() {
    var board = new Board($('#board'),
                          parseInt($('#cellsize').val()),
                          parseInt($('#boardwidth').val()),
                          parseInt($('#boardheight').val()));

    $('#cellsize').change(function() {
        board.setCellSize(parseInt($(this).val()));
    });

    $('#boardwidth').change(function() {
        board.setWidth(parseInt($(this).val()));
    });

    $('#boardheight').change(function() {
        board.setHeight(parseInt($(this).val()));
    });

    $('#startstop').click(function() {
        board.run();
    });
});

})();

// vim: ts=4:sw=4:et
