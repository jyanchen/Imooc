$(function() {
    $(".comment .user-portrait").click(function() {
        var toId = $(this).data("tid"), commentId = $(this).data("cid");
        $("#commentFrom .input-hidden").length ? ($(".hide-tid").val(toId), $(".hide-cid").val(commentId)) : ($("<input>").attr({
            "class": "input-hidden hide-tid",
            type: "hidden",
            name: "comment[tid]",
            value: toId
        }).appendTo("#commentFrom"), $("<input>").attr({
            "class": "input-hidden hide-cid",
            type: "hidden",
            name: "comment[cid]",
            value: commentId
        }).appendTo("#commentFrom"));
    });
});