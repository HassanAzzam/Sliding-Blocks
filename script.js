var dragBlockl,dragBlockt;

var marginVal = 13;

function moveLimit() {
		var x1=dragBlockl-marginVal;
		var y1=dragBlockt-marginVal;
		var x2=$('.empty').offset().left-marginVal;
		var y2=$('.empty').offset().top-marginVal;
		var inc = 100 + marginVal;

		//Down
		if(x1===x2&&y2===y1+inc) return [x1,y1,x1,y1+inc];
		//Up
		else if(x1===x2&&y2+inc===y1) return [x1,y2,x1,y2+inc];
		//Left
		else if(x1===x2+inc&&y2===y1) return [x2,y1,x1+inc,y1];
		//Right
		else if(x1+inc===x2&&y2===y1) return [x1,y1,x1+inc,y1];
		return [x1,y1,x1,y1];
	};

function swapBlocks(event,ui){
	var x1=ui.offset.left-marginVal;
	var y1=ui.offset.top-marginVal;
	var x2=$('.empty').offset().left-marginVal;
	var y2=$('.empty').offset().top-marginVal;

	if(Math.abs(x1-x2)+Math.abs(y1-y2)<=(100+marginVal)/2) {
		var tmp = $('.empty').offset();
		$('.empty').offset({ top: dragBlockt, left: dragBlockl});
		dragBlockt = tmp.top; dragBlockl=tmp.left;
	}
	$(this).offset({ top: dragBlockt, left: dragBlockl});
};

function resolve(){

}

var main = function(){
	$('.block').mousedown(function(){
		dragBlockl = $(this).offset().left;
		dragBlockt = $(this).offset().top;
	}).mousemove(function(){
		var tmp = moveLimit();
		$('.block').draggable({
			"scroll":false,
			containment:tmp,
			stop: swapBlocks
		});
	});

	$('.resolve').click(resolve());
};

$(document).ready(main);