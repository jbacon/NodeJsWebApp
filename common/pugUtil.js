const pug = require('pug');
const fs = require('fs');

/* Javascript Generators 
1. Compile client pug templates (./views/client/..) to javascript functions as strings.
2. Write Javascript Function Strings to files (./public/javascripts/views/..)
3. Add javascript files to ./views/layout.pug
*/
exports.compilePugFilesToClientJsFile = function({ srcDirPugFiles, destPathJsFile, overwriteDestFile=true, suffixForFunctions='generateHtmlFor' }) {
	if(overwriteDestFile) {
		fs.unlinkSync(destPathJsFile)
	}
	else {
	}
	fs.readdirSync(srcDirPugFiles).forEach(pugFilename => {
	  var functionName = suffixForFunctions + pugFilename.substring(0, pugFilename.length - 4)
	  var jsFunction = pug.compileFileClient(srcDirPugFiles+pugFilename, { name: functionName });
	  var flag = 'a'
	  fs.writeFileSync(destPathJsFile, jsFunction+'\r\n', { flag: 'a' })
	});

};