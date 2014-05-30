(function() {

/**
 * Board class is used to maintain game state and draw the board.
 *
 * @constructor
 */
function Board(canvas, cellsize, height, width, speed) {

    // Private variables
    var ctx = canvas.get(0).getContext('2d');
    var cells = [];
    var timer = null;

    /**
     * Draw the grid on the board.
     *
     * @access private
     */
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

    /**
     * Resets all cells to 0 (dead).
     *
     * @access public
     */
    function reset() {
        cells = [];
        for (var i = 0; i < width * height; i++) {
            cells[i] = false;
        }
    }

    /**
     * Toggle the state of the cell at coordinates x,y.
     *
     * If the cell is alive, make it dead, and vice versa.
     * @access public
     */
    function toggle(x, y) {
        var index = y * width + x;

        setCellState(x, y, !cells[index], cells);
    }

    /**
     * Trigger resizing of the canvas based on cellsize, height, and width.
     *
     * @access public
     */
    function resize() {
        canvas.attr({
            width: cellsize * width,
            height: cellsize * height
        });
    }

    /**
     * Returns the number of neighbors for a given cell that are alive.
     *
     * Neighbors are the eight cells that surround a given cell. The board
     * wraps, so a cell in the top row of the board has three neighbors on the
     * bottom row and vice versa. The same applies to the sides.
     *
     * @param x The x-coordinate (column number) of the cell
     * @param y The y-coordinate (row number) of the cell
     * @return The number of cells surrounding the cell at (x, y) that are 
     *         alive.
     * @access private
     */
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

    /**
     * Sets the state of the cell to the value of `alive` and draws the cell.
     *
     * @param x The x-coordinate (column number) of the cell to update
     * @param y The y-coordinate (row number) of the cell to update
     * @param alive The state to set for the cell (`true` or `false`)
     * @param cellData An array containing the cell states on the board
     *
     * @access private
     */
    function setCellState(x, y, alive, cellData) {
        cellData[y * width + x] = alive;
        ctx.fillStyle = alive ? '#ff0000' : '#ffffff';
        ctx.fillRect(x * cellsize, y * cellsize, cellsize - 1, cellsize - 1);
    }

    /**
     * Starts the game.
     *
     * @access public
     */
    function run() {
        var nextState = [];
        for (var i = 0; i < width * height; i++) {
            var x = i % width;
            var y = Math.floor(i / width);
            var a = alive(x, y);

            setCellState(x, y, a, nextState);
        }

        cells = nextState;
        timer = setTimeout(run, 1000 / speed);
    }

    /**
     * Stops the game.
     *
     * @access public
     */
    function stop() {
        clearTimeout(timer);
        timer = null;
    }

    /**
     * Returns `true` if the cell at (x, y) should be alie, `false` otherwise.
     *
     * Calculates the next the state of a cell given its current state and the
     * states of all eight of its neighbors
     *
     * @param x The x-coordinate (column number) of the cell
     * @param y The y-coordinate (row number) of the cell
     *
     * @access private
     */
    function alive(x, y) {
        var live_neighbors = liveNeighbors(x, y);

        return ((cells[y * width + x] && live_neighbors >= 2 &&
            live_neighbors <= 3) || (!cells[y * width + x] &&
            live_neighbors === 3));
    }

    /**
     * Sets the cellSize property
     *
     * @param value An integer value indicating the height and width of each
     *              cell on the board.
     *
     * @access public
     */
    function setCellSize(value) {
        cellsize = value;
        resize();
        draw();
    }

    /**
     * Sets the width of the board in cells.
     *
     * @param value The number of columns on the board
     *
     * @access public
     */
    function setWidth(value) {
        width = value;
        reset();
        resize();
        draw();
    }

    /**
     * Sets the height of the board in cells.
     *
     * @param value The number of rows on the board
     *
     * @access public
     */
    function setHeight(value) {
        height = value;
        reset();
        resize();
        draw();
    }

    /**
     * Sets the number of seconds between iterations of the game.
     *
     * @param value The number of seconds between each iteration of the game
     *
     * @access public
     */
    function setSpeed(value) {
        speed = value;
    }

    /**
     * Randomly sets cell states to alive or dead.
     *
     * `saturation` can be considered a probability that a given cell is alive.
     * For example, if `saturation` is 0.3, approximately 30% of the cells on
     * the board will be alive.
     *
     * @param saturation A number in the range [0, 1] that sets the percentage
     *                   of cells on the board that will be alive
     *
     * @access public
     */
    function randomize(saturation) {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                setCellState(i, j, (Math.random() <= saturation), cells);
            }
        }
    }

    /**
     * Returns `true` if the game is running, `false` otherwise.
     *
     * @access public
     */
    function running() {
        return (timer !== null);
    }

    /**
     * Sets all cell states to dead (`false`).
     *
     * @access public
     */
    function clear() {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                setCellState(i, j, false, cells);
            }
        }
    }

    // Public method declarations
    this.setCellSize = setCellSize;
    this.setWidth = setWidth;
    this.setHeight = setHeight;
    this.setSpeed = setSpeed;
    this.run = run;
    this.stop = stop;
    this.randomize = randomize;
    this.running = running;
    this.clear = clear;

    // Toggle cell states when a user clicks the canvas.
    canvas.click(function(e) {
        toggle(Math.floor(e.offsetX / cellsize), Math.floor(e.offsetY / cellsize));
    });

    // Initialize the board.
    reset();
    resize();
    draw();
}

$(document).ready(function() {
    // Set up defaults
    var saturation = 0.3;
    var initial_speed = 10;
    var board = new Board($('#board'),
                          parseInt($('#cellsize').val(), 10),
                          parseInt($('#boardwidth').val(), 10),
                          parseInt($('#boardheight').val(), 10),
                          initial_speed);

    // Initialize game controls
    $('#cellsize').change(function() {
        board.setCellSize(parseInt($(this).val(), 10));
    });

    $('#boardwidth').change(function() {
        board.setWidth(parseInt($(this).val(), 10));
    });

    $('#boardheight').change(function() {
        board.setHeight(parseInt($(this).val(), 10));
    });

    $('#speedslider').slider({
        range: 'min',
        value: initial_speed,
        min: 0.5,
        max: 60,
        step: 0.5,
        slide: function(event, ui) {
            $('#speeddisplay').attr('innerHTML', ui.value);
            board.setSpeed(ui.value);
        }
    });

    $('#speeddisplay').attr('innerHTML', initial_speed);

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

    $('#clear').button().click(board.clear);

    $('#randomize').button().click(function() {
        board.randomize(saturation);
    });

    $('#startstop').button().click(function() {
        if (board.running()) {
            $(this).children('.ui-button-text').attr('innerHTML', 'Start');
            board.stop();
        } else {
            $(this).children('.ui-button-text').attr('innerHTML', 'Stop');
            board.run();
        }
    });

    // End game controls

    // Initialize the rules display
    $('#showrules').click(function() {
        $('#rules').css({
            left: ($(window).width() - $('#rules').width()) / 2,
            top: ($(window).height() - $('#rules').height()) / 2
        }).show();
    });

    $('#rules').click(function() {
        $(this).hide();
    });
});

})();

// vim: ts=4:sw=4:et
