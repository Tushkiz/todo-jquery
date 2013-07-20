$(function() {

	// console.log
	var debug = false,
		_log = function() {
			debug && window.console && console.log.apply(console, arguments);
		},
	//Utilities
	Utils = {
			genId: function() {
					var uid = "";
					for(i = 0; i < 16; i++) {
						if(i===8) {
							uid += '-';
							continue;
						}
						uid += Math.floor(Math.random() * 9 + 1).toString();
					}
					return uid;
				},
			store: function (data) {
				if (arguments.length === 1) {
					return localStorage.setItem('todo-app', JSON.stringify(data));
				} else {
					var store = localStorage.getItem('todo-app');
					return (store && JSON.parse(store)) || [];
				}
			}
	},

	//App
	App = {
		init: function () {
				this.tasks = Utils.store();
				this.render();
			},
		template: 	"<ul id = \"todo-list\">" +
					"{{#tasks}}" +
					"{{^completed}}" +
					"{{>li}}" + 
					"{{/completed}}" +
					"{{/tasks}}" +
					"</ul>" +
					"<ul id = \"done-list\">" +
					"{{#tasks}}" +
					"{{#completed}}" +
					"{{>li}}" + 
					"{{/completed}}" +
					"{{/tasks}}" +
					"</ul>",
	
		partials: { 
					li: "<li data-id = \"{{id}}\" class = \"data\">" +
						"<label>{{title}}</label>" +
						"<button class=\"destroy controls\"></button>" +
						"<button class=\"check controls\"></button>"
				},
				
		render: function() {
					var html = Mustache.to_html(App.template, App, App.partials);
					$('#list-area').html(html);
					Utils.store(this.tasks);
					_log("Rendered: " + JSON.stringify(this.tasks));
				},
				
		addTask: function(title) {
					App.tasks.push({
						id: Utils.genId(),
						title: title,
						completed: false
					});
					App.render();
				},
		getTask: function(node, callback) {
					var id = node.closest('li').data('id');
					_log("Getting Task: " + id);
					$.each(App.tasks, function (i, val) {
						if (val.id === id) {
							callback.apply(App, arguments);
							return false;
						}
					});
				},
				
		toggle: function ($this) {
					App.getTask($this, function (i, val) {
						val.completed = !val.completed;
					});
					_log("Toggling");
					App.render();
				},
				
		remove: function($this) {
					App.getTask($this, function (i) {
						App.tasks.splice(i, 1);
						App.render();
					});
				}
	};
			
	//add task
	$('#new-todo').keypress(function(e) {
			var $this = $(this);
			if(e.which == 13) {
				var str = $.trim($this.val());
				_log("Str: " + str);
				$this.val("");
			
			if(str != "") {
				App.addTask(str);
			}
			}
		});
		
	// show controls
		$('#list-area').on('hover', '.data', function(evt) {
				var $controls = $(this).children('.controls');
				if(evt.type == 'mouseenter') {
					$controls.animate({'opacity' : '1'}, 'fast');
				} else {
					$controls.animate({'opacity' : '0'}, 1);
				}
			}
		);
	
	// task done/undone toggle
		$('#list-area').on('click', '.check', function() {
			App.toggle($(this));
		});
	
	
	//destroy
		$('#main').on('click', '.destroy', function() {
			App.remove($(this));
		});
	
	App.init();
});
