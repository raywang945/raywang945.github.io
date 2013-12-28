var playList;
var jplayer;

var done_list = new Object();
var done_whole_list = new Object();

var clip_num;
var state;
var musicList;
var tagList;
var defaultTagList;
var song_id;
var done_num;
var whole_tagList;
var has_done;

$(document).ready(function() {
	song_id = 1;
	done_num = 0;
	resetAll();

	getList_preload = JSON.parse(getList_preload);
	getWholeList_preload = JSON.parse(getWholeList_preload);
	for (var i = 0; i < getList_preload.length; i ++) {
		done_list[i] = undefined;
		done_whole_list[i] = undefined;
	}

	tagMap = JSON.parse(tagMap);
	$.each(tagMap, function(key, value) {
		tagMap[key].category = getTagCategory(value.english);
	});
	groupList = JSON.parse(groupList);
	default_rank = JSON.parse(default_rank);

	state = "get_list";
	stateFunc();
});

function resetAll() {
	musicList = [];
	tagList = [];
	if (playList) playList.remove();
	$(".category_nav").removeClass("hide");
	$(".whole_nav").addClass("hide");
	$("#submit_button").addClass("hide");
	$("#continue_button").removeClass("hide").prop("disabled", true);
	$("#jp_container_N").removeClass("hide");
	$("#remind_list").removeClass("hide");
	$("#support_text").removeClass("hide");
	$("#seg_remind_list").removeClass("hide");
	$("#whole_remind_list").addClass("hide");
	$("#reset_button").prop("disabled", false);
	$.jPlayer.keys(true);
}

function stateFunc() {
	switch(state) {
		case "get_list":
			queryGetList();
			break;
		case "display":
			$("#song_id").text(song_id + (has_done ? " (done)" : ''));
			$("#done_num").text(done_num);
			var tmpString = musicList[0].mp3.split('/').pop().split(" - ").shift();
			$("#whole_song").prop("src", "../song_wav/" + tmpString + ".mp3");
			$("#artist").text(tmpString.split('-').shift().replace(/_/g, ' '));
			$("#song_name").text(tmpString.substring(tmpString.indexOf('-') + 1).replace(/_/g, ' '));
			$("#lastfm_artist").prop("href", "http://www.last.fm/music/" + $("#artist").text());
			$("#lastfm_songname").prop("href", "http://www.last.fm/music/" + $("#artist").text() + "/_/" + $("#song_name").text());
			$("#previous_song_button").prop("disabled", song_id === 1);
			$("#next_song_button").prop("disabled", !has_done || song_id === getList_preload.length);
			if (playList) { // playList is already set
				$.each(musicList, function(key, value) {
					playList.add(value);
				});
			}
			else { // first time set playList
				playList = new jPlayerPlaylist(
					{
						jPlayer: "#jquery_jplayer_N",
						cssSelectorAncestor: "#jp_container_N"
					},
					musicList,
					{
						playlistOptions: {
							displayTime: 0,
						},
						swfPath: "js/",
						preload: "auto",
						supplied: "mp3",
						wmode: "window",
						volume: 1,
						smoothPlayBar: true,
						keyEnabled: true
					}
				);

				jplayer = $("#jquery_jplayer_N");
				jplayer.unbind($.jPlayer.event.ended).bind($.jPlayer.event.ended, function(event) {
					$("#done_button").prop("disabled", false);
					if (playList.loop) jplayer.jPlayer("play");
				});
				jplayer.bind($.jPlayer.event.loadstart, function(event) {
					// done #copy_select
					$("#copy_select").empty();
					$.each($(".done_clip").find(".jp-playlist-item"), function(key, value) {
						$("#copy_select").append(
							$("<option></option>").prop("value", $(value).text()).text($(value).text())
						).prop("value", null);
					});
					$("#copy_select").prop("disabled", $("#copy_select").children().length === 0);
					$("#copy_button").prop("disabled", $("#copy_select").children().length === 0);

					// handle #done_button
					$("#done_button").remove();
					$("li.jp-playlist-current").append(
						$("<button></button>").text("Done").prop("id", "done_button").addClass("btn btn-warning btn-sm").prop("disabled", true).click(done)
					);
					$(".active").removeClass("active");
					$("ul[id^=category-]").addClass("hide").empty();
					$("ul[id^=whole-]").addClass("hide").empty();

					// set rank according to rank_default
					tagList[playList.current].tags.sort(function(a, b) {
						return default_rank[a.tag_id] - default_rank[b.tag_id];
					});

					$.each(tagList[playList.current].tags, function(key, value) {
						var tmp_li = $("<li></li>").addClass("list-group-item").append(makeCheckBox(value));
						if (tmp_li.find("input").prop("checked")) tmp_li.addClass("checked");
						$("#category-" + tagMap[value.tag_id].category).append(tmp_li);
					});
					$(".category_nav").first().addClass("active");
					$("#category-Instrument").removeClass("hide");

					// group emotion tags according to groupList
					$.each(groupList, function(key, value) {
						// extract li
						value = tagList[playList.current].tags.filter(function(x) { return value.indexOf(x.tag_id) !== -1; });
						var tmp = [];
						$.each(value, function(key2, value2) {
							tmp.push(tagMap[value2.tag_id].english_abbr);
						});
						tmp = $("#category-Emotion").children().filter(function(key2, value2) { return tmp.indexOf($(value2).text().split(", ").pop()) !== -1; });

						// clone and set new li according groupList
						$.each(tmp, function(key2, value2) {
							var tmptmp = value2.cloneNode(true);
							$(tmptmp).find("input").click(function() {
								if ($(this).is(":checked")) $(this).parent().parent().parent().addClass("checked");
								else $(this).parent().parent().parent().removeClass("checked");
							});

							// add red border on a group
							if (key2 === 0) $(tmptmp).css({ "border-color": "red" });
							else $(tmptmp).css({
								"border-left": "solid red 1px",
								"border-right": "solid red 1px"
							});
							if (key2 === tmp.length -1) $(tmptmp).css({
								"border-bottom": "solid red 1px",
								"margin-bottom": "0px"
							});
							$("#category-Emotion").insertAt($("#category-Emotion").children().index(tmp[0]), tmptmp);
						});

						// remove old li
						$.each(tmp, function(key2, value2) {
							$(value2).remove();
						});
					});
				});
			}

			//state = "wait";
			//stateFunc();
			break;
		//case "wait":
			////console.log("wait");
			//break;
		case "whole":
			whole_tagList = done_whole_list[song_id - 1] ? done_whole_list[song_id - 1] : getWholeList_preload[song_id - 1].tags;

			// set rank according to rank_default
			whole_tagList.sort(function(a, b) {
				return default_rank[a.tag_id] - default_rank[b.tag_id];
			});

			state = "display_whole";
			stateFunc();
			break;
		case "display_whole":
			$("ul[id^=category-]").addClass("hide").empty();
			$("ul[id^=whole-]").addClass("hide").empty();
			$.each(whole_tagList, function(key, value) {
				var tmp_li = $("<li></li>").addClass("list-group-item").append(makeCheckBox(value));
				if (tmp_li.find("input").prop("checked")) tmp_li.addClass("checked");
				$("#whole-" + tagMap[value.tag_id].category).append(tmp_li);
			});
			$(".whole_nav").first().addClass("active");
			$("#whole-Song").removeClass("hide");
			setTimeout(function() {
				$("#submit_button").prop("disabled", false);
			}, 1000);
			break;
		case "next_page":
			if (song_id > getList_preload.length) window.location.replace("submit.html");
			resetAll();
			state = "get_list";
			stateFunc();
			break;
		default:
			console.log("state error, state = " + state);
	}
}

function makeCheckBox(obj) {
	return $("<div></div>").addClass("checkbox").append(
		$("<label></label>").text(tagMap[obj.tag_id].english_abbr).prepend(
			$("<input>").prop("type", "checkbox").prop("checked", obj.checked).click(function() {
				if ($(this).is(":checked")) $(this).parent().parent().parent().addClass("checked");
				else $(this).parent().parent().parent().removeClass("checked");
			})
		)
	);
}

function done() {
	// set tagList
	$("label").each(function(key, value) {
		var category = $(value).parent().parent().parent().prop("id");
		category = category.substr(category.indexOf('-') + 1);
		$(tagList[playList.current].tags.filter(function(x) { return x.tag_id === getTagId($(value).text().split(", ").pop(), category); })).prop("checked", $(value).find("input").prop("checked"));
	});

	// update view
	$("li.jp-playlist-current").addClass("done_clip");
	if (playList.current !== clip_num - 1) playList.next();
	else $("#done_button").prop("disabled", true);

	if ($("li.done_clip").length === clip_num) $("#continue_button").prop("disabled", false);
}

function mySubmit() {
	$("button").prop("disabled", true);
	setWholeTagList();
	done_list[song_id - 1] = myClone(tagList);
	done_whole_list[song_id - 1] = myClone(whole_tagList);
	song_id ++;
	if (!has_done) done_num ++;
	state = "next_page";
	stateFunc();
}

function setWholeTagList() {
	$.each($("label"), function(key, value) {
		var tag_id = $(tagMap).index(tagMap.filter(function(x) { return x.english_abbr === $(value).text().split(", ").pop(); })[0]);
		$(whole_tagList.filter(function(x) { return x.tag_id === tag_id; })[0]).prop("checked", $(value).children().prop("checked"));
	});
}

function showTags(obj) {
	if (!$(obj).hasClass("active")) {
		var tmp = $(obj).prop("class");
		tmp = tmp.substr(0, tmp.indexOf('_'));
		$(obj).siblings().filter(".active").removeClass("active");
		$(obj).addClass("active");
		$("ul[id^=" + tmp + "-]").not(".hide").addClass("hide");
		var tmpText = $(obj).text();
		$('#' + tmp + '-' + tmpText).removeClass("hide");
	}
}

function getTagCategory(tag) {
	var result = tag.split('-');
	if (result[0] === "Genre" && result[1] === "Best") return "Genre-Best";
	else if (result[0] === "Instrument_") {
		if (result[result.length - 1] === "Solo") return "Instrument-Solo";
		else return "Instrument";
	}
	else return result[0];
}

function getTagId(tag_name_abbr, tag_category) {
	var result;
	$.each(tagMap, function(key, value) {
		if (tag_name_abbr === value.english_abbr && tag_category === value.category) {
			result = key;
			return false;
		}
	});
	return result;
}

function getTagElement(tag_id) {
	var tmp = tagMap[tag_id];
	var result;
	$.each($("#category-" + tmp.category).children(), function(key, value) {
		var split = $(value).text().split(", ");
		if (split.length > 2) return ;
		if (split.pop() === tmp.english_abbr) {
			result = value;
			return false;
		}
	});
	return result;
}

function setTags(tagArray) {
	$.each(tagArray, function(key, value) {
		var tmp = $("label").filter(function(key2, value2) { return $(value2).text().split(", ").pop() === tagMap[value.tag_id].english_abbr; });
		tmp.children().prop("checked", value.checked);
		if (value.checked) tmp.parent().parent().addClass("checked");
		else tmp.parent().parent().removeClass("checked");
	});
}

function copyTag() {
	var seg_id = parseInt($("#copy_select").prop("value").split(' ').pop());
	if (isNaN(seg_id)) return ;
	else seg_id -= 1;
	setTags(tagList[seg_id].tags);
}

function resetTag() {
	setTags(defaultTagList[playList.current].tags);
}

function myContinue() {
	jplayer.jPlayer("stop");
	$.jPlayer.keys(false);
	$(".category_nav").addClass("hide");
	$(".whole_nav").removeClass("hide");
	$("#submit_button").prop("disabled", true).removeClass("hide");
	$("#continue_button").addClass("hide");
	$("#jp_container_N").addClass("hide");
	$("#remind_list").addClass("hide");
	$("#support_text").addClass("hide");
	$("#seg_remind_list").addClass("hide");
	$("#whole_remind_list").removeClass("hide");
	state = "whole";
	stateFunc();
}

function queryGetList(tmpID) {
	if (tmpID) song_id = tmpID;
	tmpData = done_list[song_id - 1] ? { music_list: done_list[song_id - 1] } : getList_preload[song_id - 1];
	has_done = song_id <= done_num;
	var tags = [];
	clip_num = tmpData.music_list.length;
	$.each(tmpData.music_list, function(key, value) {
		musicList[key] = { title: ("Segment ") + (key + 1), mp3: value.seg_path };
		tagList[key] = { seg_path: value.seg_path, tags: value.tags };
	});
	defaultTagList = myClone(tagList);
	state = "display";
	stateFunc();
}

function previousSong() {
	resetAll();
	queryGetList(song_id - 1);
}

function nextSong() {
	resetAll();
	queryGetList(song_id + 1);
}
