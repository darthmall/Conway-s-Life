(function() {

function Board(canvas, cellsize, height, width) {

    var ctx = canvas.get(0).getContext('2d');
    var live = new SortedArray();

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
            ctx.fillRect(x * cellsize, y * cellsize, cellsize - 1, cellsize - 1);
        } else {
            live.insert(index);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(x * cellsize, y * cellsize, cellsize - 1, cellsize - 1);
        }
    }

    function resize() {
        canvas.attr({
            width: cellsize * width,
            height: cellsize * height
        });
    }

    function setCellSize(value) {
        cellsize = value;
        resize()
        draw();
    }

    function setWidth(value) {
        width = value;
        resize();
        draw();
    }

    function setHeight(value) {
        height = value;
        resize();
        draw();
    }

    this.setCellSize = setCellSize;
    this.setWidth = setWidth;
    this.setHeight = setHeight;

    canvas.click(function(e) {
        toggle(Math.floor(e.offsetX / cellsize), Math.floor(e.offsetY / cellsize));
    });

    resize();
    draw();
}

function SortedArray() {

    var data = [];

    function search(value) {
        var lower;
        var upper;
        var mid;

        if (arguments.length < 2) {
            return search(value, 0, data.length - 1);
        }

        lower = arguments[1];
        upper = arguments[2];

        if (lower > upper) {
            return -1
        }

        mid = Math.ceil((upper + lower) / 2);

        if (data[mid] === value) {
            return mid;
        }

        return (data[mid] < value) ? search(value, mid + 1, upper) :
            search(value, lower, mid - 1);
    }

    function insert(value) {
        data.push(value);
        data.sort(function(a, b) {
            return a - b;
        });
    }

    function remove(value) {
        var index = search(value);

        if (index > -1) {
            data.splice(index, 1);
        }
    }

    function contains(value) {
        var index = search(value);
        return (index > -1);
    }

    this.insert = insert;
    this.remove = remove;
    this.contains = contains;
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
