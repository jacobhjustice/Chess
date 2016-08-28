/*global $*/

var Chess = {
    players: [],
    Player: function (color){
            this.pieces = [];
            this.color = color;
            for(var i = 1; i<= 16; i++){
                var p = new Chess.Piece(color, i);
                this.pieces.push(p);
            }
        },
    check: undefined,
    Piece: function(color, code){
          this.color = color;
          this.moves = [];
          this.hasMoved = false;
          this.setUp = true;
          //Create variable to determine direction?
          var r;
          //change this in future to allow swap side of board
          if(color == 'white'){
            if(code <= 8)
                r = 7;
            else
                r = 8;
          }
          else{
            if(code <= 8)
                r = 2;
            else
                r = 1;
          }
          var cell, string;
          if(code<=8){
              this.type = "pawn";
              this.value = 1;
              this.position = {x: code, y: r};
              
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+code +"']"));
              string = color + "Pawn";
              $(cell).addClass(string).addClass(color);
              $(cell).removeClass('empty');
          }
          else if(code == 9 || code == 16){
              this.type = "rook";
              this.value = 5;
              this.position = {x: code-8, y: r};
              code = code - 8;
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+code +"']"));
              string = color + "Rook";
              $(cell).addClass(string).addClass(color);
              $(cell).removeClass('empty');
          }
          else if(code == 10 || code == 15){
              this.type = "knight";
              this.value = 4;
              this.position = {x: code-8, y: r};
              code = code - 8;
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+code +"']"));
              string = color + "Knight";
              $(cell).addClass(string).addClass(color);
              $(cell).removeClass('empty');
          }
          else if(code == 11 || code == 14){
              this.type = "bishop";
              this.value = 3;
              this.position = {x: code-8, y: r};
              code = code - 8;
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+code +"']"));
              string = color + "Bishop";
              $(cell).addClass(string).addClass(color);
              $(cell).removeClass('empty');
          }
          else if(code == 12){
              this.type = "queen";
              this.value = 11;
              var xpos;
                xpos = 5;

              this.position = {x: xpos, y: r};
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+xpos+"']"));
              string = color + "Queen";
              $(cell).removeClass('empty');
              $(cell).addClass(string).addClass(color);
          }
          else if(code == 13){
              this.type = "king";
              this.value = 9999;
                xpos = 4;
              this.position = {x: xpos, y: r};
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+xpos +"']"));
              string = color + "King";
              $(cell).addClass(string).addClass(color);
              $(cell).removeClass('empty');
              
          } 
          this.moves = this.getMoves();
          Chess.allPieces.push(this);
    },
    getRivalsFutureMoves: function(testMove){
        //used in order to get moves for check and also determine possible losses from moving    
    },
    findKing: function(col){
        
        var ret;
        for(var i =0; i <Chess.players.length; i++){
            if(Chess.players[i].color == col){
            for(var c = 0;  c < Chess.players[i].pieces.length; c++){
                if(Chess.players[i].pieces[c].type == "king")
                ret = Chess.players[i].pieces[c];
            }
            }
        }
        return ret;
    },
    bindPieceMoves: function() {
        this.Piece.prototype.willCauseSelfCheck = function(testMove){
            //made to ensure that moving a piece here will not put player into check  
            //var tPiece = 
            if(this.setUp)
                return false;
            var piece = $.extend({}, this);
            console.log(piece);
            piece.position = testMove;
            var color = piece.color;
            var king;
            if(piece.type =="king")
            king = piece;
            else
            king = Chess.findKing(color);
            for(var i = 0; i <Chess.allPieces.length; i++){
                if((Chess.allPieces[i].color != color && Chess.allPieces[i].type != "king")){
                
                var testPiece = Chess.allPieces[i];
                var m = [];
                if(testPiece.type == "pawn"){
         
                    var i2 = (this.color == 'white') ? 1 : -1;
                    m.push({x: testPiece.position.x + 1, y: testPiece.position.y + i2});
                    m.push({x: testPiece.position.x - 1, y: testPiece.position.y + i2});
                }
                else
                    m = testPiece.getMoves();
                    console.log(m);
                for(var count = 0; count<m.length; count++){
                    if(m[count].x == king.position.x && m[count].y == king.position.y)
                            return true;
                }
                }
            }
            return false;
        };
        this.Piece.prototype.getMoves = function(){

            var self = this;
            var moves = [];
            var position = this.position;
            var opposite;
                if(this.color == "white")
                opposite = "black";
                else
                opposite = "white";
                
            if(this.type =="pawn")
            {

                var i = (this.color == 'white') ? -1 : 1;
                var cell = Chess.findCellByPosition(parseInt(position.x), parseInt(position.y) + i);
                if($(cell).hasClass("empty")){
                    moves.push({x: position.x, y: position.y + i});
                cell = Chess.findCellByPosition(position.x+1, position.y + i);
                
   
                if($(cell).hasClass(opposite))
                
                    moves.push({x: position.x+1, y: position.y + i});
                
                cell = Chess.findCellByPosition(position.x-1, position.y + i);
                if($(cell).hasClass(opposite))
                    moves.push({x: position.x-1, y: position.y + i});
                
                
                cell = Chess.findCellByPosition(position.x, position.y + i*2);
                if(this.hasMoved == false && cell.hasClass('empty'))
                    moves.push({x: position.x, y: position.y + i*2});
                }
            
            }
            if(this.type == "knight"){
                    var cell = Chess.findCellByPosition(this.position.x - 2, this.position.y - 1);
                    if( cell && ($(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x - 2, y: this.position.y - 1});
                    cell = Chess.findCellByPosition(this.position.x - 2, this.position.y + 1);
                    if(cell && ($(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x - 2, y: this.position.y + 1});
                    cell = Chess.findCellByPosition(this.position.x - 1, this.position.y - 2);
                    if(cell && ($(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x - 1, y: this.position.y - 2});
                    cell = Chess.findCellByPosition(this.position.x - 1, this.position.y + 2);
                    if(cell&& ( $(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x - 1, y: this.position.y +2});
                    cell = Chess.findCellByPosition(this.position.x + 2, this.position.y - 1);
                    if( cell && ($(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x + 2, y: this.position.y - 1});
                    cell = Chess.findCellByPosition(this.position.x + 2, this.position.y + 1);
                    if(cell && ($(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x + 2, y: this.position.y + 1});
                    cell = Chess.findCellByPosition(this.position.x + 1, this.position.y - 2);
                    if(cell && ($(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x + 1, y: this.position.y - 2});
                    cell = Chess.findCellByPosition(this.position.x + 1, this.position.y + 2);
                    if(cell&& ( $(cell).hasClass('empty') || $(cell).hasClass(opposite)))
                        moves.push({x: this.position.x + 1, y: this.position.y +2});
                        
                    
                }
                if(this.type=="king"){
                    for(var i = -1; i <= 1; i++){
                        
                        for(var j = -1; j <= 1; j++){
                            console.log("#");
                            if(!(i== 0 && j == 0)){
                                cell = Chess.findCellByPosition(this.position.x + i, this.position.y + j);
                                if(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                                    var move = {x: this.position.x + i, y: this.position.y + j};
                                    if(!this.willCauseSelfCheck(move))
                                        moves.push(move);
                                }
                                
                            }
                        }
                    }
                }
                if(this.type=="bishop" || this.type == "queen"){
                    var x = 1; var y = 1;
                    var cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        x++;
                        y++;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                    x = 1, y = -1;
                    cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        x++;
                        y--;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                    x = -1, y = 1;
                    cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        x--;
                        y++;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                    x = -1, y = -1;
                    cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        x--;
                        y--;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                }
                if(this.type =="rook" || this.type == "queen"){
                    var x = 0; var y = 1;
                    var cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        y++;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                    x = 1, y = 0;
                    cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        x++;
                        
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                    x = -1, y = 0;
                    cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        x--;
                        y;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                    x = 0, y = -1;
                    cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    while(cell && ($(cell).hasClass(opposite) || $(cell).hasClass('empty'))){
                        moves.push({x: this.position.x + x, y: this.position.y + y});
                        if($(cell).hasClass(opposite))
                            {
                                x = -99;
                                y = -99;
                            }
                        
                        y--;
                        cell = Chess.findCellByPosition(this.position.x + x, this.position.y + y);
                    }
                }

            
            this.setUp = false;
            return moves;
        };
    },
    findCellByPosition: function(x, y){
        if(x<1 || x >8 || y < 1 || y > 8)
        return undefined;
        return $(".chessCell[data-row='"+y+"'][data-cell='"+x+"'");
    },
    findPieceByPosition: function(x, y){
        for(var i = 0; i <=Chess.allPieces.length; i++){
            var piece = Chess.allPieces[i];
            if(piece.position.x == x && piece.position.y == y)
            return piece;
        }
        return undefined;
    },
    load: function(){
        this.allPieces = [];
        this.bindPieceMoves();
        this.moving = undefined;
            this.players.push(new this.Player("white"));
            this.players.push(new this.Player("black"));
        this.currentColor = 'white';
        $(".chessCellMoveable").on('click', function(e){
            console.log("!");
            $(this).css('cursor', 'default');
            var p = Chess.moving;
            var cell = Chess.findCellByPosition(p.position.x, p.position.y);
            var rstring = p.color + p.type.charAt(0).toUpperCase() + p.type.substring(1);
            cell.removeClass(p.color).removeClass(rstring);
            $(this).addClass(p.color).removeClass(rstring);
            p.position = {x: $(this).attr('data-cell'), y: $(this).attr('data-row')};
            p.hasMoved = true;
            console.log(p);
        });
        $(".chessCell").on('mouseover', function(e){
            if($(this).hasClass(Chess.currentColor) || $(this).hasClass('chessCellMoveable'))
                $(this).css('cursor', 'pointer');
            else
                $(this).css('cursor', 'default');
        });
        $(".chessCell").on('click', function(e){
            if($(this).hasClass('chessCellMoveable')){
                Chess.check = undefined;
            $(this).css('cursor', 'default');
            var p = Chess.moving;
            var opposite;
            if(p.color == "white")
                opposite = "black";
                else
                opposite = "white";
            var cell = Chess.findCellByPosition(p.position.x, p.position.y);
            var rstring = p.color + p.type.charAt(0).toUpperCase() + p.type.substring(1);
            cell.removeClass(p.color).removeClass(rstring).addClass('empty');
            if($(this).hasClass(opposite))
            {   console.log(opposite);
                var m = Chess.findPieceByPosition(parseInt($(this).attr('data-cell')), parseInt($(this).attr('data-row')));
                //remove m
                m.position = { x: -5, y: -5};
                $(this).removeClass(opposite).removeClass(opposite + m.type.charAt(0).toUpperCase() + m.type.substring((1)));
                
            }
            $(this).addClass(p.color).addClass(rstring).removeClass('empty');
            p.position = {x: parseInt($(this).attr('data-cell')), y: parseInt($(this).attr('data-row'))};
            p.hasMoved = true;
            for(var i = 0; i < Chess.allPieces.length; i++){
                var a = Chess.allPieces[i];
                a.moves = a.getMoves();
                //set check
                if(a.moves.length > 0)
                    {
                        var king = Chess.findKing(opposite);
                        if(Chess.check == undefined){
                        for(var counter = 0; counter < a.moves.length; counter++){
                            if(a.moves[counter].x == king.position.x && a.moves[counter].y == king.position.y){
                                Chess.check = opposite;
                                break;
                            }
                        }
                        }
                    }
            }
            console.log(p);
            $(".chessCellMoveable").removeClass("chessCellMoveable");
            if(Chess.currentColor == "white")
                Chess.currentColor = "black";
            else
                Chess.currentColor = "white";
            Chess.movine = undefined;
                
            }
            else{
            $(".chessCellMoveable").removeClass("chessCellMoveable");
            if(!$(this).hasClass(Chess.currentColor))
                return;
            var piece = Chess.findPieceByPosition($(this).attr('data-cell'), $(this).attr('data-row'));
            for(var c = 0; c<piece.moves.length; c++){
                var mo = piece.moves[c];
                $(".chessCell[data-cell='"+mo.x +"'][data-row='"+mo.y+"'").addClass('chessCellMoveable');
            }
            Chess.moving = piece;
            }
        });
        
    },
};


$(document).ready(function(){
    var table = $("#board");
    for(var i =1; i <= 8; i++ ){
        var row = $("<tr>");
        for(var n = 1; n <= 8; n ++){
            var cell = $('<td>');
            $(cell).attr('data-row', i);
            $(cell).attr('data-cell', n);
            $(cell).addClass('chessCell');
            $(cell).addClass("empty");
            if((n - i) % 2 == 1 || (n-i)%2 == -1)
                $(cell).addClass('chessCellWhite');
            $(row).append(cell);
        }
        $(table).append(row);
        
    }
    Chess.load();
});