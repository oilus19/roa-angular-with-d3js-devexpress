var new_index = require('./new_index');
var index = require('./index');
var export_png = require('./export_png');

module.exports = function(app) {

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.post('/performance_dataset', new_index.performance_dataset);
	app.post('/planner_dataset', new_index.planner_dataset);
	app.post('/dashboard_dataset', new_index.dashboard_dataset);
	app.post('/trends_dataset', index.trends_dataset);
	app.post('/roi_dataset', new_index.roi_dataset);
	app.post('/breakdown_dataset', new_index.breakdown_dataset);

	app.post('/export_png', export_png.call);
};