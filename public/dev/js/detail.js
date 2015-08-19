$(function() {
	$(".comment .user-portrait").click(function(e) {
		// var target = $(e.target);
		var toId = $(this).data("tid");
		var commentId = $(this).data("cid");

		if(!$("#commentFrom .input-hidden").length){
			$("<input>").attr({
				class: "input-hidden hide-tid",
				type: "hidden",
				name: "comment[tid]",
				value: toId
			}).appendTo("#commentFrom");

			$("<input>").attr({
				class: "input-hidden hide-cid",
				type: "hidden",
				name: "comment[cid]",
				value: commentId
			}).appendTo("#commentFrom");
		}else{
			$(".hide-tid").val(toId);
			$(".hide-cid").val(commentId);
		}
	});
});