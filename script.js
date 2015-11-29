var board;
var dragBlockl,dragBlockt;
var blockD=100;
var marginVal = 13;
var emptyX,emptyY;
var N = 2;


function moveLimit(dragged) {
		//prompt(emptyX + " " + emptyY
		var x1=(dragBlockl=dragged.offset().left)-marginVal;
		var y1=(dragBlockt=dragged.offset().top)-marginVal;
		var x2=board[emptyX][emptyY].offset().left-marginVal;
		var y2=board[emptyX][emptyY].offset().top-marginVal;
		var inc = dragged.height() + marginVal;

		//Down
		if(emptyX&&dragged.is(board[emptyX-1][emptyY])) return [x1,y1,x1,y1+inc];
		//Up
		else if(emptyX<board.length-1&&dragged.is(board[emptyX+1][emptyY])) return [x1,y2,x1,y2+inc];
		//Right
		else if(emptyY&&dragged.is(board[emptyX][emptyY-1])) return [x1,y1,x1+inc,y1];
		//Left
		else if(emptyY<board.length-1&&dragged.is(board[emptyX][emptyY+1])) return [x2,y1,x1,y1];

		return [x1,y1,x1,y1];
	};

function swapBlocks(event,ui){
	var draggedX,draggedY;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		if($(ui.helper).is(board[i][j])) draggedX=i,draggedY=j;
	}
	var x1=ui.offset.left-marginVal;
	var y1=ui.offset.top-marginVal;
	var x2=$('.empty').offset().left-marginVal;
	var y2=$('.empty').offset().top-marginVal;

	if(Math.abs(x1-x2)+Math.abs(y1-y2)<=(board[draggedX][draggedY].height()+marginVal)/2) {
		var tmp = $('.empty').offset();
		$('.empty').offset({ top: dragBlockt, left: dragBlockl});
		dragBlockt = tmp.top; dragBlockl=tmp.left;

		tmp = board[emptyX][emptyY]; 
		board[emptyX][emptyY] = board[draggedX][draggedY];
		board[draggedX][draggedY]=tmp;

		tmp = emptyX;
		emptyX = draggedX;
		draggedX = tmp;

		tmp = emptyY;
		emptyY = draggedY;
		draggedY = tmp;
	}
	board[draggedX][draggedY].offset({ top: dragBlockt, left: dragBlockl});
};

function resolve(){
	
}

function Initialize(){

	$('.board').empty();
	$('.board').width(marginVal+N*(marginVal+blockD));
	$('.board').height(marginVal+N*(marginVal+blockD));
	board=[];
	var t = $('.col-md-7').height()/2-$('.board').height()/2;
	var l = $('.col-md-7').width()/2-$('.board').width()/2;

	$('.board').offset({top: t, left: l + $('.col-md-7').offset().left });
	emptyX=emptyY=0;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		if(!j) board.push([]);
		board[i].push($("<div class='block'>"+(i*N+j)+"</div>"));
		if(i===emptyX&&j===emptyY) board[i][j]=$("<div class='empty'></div>");
		$(".board").append(board[i][j]);
	}

	//Drag event listeners
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

var main = function(){
	//$('.handler').offset({left:$('.handler').offset().left + 40.5});
	Initialize();
	

	$('.resolve').click(resolve());

	var handler = $('.handler').offset().left;
	$('.handler').draggable({
		start: function(e,ui){
			handler = $('.handler').offset().left;
		},
		axis: 'x',
		grid: [40.5,0],
		containment: "parent",
		drag: function(e,ui){
			N=2+Math.floor(($('.handler').offset().left-47.5)/40.5);
			Initialize();
		}
	});
	
};

$(document).ready(main);