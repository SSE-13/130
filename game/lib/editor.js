var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var editor;
(function (editor) {
    editor.GRID_PIXEL_WIDTH = 32;
    editor.GRID_PIXEL_HEIGHT = 32;
    var NUM_ROWS = 12;
    var NUM_COLS = 12;
    var WorldMap = (function (_super) {
        __extends(WorldMap, _super);
        function WorldMap() {
            _super.call(this);
            this.isDirty = true;
            var grid = new astar.Grid(NUM_COLS, NUM_ROWS);
            this.cache = document.createElement("canvas");
            this.cache.width = 400;
            this.cache.height = 400;
            this.grid = grid;
        }
        WorldMap.prototype.render = function (context) {
            _super.prototype.render.call(this, context);
        };
        return WorldMap;
    }(render.DisplayObjectContainer));
    editor.WorldMap = WorldMap;
    var Tile = (function (_super) {
        __extends(Tile, _super);
        function Tile() {
            _super.call(this);
        }
        Tile.prototype.SetBackground = function (value) {
            this.source = "9.png";
        };
        Tile.prototype.setWalkable = function (value) {
            this.source = value + ".png";
        };
        return Tile;
    }(render.Bitmap));
    editor.Tile = Tile;
    var BoyBody = (function (_super) {
        __extends(BoyBody, _super);
        function BoyBody() {
            _super.apply(this, arguments);
            this.m_point_x = new Array();
            this.m_point_y = new Array();
            this.m_speed = 1;
            this.m_position = 0;
            this.m_vx = 0;
            this.m_vy = 0;
            this.m_Endx = 0;
            this.m_Endy = 0;
            this.m_Startx = 0;
            this.m_Starty = 0;
        }
        BoyBody.prototype.run = function (grid) {
            grid.setStartNode(this.m_Startx, this.m_Startx);
            grid.setEndNode(this.m_Endx, this.m_Endy);
            var findpath = new astar.AStar();
            findpath.setHeurisitic(findpath.manhattan);
            var result = findpath.findPath(grid);
            var path = findpath._path;
            for (var i = 0; i < path.length; i++) {
                this.m_point_x[i] = path[i].x;
                this.m_point_y[i] = path[i].y;
                console.log(path[i].x, path[i].y);
            }
        };
        BoyBody.prototype.SetEnd = function (x, y) {
            this.m_Endx = x;
            this.m_Endy = y;
        };
        BoyBody.prototype.SetStart = function (x, y) {
            this.m_Endx = x;
            this.m_Endy = y;
        };
        BoyBody.prototype.onTicker = function (duringTime) {
            if (this.m_position < this.m_point_y.length) {
                var m_dx = Math.abs(this.x - this.m_point_x[this.m_position + 1] * editor.GRID_PIXEL_WIDTH);
                var m_dy = Math.abs(this.y - this.m_point_y[this.m_position + 1] * editor.GRID_PIXEL_WIDTH);
                if (m_dx < 0.3 || m_dy < 0.3) {
                    if (this.m_point_x[this.m_position + 1] - this.m_point_x[this.m_position] > 0) {
                        this.m_vx = this.m_speed;
                    }
                    else if (this.m_point_x[this.m_position + 1] - this.m_point_x[this.m_position] < 0) {
                        this.m_vx = this.m_speed * -1;
                    }
                    else if (this.m_point_x[this.m_position + 1] - this.m_point_x[this.m_position] == 0) {
                        this.m_vx = 0;
                    }
                    if (this.m_point_y[this.m_position + 1] - this.m_point_y[this.m_position] > 0) {
                        this.m_vy = this.m_speed;
                    }
                    else if (this.m_point_y[this.m_position + 1] - this.m_point_y[this.m_position] < 0) {
                        this.m_vy = this.m_speed * -1;
                    }
                    else if (this.m_point_y[this.m_position + 1] - this.m_point_y[this.m_position] == 0) {
                        this.m_vy = 0;
                    }
                    this.x += this.m_vx * duringTime;
                    this.y += this.m_vy * duringTime;
                }
                else {
                    this.m_position++;
                    console.log("position" + this.m_position);
                }
            }
        };
        return BoyBody;
    }(Body));
    editor.BoyBody = BoyBody;
    var ControlPanel = (function (_super) {
        __extends(ControlPanel, _super);
        function ControlPanel() {
            _super.call(this);
            var button = new ui.Button();
            button.text = "Hello";
            button.width = 100;
            button.height = 50;
            this.addChild(button);
            button.onClick = function () {
                alert(111);
            };
        }
        return ControlPanel;
    }(render.DisplayObjectContainer));
    editor.ControlPanel = ControlPanel;
})(editor || (editor = {}));
