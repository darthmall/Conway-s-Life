(function() {
function Board(canvas, cellsize, height, width) {

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

    function toggle(x, y) {
        var index = y * width + x;

        if (live.contains(index)) {
            live.remove(index);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x * cellsize, y * cellsize, cellsize, cellsize);
        } else {
            live.insert(index);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(x * cellsize, y * cellsize, cellsize, cellsize);
        }
    }

    function setCellSize(value) {
        cellsize = value;
        canvas.attr('width', cellsize * width);
        canvas.attr('height', cellsize * height);
        draw();
    }

    function setWidth(value) {
        width = value;
        canvas.attr('width', cellsize * value);
        draw();
    }

    function setHeight(value) {
        height = value;
        canvas.attr('height', cellsize * value);
        draw();
    }

    this.setCellSize = setCellSize;
    this.setWidth = setWidth;
    this.setHeight = setHeight;

    canvas.click(function(e) {
        toggle(Math.floor(e.offsetX / cellsize), Math.floor(e.offsetY / cellsize));
    });

    var ctx = canvas.get(0).getContext('2d');
    var live = new SortedArray();

    canvas.attr('width', cellsize * width);
    canvas.attr('height', cellsize * height);
    draw();
}

function SortedArray() {

    function search(value) {
        var lower;
        var upper;
        var mid;

        if (arguments.length < 2) {
            return search(value, 0, cells.length - 1);
        }

        lower = arguments[1];
        upper = arguments[2];

        if (lower > upper) {
            return;
        }

        mid = Math.ceil((upper + lower) / 2);

        if (cells[mid] === value) {
            return mid;
        }

        return (cells[mid] < value) ? search(value, lower, mid - 1) :
            search(value, mid + 1, upper);
    }

    function insert(value) {
        cells.splice(search(value), 0, value);
    }

    function remove(value) {
        cells.splice(search(value), 1);
    }

    function contains(value) {
        return (cells[search(value)] === value);
    }

    this.insert = insert;
    this.remove = remove;
    this.contains = contains;

    var cells = [];
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
});

})();

// vim: ts=4:sw=4:et
