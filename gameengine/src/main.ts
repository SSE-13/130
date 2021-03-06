
import * as fs from 'fs';


const ASSETS_PATH = __dirname + "\\assets\\";
const SAVE_BTN_PATH = ASSETS_PATH + "Save.png";
const CANCEL_BTN_PATH = ASSETS_PATH + "Cancel.png";
const COLLISION_TILE_PATH = ASSETS_PATH + "x.png";
const REDO_BTN_PATH = ASSETS_PATH + "Redo.png";
const EMPTY_TILE_PATH = ASSETS_PATH + "0.png";

const TILESET_PATH = ASSETS_PATH + "tileset_01.png"

var m_Undolength =0;
var m_Undo = new Array(4);
var m_CurrentTile:editor.Tile = new editor.Tile(0, 0, 0, 0, 0, 0, 0, 0, false, true);
var m_PreviousTile:editor.Tile;
var m_CurrentLayer = 0;
var m_tilesetName = "tileset_01.png";
//var m_RecordTile =  new editor.Tile;

for(var i=0;i<3;i++)
{
    m_Undo[i] = new Array();
}

//================================================================= Initialization =================================================================//
//Render Elements
var m_Stage;
var m_Panel;
var m_RenderCore;
var m_MapEditor:Array<editor.WorldMap>;
var m_Container;

//Buttons
var m_SaveBtn;
var m_UndoBtn;
var m_RedoBtn;
var m_Tileset;

//Editor Elements
var m_EventCore = events.EventCore.getInstance();
m_EventCore.init();

var m_Map = data.Storage.getInstance();

onCreateMap();
Start();

//==============================================================================================================================================//
//================================================================= Functions ==================================================================//
//==============================================================================================================================================//

//Initialization
function Start()
{    
    m_Panel = new editor.ControlPanel();
    m_Panel.x = 300; 
 
    InitUI();
    CreateTileset();
    m_Map.tileset = m_Tileset;
    m_Stage = new render.DisplayObjectContainer();   
    for(var i = 0; i < m_Map.NumLayers; i++)
        m_Stage.addChild(m_MapEditor[i]);
    
    m_Stage.addChild(m_Panel);
    m_Stage.addChild(m_SaveBtn);
    m_Stage.addChild(m_UndoBtn);
    m_Stage.addChild(m_RedoBtn);
    m_Stage.addChild(m_Container);
    
    m_RenderCore = new render.RenderCore();
    m_RenderCore.start(m_Stage);
    m_RenderCore.start(m_Stage, [TILESET_PATH, SAVE_BTN_PATH, EMPTY_TILE_PATH, REDO_BTN_PATH, CANCEL_BTN_PATH, COLLISION_TILE_PATH]);
}


//UI Elements initialization
function InitUI()
{
    //Save button
    m_SaveBtn = new render.Bitmap();
    m_SaveBtn.width = 50;
    m_SaveBtn.height = 50;
    m_SaveBtn.source = SAVE_BTN_PATH;
    m_SaveBtn.x = 525;
    m_SaveBtn.y=0;
    
    //Undo Button
    m_UndoBtn =new render.Bitmap();
    m_UndoBtn.width = 50;
    m_UndoBtn.height = 50;
    m_UndoBtn.source = CANCEL_BTN_PATH;
    m_UndoBtn.x = 525;
    m_UndoBtn.y = 55;
    
    //Redo Button
    m_RedoBtn = new render.Bitmap();
    m_RedoBtn.width = 50;
    m_RedoBtn.height = 50;
    m_RedoBtn.source = REDO_BTN_PATH;
    m_RedoBtn.x = 525;
    m_RedoBtn.y = 110;
    
    m_EventCore.register(m_SaveBtn, HitTest, onSaveClick);
    m_EventCore.register(m_UndoBtn, HitTest, onUndoClick);
    m_EventCore.register(m_RedoBtn, HitTest, onRedoClick);
}



function CreateTileset()
{
    m_Container = new render.DisplayObjectContainer();
    m_Container.x = 600;
    
    m_Tileset = new editor.Tileset(0, m_tilesetName, 32, 32, 256, 2560);
    m_Container.addChild(m_Tileset);

    for(var row = 0; row < m_Tileset.numRows; row++)
    {
        for(var col = 0; col < m_Tileset.numCols; col++)
        {
            var tile = m_Tileset.tiles[row][col];
            m_EventCore.register(tile, HitTest, onTilesetClick); 
        }        
    }
}


//================================================================= Save Map File ==================================================================//
function LoadFile()
{
    //TODO:load functionality    
}

//================================================================= Undo Operation ==================================================================//
function UndoTile() {
    //TODO: Undo Operation
}

//================================================================= Redo Operation ==================================================================//
function RedoTile() {
    //TODO: Redo Operation

}


//================================================================= Create Map Operation ==================================================================//
function createNewMap(width, height)
{
    m_CurrentLayer = 0;
    m_Map.layers = new Array(m_Map.NumLayers);
    m_Map.MapHeight = height;
    m_Map.MapWidth = width;
    
    var mapEditor = new Array(m_Map.NumLayers);
    for(var i = 0; i < m_Map.NumLayers; i++){        
        mapEditor[i] = new editor.WorldMap("layer" + i);
        
        if( i == m_Map.COLLISION_LAYER)
             mapEditor[i] = new editor.WorldMap("collisionLayer");
             
        mapEditor[i].x = 0//i * width * m_Map.TILE_WIDTH;
        mapEditor[i].y = 0;
        mapEditor[i].width = width * m_Map.TILE_WIDTH;
        mapEditor[i].height = height * m_Map.TILE_WIDTH;
        m_Map.layers[i] = new Array(height);
        
        for(var row = 0; row < height; row++)
        {
            m_Map.layers[i][row] = new Array(width);
            for(var col = 0; col < width; col++)
            {
                m_Map.layers[i][row][col] = 0;
                var x = col * m_Map.TILE_WIDTH;
                var y = row * m_Map.TILE_HEIGHT;
                var source = (i == m_Map.COLLISION_LAYER) ? EMPTY_TILE_PATH : TILESET_PATH;
                var tile = new editor.Tile(-1, row, col, m_Map.TILE_WIDTH, m_Map.TILE_HEIGHT, source, x, y, true, true);
                tile.isCollisionTile = (i == m_Map.COLLISION_LAYER);
                mapEditor[i].addChild(tile);
                                            
                m_EventCore.register(tile, HitTest, onMapTileClick);            
            }        
        }   
    }
    
    return mapEditor;
}

//Hit test function
function HitTest (localPoint:math.Point,displayObject:render.DisplayObject){
    return (localPoint.x >= 0 && localPoint.x <= displayObject.width && localPoint.y >= 0 && localPoint.y <= displayObject.height);
}

function onSaveClick() {  
    console.log("Save");   
    m_Map.saveFile();   
}

//===========================================================================================================================================================//
//================================================================= Button Click Listeners ==================================================================//
//===========================================================================================================================================================//

//================================================================= Undo Button ==================================================================//
function onUndoClick() {
    console.log("Undo");   
}

//================================================================= Redo Button ==================================================================//
function onRedoClick() {
    console.log("Redo");
}
//================================================================= Map Tile Button ==================================================================//
function onMapTileClick(tile)
{
    if(m_CurrentLayer != m_Map.COLLISION_LAYER){
        m_Map.layers[m_CurrentLayer][tile.ownedRow][tile.ownedCol] = m_CurrentTile.id;
        tile.setTileAttributes(m_CurrentTile);
    }else{
        tile.setWalkable(!tile.getWalkable());
        tile.source = tile.getWalkable() ?  EMPTY_TILE_PATH : COLLISION_TILE_PATH ;
        m_Map.layers[m_Map.COLLISION_LAYER][tile.ownedRow][tile.ownedCol] = tile.getWalkable() ? 0 : 1;
    }
}

function onTilesetClick(tile)
{
    m_CurrentTile.setSelected(false);
    m_PreviousTile = m_CurrentTile;
    m_CurrentTile = tile;
    m_CurrentTile.setSelected(true);    
}

//================================================================= UI Functions ==================================================================//

function cleanUp()
{
    if(m_MapEditor != null){
        for(var layer = 0; layer < m_Map.NumLayers; layer++){
            for(var col = 0; col < m_Map.MapWidth; col++){
                for(var row = 0; row < m_Map.MapHeight; row++){
                    m_EventCore.unregister(m_MapEditor[layer].getChild(col, row, m_Map.MapWidth));  
                }
            }
        }
    }
}

function onCreateMap()
{
    cleanUp();
    var mapW = parseInt((<HTMLInputElement>document.getElementById("map-width")).value);
    var mapH = parseInt((<HTMLInputElement>document.getElementById("map-height")).value);
    
    m_MapEditor = createNewMap(mapW, mapH);
    onLayerChange();
    Start();
}

function onLayerChange()
{
    m_CurrentLayer = (<HTMLSelectElement>document.getElementById("layer")).selectedIndex;
    for(var i = 0; i < m_Map.NumLayers; i++)
    {
        if(i != m_CurrentLayer){
            m_MapEditor[i].setOpacity(0.5);
            m_MapEditor[i].setActive(false);
        }else{
            m_MapEditor[i].setOpacity(1);
            m_MapEditor[i].setActive(true);
        }
    }
}


/*
function StatusBUr(tile) {
    var Container = new render.DisplayObjectContainer();
    var m_CanPassOrNot = new ui.Button();
    Container.x = 250;
    Container.y = 50;
   
    //var m_bitmap=new render.Bitmap();
    //m_bitmap.source = "Save.png";
    var X = tile.ownedRow + 1;
    var Y = tile.ownedCol + 1;
    var m_postion = new ui.Button();
    m_CanPassOrNot.width = 100;
    m_CanPassOrNot.height = 30;
    m_postion.x = 10;
    m_postion.y = 10;
    m_postion.text = X + ' 行 ' + Y + ' 列 ';
    //m_postion.source = m_bitmap;
    Container.addChild(m_postion);
    m_CanPassOrNot.width = 100;
    m_CanPassOrNot.height = 30;
    m_CanPassOrNot.x = 10;
    m_CanPassOrNot.y = 50;
   // m_CanPassOrNot.source = m_bitmap;
    var m_Background = new render.Rect();
    m_Background.width = 50;
    m_Background.height = 50;
    m_Background.x = 10;
    m_Background.y = 130;
    if (m_MapData[tile.ownedRow][tile.ownedCol] == 0) {
            m_CanPassOrNot.text = "可走";
            m_Background.color = "#FF0000" ;
     }
     else {
            m_CanPassOrNot.text = "不可走";
            m_Background.color = "#0000FF" ;
     }
      m_CanPassOrNot.onClick = ()=> {
        onTileClick(tile);
    }
    Container.addChild(m_CanPassOrNot);
    Container.addChild(m_Background);
    return Container;
}
*/







