// Routes

exports.dashboard = function(req, res){
	res.locals.lang_dir = (res.locals.lang == 'ar_AE') ? 'rtl' : 'ltr';
	res.render('index', { title : req.gettext('Dashboard') })
};