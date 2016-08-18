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
      Piece: function(color, code){
          this.color = color;
          this.moves = [];
          this.hasMoved = false;
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
              if(color == 'black')
                xpos = 5;
              else
                xpos = 4;
              this.position = {x: xpos, y: r};
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+xpos+"']"));
              string = color + "Queen";
              $(cell).removeClass('empty');
              $(cell).addClass(string).addClass(color);
          }
          else if(code == 13){
              this.type = "king";
              this.value = 9999;
              if(color == 'black')
                xpos = 4;
              else
                xpos = 5;
              this.position = {x: xpos, y: r};
              cell = ($(".chessCell[data-row='"+r +"'][data-cell='"+xpos +"']"));
              string = color + "King";
              $(cell).addClass(string).addClass(color);
              $(cell).removeClass('empty');
              
          } 
          this.moves = this.getMoves();
    },
    bindPieceMoves: function(){
        this.Piece.prototype.getMoves = function(){
            console.log("MOVES");
            var self = this;
            var moves = [];
            var position = this.position;
            
            if(this.type =="pawn")
            {
                console.log("PAWN");
                var i = (this.color == 'white') ? -1 : 1;
                var cell = Chess.findCellByPosition(position.x, position.y + i);
                if($(cell).hasClass("empty")){
                    moves.push({x: position.x, y: position.y + i});
                cell = Chess.findCellByPosition(position.x, position.y + i*2);
                if(this.hasMoved == false && cell.hasClass('empty'))
                    moves.push({x: position.x, y: position.y + i*2});
                }
            
            }
            
            
            return moves;
        };
    },
    findCellByPosition: function(x, y){
        if(x<1 || x >8 || y < 1 || y > 8)
        return undefined;
        return $(".chessCell[data-row='"+y+"'][data-cell='"+x+"'");
    },
    load: function(){
        this.bindPieceMoves();
            this.players.push(new this.Player("white"));
            this.players.push(new this.Player("black"));
        this.currentColor = 'white';
        $(".chessCell").on('mouseover', function(e){
            if($(this).hasClass(Chess.currentColor))
                $(this).css('cursor', 'pointer');
            else
                $(this).css('cursor', 'default');
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
            console.log(n +", " +i);
            $(cell).addClass("empty");
            if((n - i) % 2 == 1 || (n-i)%2 == -1)
                $(cell).addClass('chessCellWhite');
            $(row).append(cell);
        }
        $(table).append(row);
        
    }
    Chess.load();
});