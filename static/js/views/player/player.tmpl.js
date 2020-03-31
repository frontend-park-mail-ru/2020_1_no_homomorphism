;(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['js/views/player/player.tmpl']=function (__fest_context){"use strict";var __fest_self=this,__fest_buf="",__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html="",__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_element_stack = [],__fest_short_tags = {"area": true, "base": true, "br": true, "col": true, "command": true, "embed": true, "hr": true, "img": true, "input": true, "keygen": true, "link": true, "meta": true, "param": true, "source": true, "wbr": true},__fest_jschars = /[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test = /[\\'"\/\n\r\t\b\f<>]/,__fest_htmlchars = /[&<>"]/g,__fest_htmlchars_test = /[&<>"]/,__fest_jshash = {"\"": "\\\"", "\\": "\\\\", "/": "\\/", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f", "'": "\\'", "<": "\\u003C", ">": "\\u003E"},__fest_htmlhash = {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"},__fest_escapeJS = function __fest_escapeJS(value) {
		if (typeof value === 'string') {
			if (__fest_jschars_test.test(value)) {
				return value.replace(__fest_jschars, __fest_replaceJS);
			}
		}

		return value == null ? '' : value;
	},__fest_replaceJS = function __fest_replaceJS(chr) {
		return __fest_jshash[chr];
	},__fest_escapeHTML = function __fest_escapeHTML(value) {
		if (typeof value === 'string') {
			if (__fest_htmlchars_test.test(value)) {
				return value.replace(__fest_htmlchars, __fest_replaceHTML);
			}
		}

		return value == null ? '' : value;
	},__fest_replaceHTML = function __fest_replaceHTML(chr) {
		return __fest_htmlhash[chr];
	},__fest_extend = function __fest_extend(dest, src) {
		for (var key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	},__fest_param = function __fest_param(fn) {
		fn.param = true;
		return fn;
	},i18n=__fest_self && typeof __fest_self.i18n === "function" ? __fest_self.i18n : function (str) {return str;},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}var data=__fest_context;__fest_buf+=("<div class=\"row\"><div class=\"col player-trigger\" style=\"height: 1000px;\"><img src=\"\/static\/img\/play_arrow-24px.svg\" class=\"player-trigger-arrow\" alt=\".\" height=\"17\" style=\"visibility: hidden; transform: rotate(180deg); margin-left: -3px;\"/></div><div class=\"col main-col\"><div class=\"row patch\"></div><div class=\"row l-music-bar\"><div class=\"col\"><a href=\"\/player\"><img src=\"\/static\/img\/album-24px.svg\" height=\"80px\" width=\"80px\" alt=\"...\" id=\"cover\"/></a></div><div class=\"col track-group-names\"><div class=\"track-name\" id=\"title\">Kek</div><a class=\"group-name\" href=\"\/player\" id=\"artist\">Lol</a></div></div><div class=\"container-audio border-bottom\"><div class=\"timeline row\"><div class=\"timeline-back\"></div><div class=\"timeline-front\" style=\"width: 0;\"></div><div class=\"current-time col col-6\" style=\"font-size: 0px;\">0:00</div><div class=\"duration col col-6\" style=\"font-size: 0px;\">0:00</div></div><div class=\"control-elements row m-player-track\"><div class=\"col col-1\"><img src=\"\/static\/img\/previous.svg\" class=\"player-control-button\" id=\"prev\" alt=\"prev\"/></div><div class=\"col col-1\"><img src=\"\/static\/img\/play.svg\" class=\"player-control-button play-pause\" alt=\"play\/pause\"/></div><div class=\"col col-1\"><img src=\"\/static\/img\/next.svg\" class=\"player-control-button\" id=\"next\" alt=\"next\"/></div><img src=\"\/static\/img\/shuffle.svg\" class=\"playlist-control-button shuffle\" style=\"opacity: 0.4;\" alt=\"shuffle\"/><img src=\"\/static\/img\/repeat.svg\" class=\"playlist-control-button repeat\" style=\"opacity: 0.4;\" alt=\"repeat\"/><img src=\"\/static\/img\/volume_up.svg\" class=\"volume\" style=\"opacity: 0.4;\" alt=\"volume\"/><div class=\"volume-scale\" style=\"opacity: 0; top: 58px; visibility: hidden; transition-property: opacity, visibility, top;\"><div class=\"volume-scale-back\"></div><div class=\"volume-scale-front\"></div></div></div><audio><source src=\"https:\/\/s3-us-west-2.amazonaws.com\/s.cdpn.io\/9473\/new_year_dubstep_minimix.ogg\"/>Your browser does not Support the audio Tag</audio></div><div class=\"track-list\" style=\"top: 0;\"></div></div></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html+=__fest_chunk;} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html+=__fest_call(__fest_fn,__fest_chunk.params,__fest_chunk.cp);}}return __fest_html+__fest_buf;} else {return __fest_buf;}}})();