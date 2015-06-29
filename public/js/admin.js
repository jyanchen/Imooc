$(function() {
	// delete a movie info
	$(".del").click(function(e) {
		var target = $(e.target);
		var id = target.data("id");
		var tr = $(".item-id-" + id);
		var msg = "删除电影 \"" + tr.find(".name").text() + "\" 的信息？";

		if (confirm(msg)) {
			$.ajax({
				type: "DELETE",
				url: "/admin/movie/list?id=" + id
			}).done(function(res) {
				if (res.success === 1) {
					if (tr.length > 0) {
						tr.remove();
					}
				}
			});
		}
	});



	/**
	 * 电影录入页面相关的JS
	 */
	var mt_arr = [];
	if ($("#J_MovieType").length) {
		$("#J_MovieType .radio-inline").each(function() {
			mt_arr.push($(this).text().trim());
		});
		// console.log(mt_arr);
	}
	// async douban movie api
	$("#douban").blur(function() {
		var douban = $(this);
		var id = douban.val();

		if(id === "" || id === " " || id === undefined){
			$(".form-group input").val("");
			return false;
		}

		$.ajax({
			url: "https://api.douban.com/v2/movie/subject/" + id,
			cache: true,
			type: "get",
			dataType: "jsonp",
			crossDomain: true,
			jsonp: "callback",
			error: function(){
				alert("电影不存在！");
			},
			success: function(data) {
				var countries = data.countries;
				var str_languaue = [];
				var genres = data.genres[0];

				$("#inputTitle").val(data.title);
				$("#inputDoctor").val(data.directors[0].name);
				$("#inputPoster").val(data.images.large);
				$("#inputYear").val(data.year);
				$("#inputSummary").val(data.summary);
				$("#inputCountry").val(data.countries.join("/ "));

				// 根据电影的制片地区，模糊判断电影语种
				for (var i = 0; i < countries.length; i++) {
					switch (countries[i]) {
						case "中国大陆":
							str_languaue.push("汉语普通话");
							break;
						case "美国":
							str_languaue.push("英语");
							break;
						case "英国":
							str_languaue.push("英语");
							break;
						case "韩国":
							str_languaue.push("韩语");
							break;
						case "日本":
							str_languaue.push("日语");
							break;
						case "法国":
							str_languaue.push("法语");
							break;
						default:
							// str_languaue.push("未知");
							break;
					}
				}
				$("#inputLanguaue").val(str_languaue.join("/ "));

				// 获取电影类型
				// 有则打勾，无则添加
				var hasType = false;
				var len = mt_arr.length;
				for (var j = 0; j < len; j++) {
					if (mt_arr[j] === genres) {
						$("#inputCategories").val("");
						$("#J_MovieType .radio-inline").find("input").attr("checked", false);
						$("#J_MovieType .radio-inline").eq(j).find("input").attr("checked", true);
						hasType = true;
						break;
					}
					if (!hasType && j == len - 1) {
						$("#J_MovieType .radio-inline").find("input").attr("checked", false);
						$("#inputCategories").val(genres);
					}
				}
			}
		})
	})
});