
function move_player_right( pos, gameMap )
{
    var tileX = Math.floor((pos.x+13)/32);
	var tileY1 = Math.floor((pos.y-12)/32);
	var tileY2 = Math.floor((pos.y+12)/32);

	if( pos.x + 13 >= 640 )
		{ pos.x++; return; }

    if( gameMap.map[gameMap.size.width * tileY1 + tileX] != MAP_BLOCK
     && gameMap.map[gameMap.size.width * tileY2 + tileX] != MAP_BLOCK )
    	pos.x++;
}
function move_player_left( pos, gameMap )
{
    var tileX = Math.floor((pos.x-13)/32);
	var tileY1 = Math.floor((pos.y-12)/32);
	var tileY2 = Math.floor((pos.y+12)/32);

	if( pos.x - 13 <= 0 )
		{ pos.x--; return; }

    if( gameMap.map[gameMap.size.width * tileY1 + tileX] != MAP_BLOCK
     && gameMap.map[gameMap.size.width * tileY2 + tileX] != MAP_BLOCK )
    	pos.x--;
}

function move_player_down( pos, gameMap )
{
    var tileX1 = Math.floor((pos.x-12)/32);
    var tileX2 = Math.floor((pos.x+12)/32);
	var tileY = Math.floor((pos.y+13)/32);

	if( pos.y + 13 > 320 )
		{ pos.y++; return; }

    if( gameMap.map[gameMap.size.width * tileY + tileX1] != MAP_BLOCK
     && gameMap.map[gameMap.size.width * tileY + tileX2] != MAP_BLOCK )
    	pos.y++;
}

function move_player_up( pos, gameMap )
{
    var tileX1 = Math.floor((pos.x-12)/32);
    var tileX2 = Math.floor((pos.x+12)/32);
	var tileY = Math.floor((pos.y-13)/32);

	if( pos.y - 13 <= 0 )
		{ pos.y--; return; }

    if( gameMap.map[gameMap.size.width * tileY + tileX1] != MAP_BLOCK
     && gameMap.map[gameMap.size.width * tileY + tileX2] != MAP_BLOCK )
    	pos.y--;
}


function update_player( pos, gameMap )
{
	if( theKeymap.right )
	{
		move_player_right( pos, gameMap );
		move_player_right( pos, gameMap );
	}
	else if( theKeymap.left )
	{
		move_player_left( pos, gameMap );
		move_player_left( pos, gameMap );
	}

	if( theKeymap.down )
	{
		move_player_down( pos, gameMap );
		move_player_down( pos, gameMap );
	}
	else if( theKeymap.up ) 
	{
		move_player_up( pos, gameMap );
		move_player_up( pos, gameMap );
	}

	if( pos.x - 12 <= 0 )
	{
		pos.x = 640 - 12;
		return gameMap.exits.w;
	}

	if( pos.x + 12 >= 640)
	{
		pos.x = 12;
		return gameMap.exits.e;
	}

	if( pos.y - 12 <= 0 )
	{
		pos.y = 320 - 12;
		return gameMap.exits.n;
	}

	if( pos.y + 12 >= 320 )
	{
		pos.y = 12;
		return gameMap.exits.s;
	}
}