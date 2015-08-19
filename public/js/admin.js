$(function() {
    $(".del").click(function(e) {
        var target = $(e.target), id = target.data("id"), tr = $(".item-id-" + id), msg = '删除电影 "' + tr.find(".name a").attr("title") + '" 的信息？';
        confirm(msg) && $.ajax({
            type: "DELETE",
            url: "/admin/" + (location.href.indexOf("user") > -1 ? "user" : "movie") + "/list?id=" + id
        }).done(function(res) {
            1 === res.success && tr.length > 0 && tr.remove();
        });
    });
    var mt_arr = [];
    $("#J_MovieType").length && $("#J_MovieType .radio-inline").each(function() {
        mt_arr.push($(this).text().trim());
    }), $("#douban").blur(function() {
        var douban = $(this), id = douban.val();
        return "" === id || " " === id || void 0 === id ? ($(".form-group input").val(""), 
        !1) : void $.ajax({
            url: "/search?for=checkDBId&id=" + id,
            type: "get",
            dataType: "json",
            error: function(res) {
                console.log(res);
            },
            success: function(res) {
                res && res.exist && ($("#oldPoster").val(res.movie[0].poster), $("#btn-success").prop("disable", !1), 
                console.log("检查电影是否已经存在: " + res.exist)), $.ajax({
                    url: "https://api.douban.com/v2/movie/subject/" + id,
                    cache: !0,
                    type: "get",
                    dataType: "jsonp",
                    crossDomain: !0,
                    jsonp: "callback",
                    error: function() {
                        alert("电影不存在！");
                    },
                    success: function(data) {
                        var countries = data.countries, str_languaue = [], genres = data.genres[0];
                        $("#inputTitle").val(data.title), $("#inputRate").val(data.rating.average), $("#inputDoctor").val(data.directors[0].name), 
                        $("#inputPoster").val(data.images.large), $("#inputYear").val(data.year), $("#inputSummary").val(data.summary), 
                        $("#inputCountry").val(data.countries.join("/ "));
                        for (var i = 0; i < countries.length; i++) switch (countries[i]) {
                          case "中国大陆":
                          case "台湾":
                            str_languaue.push("汉语普通话");
                            break;

                          case "香港":
                          case "澳门":
                            str_languaue.push("粤语");
                            break;

                          case "美国":
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
                        }
                        $("#inputLanguaue").val(str_languaue.join("/ "));
                        var hasType = !1, len = mt_arr.length;
                        if (len) for (var j = 0; len > j; j++) {
                            if (mt_arr[j] === genres) {
                                $("#inputCategories").val(""), $("#J_MovieType .radio-inline").find("input").attr("checked", !1), 
                                $("#J_MovieType .radio-inline").eq(j).find("input").attr("checked", !0), hasType = !0;
                                break;
                            }
                            hasType || j != len - 1 || ($("#J_MovieType .radio-inline").find("input").attr("checked", !1), 
                            $("#inputCategories").val(genres));
                        } else $("#inputCategories").val(genres);
                    }
                });
            }
        });
    });
});