$(function() {
    // delete a movie info
    $(".del").click(function(e) {
        var target = $(e.target),
            id = target.data("id"),
            tr = $(".item-id-" + id),
            msg = "删除电影 \"" + tr.find(".name a").attr("title") + "\" 的信息？";

        if (confirm(msg)) {
            $.ajax({
                type: "DELETE",
                url: "/admin/" + (location.href.indexOf("user") > -1 ? "user" : "movie") + "/list?id=" + id
            }).done(function(res) {
                if (res.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            });
        }
    });


    // 海报相关
    // $("#uploadPoster").on("click", function() {

    //     if (window.navigator.userAgent.indexOf("MSIE") >= 1) { //ie 
    //         obj.select();
    //         return document.selection.createRange().text;
    //     } else if (window.navigator.userAgent.indexOf("Firefox") >= 1) { //firefox
    //         if (obj.files) {
    //             return obj.files.item(0).getAsDataURL();
    //         }
    //         return obj.value;
    //     }
    //     return obj.value;
    // });

    var loadImageFile = function() {
        if (window.FileReader) {
            var oPreviewImg = null,
                oFReader = new window.FileReader(),
                rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;


            oFReader.onload = function(oFREvent) {
                if (!oPreviewImg) {
                    var newPreview = document.getElementById("imagePreview");
                    oPreviewImg = new Image();
                    oPreviewImg.style.width = (newPreview.offsetWidth).toString() + "px";
                    oPreviewImg.style.height = (newPreview.offsetHeight).toString() + "px";
                    newPreview.appendChild(oPreviewImg);
                }
                oPreviewImg.src = oFREvent.target.result;
            };


            return function() {
                var aFiles = document.getElementById("imageInput").files;
                if (aFiles.length === 0) {
                    return;
                }
                if (!rFilter.test(aFiles[0].type)) {
                    alert("You must select a valid image file!");
                    return;
                }
                $("#inputPoster").val(oFReader.readAsDataURL(aFiles[0]));
            }


        }
        if (navigator.appName === "Microsoft Internet Explorer") {
            return function() {
                alert(document.getElementById("imageInput").value);
                document.getElementById("imagePreview").filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = document.getElementById("imageInput").value;
            }
        }
    }


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
        var douban = $(this),
            id = douban.val(),
            xhr = null;

        if (id === "" || id === " " || id === undefined) {
            $(".form-group input").val("");
            return false;
        }

        $.ajax({
            url: "/search?for=checkDBId&id=" + id,
            type: "get",
            dataType: "json",
            error: function(res) {
                console.log(res);
            },
            success: function(res) {
                if (res && res.exist) {
                    $("#oldPoster").val(res.movie[0].poster);
                    $("#btn-success").prop("disable", false);
                    console.log("检查电影是否已经存在: " + res.exist);
                }
                // --------------------

                $.ajax({
                    url: "https://api.douban.com/v2/movie/subject/" + id,
                    cache: true,
                    type: "get",
                    dataType: "jsonp",
                    crossDomain: true,
                    jsonp: "callback",
                    error: function() {
                        alert("电影不存在！");
                    },
                    success: function(data) {
                        var countries = data.countries;
                        var str_languaue = [];
                        var genres = data.genres[0];

                        $("#inputTitle").val(data.title);
                        $("#inputRate").val(data.rating.average);
                        $("#inputDoctor").val(data.directors[0].name);
                        $("#inputPoster").val(data.images.large);
                        $("#inputYear").val(data.year);
                        $("#inputSummary").val(data.summary);
                        $("#inputCountry").val(data.countries.join("/ "));

                        // 根据电影的制片地区，模糊判断电影语种
                        for (var i = 0; i < countries.length; i++) {
                            switch (countries[i]) {
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
                        if (!len) {
                            $("#inputCategories").val(genres);
                        } else {
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
                    }
                })

                // --------------------
            }
        })
    })
});
