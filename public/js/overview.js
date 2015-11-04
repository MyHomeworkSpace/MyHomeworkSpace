window.overview = {};
var score = 0;
window.overview.display = funtion(){
	window.overview.getSubjects();
}
window.overview.getSubjects = function() {
	//get the number of subjects here
	window.overview.getHw();
}
window.overview.getHw = function() {
	//get the number of hw for each subject
	addScore = 0;
	score = score + addScore
	window.overview.getHwPerSubjectws();
}
window.overview.getHwPerSubjects = function(score){
	//display gif per score
	if score = 0{
		return("http://img.ifcdn.com/images/90ad661e90f3235a78a4f96cc2384353f666cc16bd6ae969f2a9b182267b483b_1.gif")
	}
	if score = 1{
		return("https://33.media.tumblr.com/c469e7b3f1ba602c0534db2e04b2c21f/tumblr_mmsqi4Aq9N1sp9fcho1_500.gif")
	}
	if score = 2{
		return("http://o.aolcdn.com/hss/storage/midas/8d55e186f81bc1bf60e896eed1824bcb/202448929/Homework-GIFS.gif")
	}
	if score = 3{
		return("https://s-media-cache-ak0.pinimg.com/originals/2b/69/7d/2b697df80f3f661fd86613b2d7eafa4b.gif")
	}
	if score = 4{
		return("http://gificiency.com/m/caffeine-fry.gif")
	}
	if score = 5{
		return("http://media.giphy.com/media/FqAwoNjVneJxK/giphy.gif")
	}
	if score = 6{
		return("https://www.google.com/search?noj=1&tbm=isch&sa=1&q=no+sleep+gif&oq=no+sleep+gif&gs_l=img.3..0i7i30l3j0i7i5i30l2.5419.6584.0.6700.8.8.0.0.0.0.105.477.3j2.5.0....0...1c.1.64.img..3.5.476.u1AZVPIw0iI#imgrc=0QCjSU0If1RBFM%3A")
		
	}if score = 7{
		return("http://vignette4.wikia.nocookie.net/degrassi/images/f/f0/AD0jyxw_460sa.gif/revision/latest?cb=20131002162427")	
	}
}
$(document).ready(function() {
	$("#overview").on("tabOpened", function() {
		$(".overview-date").text(window.utils.formatDate_english(new Date()));
	});
	display = window.overview.display();
	
});
