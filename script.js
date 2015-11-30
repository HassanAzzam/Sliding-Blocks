var board;
var dragBlockl,dragBlockt;
var blockD=100;
var marginVal;
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
		if(emptyX&&dragged.is(board[emptyX-1][emptyY])) return [x2,y1,x2,y1+inc];
		//Up
		else if(emptyX<board.length-1&&dragged.is(board[emptyX+1][emptyY])) return [x2,y2,x2,y2+inc];
		//Right
		else if(emptyY&&dragged.is(board[emptyX][emptyY-1])) return [x2,y2,x1+inc,y2];
		//Left
		else if(emptyY<board.length-1&&dragged.is(board[emptyX][emptyY+1])) return [x2,y2,x1,y2];

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

function MoveGenerator(heu){
	var Q = new PriorityQueue({ initialValues:[[0,heu,emptyX,emptyY,board]], comparator: function(a, b) { 
		if(a[0]>b[0]||(a[0]===b[0]&&a[1]>b[1])) return 1;
		return 0;
	}});
	while(Q.length){
		var cur = Q.dequeue();
		if(!cur[1]) {
			alert(cur[0]);
			return;
		}
		if(cur[2]>0){
			//
			heu = cur[1];
			var x = Math.floor(parseInt(cur[4][cur[2]-1][cur[3]][0].outerText,10)/N);
			if(x>=cur[2]) heu--;
			else heu++;
			heu--;
			
			//
			var tmp = cur[4][cur[2]-1][cur[3]];
			cur[4][cur[2]-1][cur[3]] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;

			Q.queue([cur[0]+1,heu,cur[2]-1,cur[3],cur[4]]);

			tmp = cur[4][cur[2]-1][cur[3]];
			cur[4][cur[2]-1][cur[3]] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;
		}
		if(cur[2]<N-1){
			heu = cur[1];
			var x = Math.floor(parseInt(cur[4][cur[2]+1][cur[3]][0].outerText,10)/N);
			if(x<=cur[2]) heu--;
			else heu++;
			heu++;

			var tmp = cur[4][cur[2]+1][cur[3]];
			cur[4][cur[2]+1][cur[3]] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;

			Q.queue([cur[0]+1,heu,cur[2]+1,cur[3],cur[4]]);

			tmp = cur[4][cur[2]+1][cur[3]];
			cur[4][cur[2]+1][cur[3]] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;
		}
		if(cur[3]>0){
			heu = cur[1];
			var y = Math.floor(parseInt(cur[4][cur[2]][cur[3]-1][0].outerText,10)%N);
			if(y>=cur[3]) heu--;
			else heu++;
			heu--;

			var tmp = cur[4][cur[2]][cur[3]-1];
			cur[4][cur[2]][cur[3]-1] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;

			Q.queue([cur[0]+1,heu,cur[2],cur[3]-1,cur[4]]);

			tmp = cur[4][cur[2]][cur[3]-1];
			cur[4][cur[2]][cur[3]-1] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;
		}
		if(cur[3]<N-1){
			heu = cur[1];
			var y = Math.floor(parseInt(cur[4][cur[2]][cur[3]+1][0].outerText,10)%N);
			if(y<=cur[3]) heu--;
			else heu++;
			heu++;

			var tmp = cur[4][cur[2]][cur[3]+1];
			cur[4][cur[2]][cur[3]+1] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;

			Q.queue([cur[0]+1,heu,cur[2],cur[3]+1,cur[4]]);

			tmp = cur[4][cur[2]][cur[3]+1];
			cur[4][cur[2]][cur[3]+1] = cur[4][cur[2]][cur[3]];
			cur[4][cur[2]][cur[3]] = tmp;
		}
	}
}

var resolve = function(){
	var heu=0;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		var x = Math.floor(parseInt(board[i][j][0].outerText,10)/N);
		var y = Math.floor(parseInt(board[i][j][0].outerText,10)%N);
		heu+=Math.abs(i-x)+Math.abs(j-y);
	}
	MoveGenerator(heu);

}

function updateCSS(){
	marginVal = $('.board').width()/(1+8*N);
	length = 7*marginVal;
	$('.block').css({
		"margin-top": marginVal, 
		"margin-left": marginVal, 
		"height": length, 
		"width": length,
		"font-size": 4*marginVal
	});

}

function Initialize(){

	//marginVal = $('.block').css("margin-top");
	$('.board').empty();
	/*
	$('.board').width((marginVal+N*(marginVal+blockD)));
	$('.board').height((marginVal+N*(marginVal+blockD)));
	*/
	board=[];
	var t = $('.col-md-7').height()/2-$('.board').height()/2;
	var l = $('.col-md-7').width()/2-$('.board').width()/2;

	$('.board').offset({top: t, left: l + $('.col-md-7').offset().left });
	emptyX=emptyY=0;
	for(var i=0;i<N;i++) for(var j=0;j<N;j++){
		if(!j) board.push([]);
		board[i].push($("<div class='block'>"+(i*N+j)+"</div>"));
		if(i===emptyX&&j===emptyY) board[i][j].addClass("empty");
		$(".board").append(board[i][j]);
	}
	updateCSS();

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
	

	$('.solve').click(resolve);

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