$(function(){
	var path = location.pathname;
	var pills = $(".nav-pills li");

	if (path == "/") {
		pills.removeClass("active");
		pills.eq(0).addClass("active");
	} else {
		var split = path.split("/");
		var last = split[split.length-1];
		if(last == "list") {
			pills.removeClass("active");
			pills.eq(1).addClass("active");
		}else if(last == "movie"){
			pills.removeClass("active");
			pills.eq(2).addClass("active");
		}
	}
})