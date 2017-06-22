function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function generatehtmlforarticle(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (_id, articleID, content, contentType, summary, title) {;pug_debug_line = 1;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Carticle" + (" class=\"article\""+pug_attr("data-id", _id, true, false)+pug_attr("data-article-id", articleID, true, false)) + "\u003E";
;pug_debug_line = 2;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Ch1 class=\"title\"\u003E";
;pug_debug_line = 2;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = title) ? "" : pug_interp)) + "\u003C\u002Fh1\u003E";
;pug_debug_line = 3;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Cp class=\"summary\"\u003E";
;pug_debug_line = 3;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = summary) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"content\""+pug_attr("data-contentType", contentType, true, false)) + "\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = content) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 5;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Cfooter\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Cspan class=\"edit\"\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "Edit\u003C\u002Fspan\u003E";
;pug_debug_line = 7;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Cspan class=\"save\" style=\"display: none;\"\u003E";
;pug_debug_line = 7;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "Save\u003C\u002Fspan\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "\u003Cspan class=\"delete\" style=\"display: none;\"\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Farticle.pug";
pug_html = pug_html + "Delete\u003C\u002Fspan\u003E\u003C\u002Ffooter\u003E\u003C\u002Farticle\u003E";}.call(this,"_id" in locals_for_with?locals_for_with._id:typeof _id!=="undefined"?_id:undefined,"articleID" in locals_for_with?locals_for_with.articleID:typeof articleID!=="undefined"?articleID:undefined,"content" in locals_for_with?locals_for_with.content:typeof content!=="undefined"?content:undefined,"contentType" in locals_for_with?locals_for_with.contentType:typeof contentType!=="undefined"?contentType:undefined,"summary" in locals_for_with?locals_for_with.summary:typeof summary!=="undefined"?summary:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}
function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)s=pug_classes(r[g]),s&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function generatehtmlforcomment(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (Object, comment, currentUser) {;pug_debug_line = 1;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
var isDisabled = comment.removed || comment.flags > 5
;pug_debug_line = 2;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
var isUser = currentUser
;pug_debug_line = 3;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
var isAdmin = currentUser === Object(currentUser) && currentUser.email === 'jbacon@zagmail.gonzaga.edu'
;pug_debug_line = 4;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
var isOwner = currentUser === Object(currentUser) && currentUser._id === comment.accountID
;pug_debug_line = 5;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Carticle" + (" class=\"comment\""+pug_attr("data-id", comment._id, true, false)+pug_attr("data-account-id", comment.accountID, true, false)+pug_attr("data-article-id", comment.articleID, true, false)+pug_attr("data-parent-comment-id", comment.parentCommentID, true, false)) + "\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = (comment.removed || isDisabled) ? '~~Comment has been Removed~~' : comment.text) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
;pug_debug_line = 7;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cfooter\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cdiv class=\"actions\"\u003E";
;pug_debug_line = 9;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["replies-toggle","clickable",(comment.childCommentIDs.length > 0) ? '' : 'hidden'], [false,false,true]), false, false)) + "\u003E";
;pug_debug_line = 9;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Show Replies\u003C\u002Fspan\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan class=\"load-newer clickable hidden\"\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Load Latest...\u003C\u002Fspan\u003E";
;pug_debug_line = 11;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["reply-toggle","clickable",(isUser && !isDisabled) ? '' : 'hidden'], [false,false,true]), false, false)) + "\u003E";
;pug_debug_line = 11;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Reply\u003C\u002Fspan\u003E";
;pug_debug_line = 12;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["up-vote-count",(!isDisabled) ? '' : 'hidden'], [false,true]), false, false)) + "\u003E";
;pug_debug_line = 12;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = comment.upVoteCount) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 13;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["up-vote","clickable",(isUser && !isDisabled) ? '' : 'hidden'], [false,false,true]), false, false)) + "\u003E";
;pug_debug_line = 13;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Up\u003C\u002Fspan\u003E";
;pug_debug_line = 14;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["down-vote-count",(!isDisabled) ? '' : 'hidden'], [false,true]), false, false)) + "\u003E";
;pug_debug_line = 14;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = comment.downVoteCount) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 15;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["down-vote","clickable",(isUser && !isDisabled) ? '' : 'hidden'], [false,false,true]), false, false)) + "\u003E";
;pug_debug_line = 15;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Down\u003C\u002Fspan\u003E";
;pug_debug_line = 16;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["remove","clickable",((isAdmin || isOwner) && !isDisabled) ? '' : 'hidden'], [false,false,true]), false, false)) + "\u003E";
;pug_debug_line = 16;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Remove\u003C\u002Fspan\u003E";
;pug_debug_line = 17;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cspan" + (pug_attr("class", pug_classes(["flag","clickable",(isUser && !isDisabled) ? '' : 'hidden'], [false,false,true]), false, false)) + "\u003E";
;pug_debug_line = 17;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Flag\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 18;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cdiv class=\"replies hidden\" data-start=\"newest\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 19;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cdiv class=\"load-older clickable hidden\"\u003E";
;pug_debug_line = 19;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Load More...\u003C\u002Fdiv\u003E";
;pug_debug_line = 20;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cform class=\"create hidden\" action=\"\"\u003E";
;pug_debug_line = 21;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cinput" + (" class=\"article-id\""+" name=\"articleID\" type=\"hidden\""+pug_attr("value", comment.articleID, true, false)) + "\u002F\u003E";
;pug_debug_line = 22;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cinput" + (" class=\"parent-comment-id\""+" name=\"parentCommentID\" type=\"hidden\""+pug_attr("value", comment._id, true, false)) + "\u002F\u003E";
;pug_debug_line = 23;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cinput class=\"text\" name=\"text\" type=\"text\" placeholder=\"Text...\"\u002F\u003E";
;pug_debug_line = 24;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "\u003Cbutton class=\"submit clickable\"\u003E";
;pug_debug_line = 24;pug_debug_filename = ".\u002Fviews\u002Fclient\u002Fcomment.pug";
pug_html = pug_html + "Submit\u003C\u002Fbutton\u003E\u003C\u002Fform\u003E\u003C\u002Ffooter\u003E\u003C\u002Farticle\u003E";}.call(this,"Object" in locals_for_with?locals_for_with.Object:typeof Object!=="undefined"?Object:undefined,"comment" in locals_for_with?locals_for_with.comment:typeof comment!=="undefined"?comment:undefined,"currentUser" in locals_for_with?locals_for_with.currentUser:typeof currentUser!=="undefined"?currentUser:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}
