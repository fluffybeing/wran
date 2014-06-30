var worldData = {
    roomSize: { width:20, height:10 },
    initialPlayerPos: { x:320, y:160 },

    rooms: {
        room1: {
          exits: { n: "room9", s: "room4", e: "room2", w: "room9" },
          backgroundSlide: {dx:-2, dy:-2},
          isRotating: false,
          map: ["XXXXXXXXXXXXXXXXXXXX",
                "X..................X",
                "X....X....XXXX.....X",
                "X....X.............X",
                "X.XXXX.............X",
                "X.............X.....",
                "X....XXXX.....X.....",
                "X......XXXXXXXXXXXXX",
                "X....X..X..........X",
                "XX..XXXXX..XXXXX..XX"],
        },

        room2: {
          exits: { n: "room9", s: "room5", e: "room3", w: "room1" },
          backgroundSlide: {dx:0, dy:-2},
          isRotating: false,
          map: ["XXXXXXXXXXXXXXXXXXXX",
                "X....XX........X....",
                "X..X....XX..........",
                "X.............XX...X",
                "XXX...X..XX........X",
                "..X......XX.......XX",
                "..X..........XX.....",
                "XXX....X...X.......X",
                "X...............X..X",
                "XXXXXXXXXX..XXXXXXXX"],
        },

        room3: {
          exits: { n: "room9", s: "room6", e: "room9", w: "room2" },
          backgroundSlide: {dx:2, dy:2},
          isRotating: false,
          map: ["XXXXXXXXXXXXXXXXXXXX",
                ".....XX....X.......X",
                "....XX....XXX....XXX",
                "X.......X..X.......X",
                "X..XX...X......XX..X",
                "XXXXXXXXXXXXXXXXXXXX",
                "....X......XX.X.X.XX",
                "X......X...X.X.X.X.X",
                "X...X.......X.X.X.XX",
                "XXXXXXXXXX..XXXXXXXX"],
        },

        room4: {
          exits: { n: "room1", s: "room7", e: "room8", w: "room9" },
          backgroundSlide: {dx:-2, dy:0},
          isRotating: false,
          map: ["XX..XXXXX..XXXXX..XX",
                "X...........X..X..XX",
                "XXXXXXXXXXXXX..X..XX",
                "X.................XX",
                "X....X.......XXXXXXX",
                "X...XXXX...X.......X",
                "X.....X....X...XXXXX",
                "X.....XXXXXXX......X",
                "X..................X",
                "XXXXXXXXXX..XXXXXXXX"],
        },

        room5: {
          exits: { n: "room2", s: "room8", e: "room6", w: "room4" },
          backgroundSlide: {dx:-2, dy:0},
          isRotating: true,
          map: ["XXXXXXXXXX..XXXXXXXX",
                "X..................X",
                "X..XXXXXXXXXXXXXX..X",
                "X.....X.........X..X",
                "XXXX...X....X...X..X",
                "X..X....X..X....XXXX",
                "X..X......X........X",
                "X..XXXXXXXXXXXXXX..X",
                "X..................X",
                "XXXXXXXXXX..XXXXXXXX"],
        },

        room6: {
          exits: { n: "room3", s: "room9", e: "room9", w: "room5" },
          backgroundSlide: {dx:2, dy:0},
          isRotating: false,
          map: ["XXXXXXXXXX..XXXXXXXX",
                "X..................X",
                "X........XX........X",
                "X........XX........X",
                "X.....XXXXXXXX.....X",
                "X......XXXXXX......X",
                "X.......XXXX.......X",
                "X........XX........X",
                "X..................X",
                "XXXXXXXXX..XXXXXXXXX"],
        },

        room7: {
          exits: { n: "room4", s: "room9", e: "room8", w: "room9" },
          backgroundSlide: {dx:-2, dy:2},
          isRotating: false,
          map: ["XXXXXXXXXX..XXXXXXXX",
                "X.....X.....X......X",
                "XXXX.XXX.XXXXXXXXX.X",
                "X................X.X",
                "X...XX....XXXXXX...X",
                "XXXXXXX.......XXXXXX",
                "X.XXX.....XXX......X",
                "X.......XXXXXXXXX...",
                "X...............X...",
                "XXXXXXXXXXXXXXXXXXXX"],
        },

        room8: {
          exits: { n: "room5", s: "room9", e: "room9", w: "room7" },
          backgroundSlide: {dx:0, dy:2},
          isRotating: false,
          map: ["XXXXXXXXXX..XXXXXXXX",
                "X...................",
                "X..XXXX.XXXX.XXXX...",
                "X.....X.X..X.X..X..X",
                "X..XXXX.X..X.X..X..X",
                "X.....X.X..X.X..X..X",
                "X..XXXX.XXXX.XXXX..X",
                "...................X",
                "...................X",
                "XXXXXXXXXXXXXXXXXXXX"],
        },

        room9: {
          exits: { n: "room6", s: "room9", e: "room9", w: "room8" },
          backgroundSlide: {dx:1, dy:1},
          isRotating: true,
          map: ["XXXXXXXXX..XXXXXXXXX",
                "...X...............X",
                "...X...............X",
                "XXXX...............X",
                "X........WW........X",
                "X........WW........X",
                "X..................X",
                "X..................X",
                "X..................X",
                "XXXXXXXXXXXXXXXXXXXX"],
        },
    }
};

var MAP_EMPTY = 0;
var MAP_BLOCK = 1;
var MAP_WIN_BLOCK = 2;

function gameMapFromAscii( roomName )
{
    var theRoom = worldData.rooms[roomName];
    if( !theRoom ) return undefined;

    var localMap = {
        size: {
            width: worldData.roomSize.width,
            height: worldData.roomSize.height
        },
        exits: { n:undefined, s:undefined, e:undefined, w:undefined },
        backgroundSlide: theRoom.backgroundSlide,
        isRotating: theRoom.isRotating,
        map: [],
    };

    localMap.exits.n = theRoom.exits.n;
    localMap.exits.e = theRoom.exits.e;
    localMap.exits.s = theRoom.exits.s;
    localMap.exits.w = theRoom.exits.w;

    for( var y = 0; y < worldData.roomSize.height; y++ )
    {
        for( var x = 0; x < worldData.roomSize.width; x++ )
        {
            var c = theRoom.map[y].charAt(x);
            var index = worldData.roomSize.width * y + x;

            switch( c )
            {
                case ".": // empty space
                    localMap.map[index] = MAP_EMPTY;
                    break;
                case "X": // block
                    localMap.map[index] = MAP_BLOCK;
                    break;
                case "W": // win block
                    localMap.map[index] = MAP_WIN_BLOCK;
                    break;

                default:
                    gMap.map[index] = MAP_EMPTY;
                    localMap;
            }
        }
    }

    return localMap;
}