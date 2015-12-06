var board;
var dragBlockl,dragBlockt;
var blockD=100;
var marginVal;

var N = 2;

function moveLimit(dragged) {
		//prompt(emptyX + " " + emptyY
		var draggedX,draggedY;
		var emptyX,emptyY;
		for(var i=0;i<N;i++) for(var j=0;j<N;j++){
			if($(dragged).is(board[i][j])) draggedX=i,draggedY=j;
			if($('.empty').is(board[i][j])) emptyX=i,emptyY=j;
		}

		var off = $('.board').offset();
		var offY = off.left+draggedY*marginVal+draggedY*blockD;
		var offX = off.top+draggedX*marginVal+draggedX*blockD;

		//Down
		if(emptyY===draggedY&&emptyX===draggedX+1) 
			return [offY,offX,offY,offX+marginVal+blockD];
			
		//Up
		else if(emptyY===draggedY&&emptyX===draggedX-1) 
			return [offY,offX-marginVal-blockD,offY,offX];

		//Right
		else if(emptyY===draggedY-1&&emptyX===draggedX) 
			return [offY-marginVal-blockD,offX,offY,offX];

		//Left
		else if(emptyY===draggedY+1&&emptyX===draggedX) 
			return [offY,offX,offY+marginVal+blockD,offX];
			

		return [offY,offX,offY,offX];
	};

function swapBlocks(event,ui){
	var draggedX,draggedY;
	var emptyX,emptyY;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		if($(ui.helper).is(board[i][j])) draggedX=i,draggedY=j;
		if($('.empty').is(board[i][j])) emptyX=i,emptyY=j;
	}

	var originPos = {
		left: draggedY*marginVal+draggedY*blockD,
		top: draggedX*marginVal+draggedX*blockD
	};

	var p = {
		left: board[emptyX][emptyY].position().left - board[draggedX][draggedY].position().left,
		top: board[emptyX][emptyY].position().top - board[draggedX][draggedY].position().top
	};
	p.left = Math.abs(p.left);   p.top = Math.abs(p.top);

	if(p.left+p.top<=(blockD+marginVal)/2) {

		var tmp = board[emptyX][emptyY].position();
		board[emptyX][emptyY].css({ "top": originPos.top, "left": originPos.left});
		board[draggedX][draggedY].css({ "top": tmp.top, "left": tmp.left});

		originPos = tmp;

		tmp = board[emptyX][emptyY];
		board[emptyX][emptyY] = board[draggedX][draggedY];
		board[draggedX][draggedY] = tmp;

		draggedX = emptyX;
		draggedY = emptyY;
	}
	board[draggedX][draggedY].css({ "top": originPos.top, "left": originPos.left });
};

function MoveGenerator(heu){
	var emptyX,emptyY;
	var Q = new PriorityQueue({ comparator: function(a, b) { 
		if(a[0]+a[1]>b[0]+b[1]) return 1;
		return -1;
	}});
	var map = new Map();
	var b=[];
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		if(!j) b.push([]);
		b[i].push(parseInt(board[i][j][0].outerText,10));
		if(b[i][j]===N*N) emptyX=i,emptyY=j;
	}

	Q.queue([0,heu,emptyX,emptyY,b]);
	while(Q.length){
		var cur = Q.dequeue();
		function swapBoard(x,y){
			var tmp = nb[x][y];
			nb[x][y] = nb[cur[2]][cur[3]];
			nb[cur[2]][cur[3]] = tmp;
		}
		if(cur[2]>0){
			//
			heu = cur[1];
			var x = Math.floor(cur[4][cur[2]-1][cur[3]]/N);
			var y = Math.floor(cur[4][cur[2]-1][cur[3]]%N);

			if(!y)x--;
			if(x>=cur[2]) heu--;
			else heu++;
			heu++;

			var nb = $.extend(true, [], cur[4]); 
			swapBoard(cur[2]-1,cur[3]);

			Q.queue([cur[0]+1,heu,cur[2]-1,cur[3],nb]);

			if(!map.has(nb)) map.set(nb,cur[4]);

			
		}
		if(cur[2]<N-1){
			heu = cur[1];
			var x = Math.floor(cur[4][cur[2]+1][cur[3]]/N);
			var y = Math.floor(cur[4][cur[2]+1][cur[3]]%N);
			if(!y)x--;
			if(x<=cur[2]) heu--;
			else heu++;
			heu--;

			var nb = $.extend(true, [], cur[4]); 
			swapBoard(cur[2]+1,cur[3]);

			Q.queue([cur[0]+1,heu,cur[2]+1,cur[3],nb]);

			if(!map.has(nb)) map.set(nb,cur[4]);

			if(!heu) return [map,nb];
		}
		if(cur[3]>0){
			heu = cur[1];
			var x = Math.floor(cur[4][cur[2]][cur[3]-1]/N);
			var y = Math.floor(cur[4][cur[2]][cur[3]-1]%N);
			if(!y)x--,y=N-1;
			else y--;
			if(y>=cur[3]) heu--;
			else heu++;
			heu++;

			var nb = $.extend(true, [], cur[4]); 
			swapBoard(cur[2],cur[3]-1);

			Q.queue([cur[0]+1,heu,cur[2],cur[3]-1,nb]);

			if(!map.has(nb)) map.set(nb,cur[4]);
		}
		if(cur[3]<N-1){
			heu = cur[1];
			var x = Math.floor(cur[4][cur[2]][cur[3]+1]/N);
			var y = Math.floor(cur[4][cur[2]][cur[3]+1]%N);
			if(!y)x--,y=N-1;
			else y--;
			if(y<=cur[3]) heu--;
			else heu++;
			heu--;

			var nb = $.extend(true, [], cur[4]); 	
			swapBoard(cur[2],cur[3]+1);

			Q.queue([cur[0]+1,heu,cur[2],cur[3]+1,nb]);

			if(!map.has(nb)) map.set(nb,cur[4]);

			if(!heu) return [map,nb];
		}
	}
}

var resolve = function(){
	
	var heu=0;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		var x = Math.floor(parseInt(board[i][j][0].outerText,10)/N);
		var y = Math.floor(parseInt(board[i][j][0].outerText,10)%N);
		y--;
		if(y<0) x--,y=N-1;
		heu+=Math.abs(i-x)+Math.abs(j-y);
	}
	if(!heu) return;
	$( ".solve" ).unbind( "click", resolve );
	$( ".block" ).draggable( 'disable' );
	var ret = MoveGenerator(heu);
	var map = ret[0];
	var b=ret[1];
	var moves = [];
	moves.push([(N-1)*marginVal+(N-1)*blockD,(N-1)*marginVal+(N-1)*blockD,N-1,N-1]);
	var tmp ;
	while(tmp = map.get(b)){
		b=tmp;
		for(var i=0;i<N;i++) for(var j=0;j<N;j++){
			if(b[i][j]===N*N) moves.push([i*marginVal+i*blockD,j*marginVal+j*blockD,i,j]);
		}
	}

	function anm(i){
		if(!i){ $('.solve').on("click",resolve); $( ".block" ).draggable( 'enable' ); return; }

			$('.empty').animate({
				top: moves[i-1][0],
				left: moves[i-1][1]
			},500);
			board[moves[i-1][2]][moves[i-1][3]].animate({
					top: moves[i][0], 
					left: moves[i][1]
			},500);
			board[moves[i-1][2]][moves[i-1][3]].promise().done(function(){
				
				anm(i-1);
			});
			var tmp = board[moves[i-1][2]][moves[i-1][3]];
			board[moves[i-1][2]][moves[i-1][3]] = board[moves[i][2]][moves[i][3]];
			board[moves[i][2]][moves[i][3]] = tmp;
			
	}
	anm(moves.length-1);
	
}

function updateCSS(){
	
	$('.block').css({
		"margin-top": marginVal, 
		"margin-left": marginVal, 
		"height": blockD, 
		"width": blockD,
		"font-size": 4*marginVal,
		"border-radius": marginVal,
	});
	
	$('.block').css("line-height",(blockD-marginVal)+"px");

	//
	var tmp;
	$('.block').mousedown(function(){
		tmp = moveLimit($(this));
	}).mousemove(function(){
		$('.block').draggable({
			"scroll":false,
			containment:tmp,
			stop: swapBlocks
		});
	});
}

function Initialize(){
	$('.board').empty();
	marginVal = $('.board').width()/(1+8*N);
	blockD = 7*marginVal;

	board=[];
	var t = $('#container').height()/2-$('.board').height()/2;
	var l = $('#container').width()/2-$('.board').width()/2;

	$('.board').offset({top: t, left: l + $('#container').offset().left });
	emptyX=emptyY=N-1;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		if(!j) board.push([]);
		board[i].push($("<div class='block'>"+(i*N+j+1)+"</div>"));
		if(i===emptyX&&j===emptyY) board[i][j].addClass("empty");
		board[i][j].offset({top:i*marginVal+i*blockD,left:j*marginVal+j*blockD});
		$(".board").append(board[i][j]);
	}
	updateCSS();
}

var main = function(){

	//$('.handler').offset({left:$('.handler').offset().left + 40.5});
	Initialize();
	

	$('.solve').on("click",resolve);

	var handler = $('.handler').offset().left;
	$('.handler').draggable({
		start: function(e,ui){
			handler = $('.handler').offset().left;
		},
		axis: 'x',
		grid: [39.2,0],
		containment: "parent",
		drag: function(e,ui){
			N=2+Math.floor(($('.handler').offset().left-47.5)/39.2);
			Initialize();
		}
	});
	
};

$(document).ready(main);