
let displayCanvas = ()=>{

	var canvas = document.getElementById('backgroundC');
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight; 
	console.log(window.innerWidth+":"+window.innerHeight);
	canvas.width  = width;
	canvas.height = height;

	var background = new Image();
	background.src = "http://lorempixel.com/"+width+"/"+height+"/abstract";

	// Make sure the image is loaded first otherwise nothing will draw.
	background.onload = function(){
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(background,0,0);   
	}
}
displayCanvas();