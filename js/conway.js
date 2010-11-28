(function() {

function Board(canvas, cellsize, height, width) {

    var ctx = canvas.get(0).getContext('2d');
    var cells = [];
    var timer = null;

    function draw() {
        ctx.lineSize = 1;
        ctx.strokeStyle = '#888888';
        ctx.beginPath();

        for (var i = -0.5; i < canvas.attr('width') - 0.5; i += cellsize) {
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

    function run(speed) {
        var nextState = [];
        for (var i = 0; i < width * height; i++) {
            var x = i % width;
            var y = Math.floor(i / width);
            var a = alive(x, y);

            setCellState(x, y, a, nextState);
        }

        cells = nextState;
        timer = setTimeout(function() {
            run(speed)
        }, 1000 / speed);
    }

    function stop() {
        clearTimeout(timer);
        timer = null;
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

    function randomize(saturation) {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                setCellState(i, j, (Math.random() <= saturation), cells);
            }
        }
    }

    function running() {
        return (timer !== null);
    }


    this.setCellSize = setCellSize;
    this.setWidth = setWidth;
    this.setHeight = setHeight;
    this.run = run;
    this.stop = stop;
    this.randomize = randomize;
    this.running = running;

    canvas.click(function(e) {
        toggle(Math.floor(e.offsetX / cellsize), Math.floor(e.offsetY / cellsize));
    });

    reset();
    resize();
    draw();
}

$(document).ready(function() {
    var speed = 300;
    var saturation = 0.3;
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

    $('#speedslider').slider({
        range: 'min',
        value: speed,
        min: 1,
        max: 1000,
        slide: function(event, ui) {
            $('#speeddisplay').attr('innerHTML', ui.value);
            speed = ui.value;
        }
    });

    $('#saturationslider').slider({
        range: 'min',
        value: saturation,
        min: 0.01,
        max: 1,
        step: 0.01,
        slide: function(event, ui) {
            $('#saturationdisplay').attr('innerHTML', ui.value);
            saturation = ui.value;
        }
    });

    $('#randomize').button().click(function() {
        board.randomize(saturation);
    });

    $('#startstop').button().click(function() {
        if (board.running()) {
            $(this).children('.ui-button-text').attr('innerHTML', 'Start');
            board.stop();
        } else {
            $(this).children('.ui-button-text').attr('innerHTML', 'Stop');
            board.run(speed);
        }
    });

});

})();

// vim: ts=4:sw=4:et
