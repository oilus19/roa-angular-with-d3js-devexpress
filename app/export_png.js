var webshot = require('webshot');

exports.call = function(req, res){
	if(req.body['link'] != '') {
		var index1 = Math.floor((Math.random() * 1000) + 1);
		var index2 = Math.floor((Math.random() * 1000) + 1);
		var link = 'screenshots/screenshot_'+index1+index2+'.png';
		webshot(req.body['link'], 'public/'+link, { takeShotOnCallback: false, renderDelay: 10000 }, function(err) {
	        res.json({link: link});
		});
	}
}