function load()
{
    PrototypeApp();
}

var theKeymap = { left: false, right: false, up: false, down: false };

function PrototypeApp()
{
    var theCanvas = document.getElementById("TheCanvas");
    var canvasContext = theCanvas.getContext("2d");
    var gameTileWidth = 32;
    var gameTileHeight = 32;

    var gameMap;
    var whiteNoiseImg, playerImg;

    var bHideStatic = false;

    var playerPos = { x:64, y:64 };
    var backgroundOffset = { x:0, y:0 };
    var backgroundMovement = { dx:1, dy:1 };
    var backgroundRot = 0;
    var bRotating = false;

    var bBackgroundMoving = true;
    var backgroundPause = 0;

    //---------------------------------------------------------------------------
    // drawScreen
    //---------------------------------------------------------------------------

    function drawRotatingBackground()
    {
        if( !whiteNoiseImg || bHideStatic )
        {
            canvasContext.fillStyle = "#000000";
            canvasContext.fillRect( 0, 0, 640, 320 );
            return;
        }


        var context = canvasContext;
        context.save();
        context.setTransform( 1, 0, 0, 1, 0, 0 );

        context.translate( 320, 160 ); // canvas center
        var ang = backgroundRot * Math.PI / 180;
        context.rotate( ang );
        context.translate( -450, -450 ); // img center
        context.drawImage( whiteNoiseImg, 0, 0 );

        context.restore();
    }

    function drawMovingBackground()
    {
        if( !whiteNoiseImg || bHideStatic )
        {
            canvasContext.fillStyle = "#000000";
            canvasContext.fillRect( 0, 0, 640, 320 );
            return;
        }

        var initialHeight = whiteNoiseImg.height - backgroundOffset.y;
        var secondaryHeight = 320 - initialHeight;

        var initialWidth = whiteNoiseImg.width - backgroundOffset.x;
        var secondaryWidth = 640 - initialWidth;

        canvasContext.drawImage( whiteNoiseImg, backgroundOffset.x, backgroundOffset.y, initialWidth, initialHeight,
            0, 0, initialWidth, initialHeight );

        if( secondaryWidth > 0 )
        canvasContext.drawImage( whiteNoiseImg, 0, backgroundOffset.y, secondaryWidth, initialHeight,
            initialWidth, 0, secondaryWidth, initialHeight );


        if( secondaryHeight < 0 ) return;

        canvasContext.drawImage( whiteNoiseImg, backgroundOffset.x, 0, initialWidth, secondaryHeight,
            0, initialHeight, initialWidth, secondaryHeight );

        if( secondaryWidth > 0 )
        canvasContext.drawImage( whiteNoiseImg, 0, 0, secondaryWidth, secondaryHeight,
            initialWidth, initialHeight, secondaryWidth, secondaryHeight );
    }

    function drawNoiseTile( x, y )
    {
        canvasContext.drawImage( whiteNoiseImg,
            x*gameTileWidth, y*gameTileHeight, gameTileWidth, gameTileHeight,
            x*gameTileWidth, y*gameTileHeight, gameTileWidth, gameTileHeight);
    }

    var pulse = 0;
    var dpulse = 1;
    function drawScreen()
    {
        if( !gameMap )
            return;

        if( bRotating )
            drawRotatingBackground();
        else
            drawMovingBackground();


        for( var y = 0; y < gameMap.size.height; y++ )
        {
            for( var x = 0; x < gameMap.size.width; x++ )
            {
                var mapIndex = gameMap.size.width * y + x;
                var value = gameMap.map[mapIndex];

                switch(value)
                {
                    case MAP_EMPTY:
                        break;
                    case MAP_BLOCK:
                        drawNoiseTile( x, y );
                        break;
                    case MAP_WIN_BLOCK:
                        canvasContext.fillStyle = "#ff0000";
                        canvasContext.fillRect( x * gameTileWidth, y * gameTileHeight,
                            gameTileWidth, gameTileHeight );
                        break;
                    default:
                        canvasContext.fillStyle = "#ffff00";
                        canvasContext.fillRect( x * gameTileWidth, y * gameTileHeight,
                            gameTileWidth, gameTileHeight );
                        break;
                }

            }
        }

        //pulse += dpulse;
        //if( pulse >= 16 ) { pulse = 16; dpulse = -dpulse; }
        //if( pulse <= 0 ) { pulse = 0; dpulse = -dpulse; }

        //canvasContext.drawImage( playerImg, 0, 0, playerImg.width, playerImg.height,
        //    playerPos.x-(16+pulse)/2, playerPos.y-(16+pulse)/2, 16+pulse, 16+pulse );


        var context = canvasContext;
        canvasContext.save();
        canvasContext.setTransform( 1, 0, 0, 1, 0, 0 );

        canvasContext.translate( playerPos.x, playerPos.y ); // canvas center
        var ang = backgroundRot * Math.PI * 2 / 180;
        canvasContext.rotate( ang );
        canvasContext.translate( -16, -16 ); // img center
        canvasContext.drawImage( playerImg, 0, 0 );

        canvasContext.restore();

        var tileX = Math.floor(playerPos.x/32);
        var tileY = Math.floor(playerPos.y/32);
        if( gameMap.map[gameMap.size.width * tileY + tileX] == MAP_WIN_BLOCK )
        {
            canvasContext.fillStyle = "#888800";
            canvasContext.font = "90px _sans";
            canvasContext.textBaseline = "top";
            canvasContext.fillText("You Winner!!", 64, 64 );
        }
    }

    function update()
    {
        backgroundPause+=2;
        if( backgroundPause > 1000 )
            backgroundPause = 0;

        if( bBackgroundMoving && backgroundPause < 500)
        {
            backgroundOffset.x += backgroundMovement.dx;
            backgroundOffset.y += backgroundMovement.dy;

            if( backgroundOffset.x >= whiteNoiseImg.width )
                backgroundOffset.x = 0;
            if( backgroundOffset.x < 0 )
                backgroundOffset.x = whiteNoiseImg.width;

            if( backgroundOffset.y >= whiteNoiseImg.height )
                backgroundOffset.y = 0;
            if( backgroundOffset.y < 0 )
                backgroundOffset.y = whiteNoiseImg.height;


            backgroundRot += 2;
            if( backgroundRot >= 360 )
                backgroundRot = 0;
        }

        var newRoom = update_player( playerPos, gameMap );

        if( newRoom )
            initializeLevel( newRoom );

        drawScreen();
    }

    //---------------------------------------------------------------------------
    // Event
    //---------------------------------------------------------------------------
    function eventKeyPressed( e )
    {
        var letterPressed = String.fromCharCode( e.keyCode );
        switch( letterPressed )
        {
            case "A": theKeymap.left = true; break;
            case "S": theKeymap.down = true; break;
            case "W": theKeymap.up = true; break;
            case "D": theKeymap.right = true; break;

            case "J": backgroundMovement.dx++; break;
            case "L": backgroundMovement.dx--; break;
            case "I": backgroundMovement.dy++; break;
            case "K": backgroundMovement.dy--; break;
        }
    }

    function eventKeyReleased( e )
    {
        var letterPressed = String.fromCharCode( e.keyCode );
        switch( letterPressed )
        {
            case "A": theKeymap.left = false; break;
            case "S": theKeymap.down = false; break;
            case "W": theKeymap.up = false; break;
            case "D": theKeymap.right = false; break;
            case "X": bHideStatic = !bHideStatic; break;
        }
    }



    //---------------------------------------------------------------------------
    // Init
    //---------------------------------------------------------------------------

    function initializeLevel( roomName )
    {
        gameMap = gameMapFromAscii(roomName);

        backgroundOffset.x = backgroundOffset.y = 0;
        backgroundMovement.dx = gameMap.backgroundSlide.dx;
        backgroundMovement.dy = gameMap.backgroundSlide.dy;
        //playerPos.x = playerPos.y = 64;
        bRotating = gameMap.isRotating;
        backgroundRot = 0;
    }

    var imagesLoaded = 0;
    function imageLoaded()
    {
        imagesLoaded++;
        if( imagesLoaded < 2 ) return;

        window.addEventListener("keydown", eventKeyPressed, true );
        window.addEventListener("keyup", eventKeyReleased, true );

        initializeLevel("room1");
        playerPos.x = worldData.initialPlayerPos.x;
        playerPos.y = worldData.initialPlayerPos.y;
        setInterval( update, 1000/60 );
    }

    whiteNoiseImg = new Image();
    whiteNoiseImg.src = "static/game1/whitenoise.png";
    whiteNoiseImg.onload = imageLoaded;

    playerImg = new Image();
    playerImg.src = "static/game1/player.png";
    playerImg.onload = imageLoaded;
}
