Template.userLibrary.created = function() {

	this.statusFilter = new ReactiveVar('Watching');
	this.libraryView = new ReactiveVar('List');

};


Template.userLibrary.events({

	'click .statusFilter > button' : function(event, template) {
		var status = $(event.target).text();
		
		template.statusFilter.set(status);
	},

	'click .libraryView > button' : function(event, template) {
		var libraryView = $(event.target).text();

		template.libraryView.set(libraryView);
	}
});

dataTableData = function() {
	return LibraryEntries.find().fetch();
}

Template.userLibrary.helpers({
	activeLibraryView: function(libraryView) {
		var template = Template.instance();
		var currentLibraryView = template.libraryView.get();

		if (currentLibraryView === libraryView) {
			return 'active';
		} else {
			return '';
		}	
	},

	coverViewDisabled: function() {
		var template = Template.instance();
		var entries = template.data.libraryEntries;

		// If we have more than 100 entries, then we shouldn't allow to switch to cover
		if (entries.length > 100) {
			return 'disabled';
		} else {
			return '';
		}
	},

	libraryViewCheck: function(libraryView) {
		var template = Template.instance();
		var currentLibraryView = template.libraryView.get();

		return currentLibraryView === libraryView;

	},


	activeStatusFilter: function(status) {
		var template = Template.instance();
		var statusFilter = template.statusFilter.get();

		if (statusFilter === status) {
			return 'active';
		} else {
			return '';
		}
	},

	statusFilterCheck: function(status) {
		var template = Template.instance();
		var statusFilter = template.statusFilter.get();

		if (statusFilter === 'All') {
			return true;
		}

		return statusFilter === status;
	},

	recentlyAdded: function(template) {
		if (this) {
			return {
				entries: LibraryEntries.find({userId: this._id}, {sort: {createdAt: -1}, limit: 6})
			};
		}
	},
	reactiveDataFunction: function() {
		return dataTableData;
	},
	optionsObject: {
		columns: [{
			title: 'Title',
			data: function(row, type, set, meta) {
				return Anime.findOne({_id: row.animeId}).title();
			},
			className: 'titleColumn'
		},
		{
			title: 'Status',
			data: function(row, type, set, meta) {
				return row.status;
			},
			className: 'nameColumn'
		},
		{
			title: 'Score',
			data: function(row, type, set, meta) {
				return row.score;
			},
			className: 'scoreColumn'
		},
		{
			title: 'Progress',
			data: function(row, type, set, meta) {
				var anime = Anime.findOne({_id: row.animeId});
				return row.episodesSeen + "/" + anime.totalEpisodes;
			},
			className: 'progressColumn'
		},
		{
			title: 'Type',
			data: function(row, type, set, meta) {
				return Anime.findOne({_id: row.animeId}).type;
			}, 
			className: 'typeColumn'
		}]
	},
	watching: function(template) {
		if (this) {
			return {
				entries: LibraryEntries.find({userId: this._id, status: 'Watching'}, {sort: {createdAt: -1}, limit: 6}),
				count: LibraryEntries.find({userId: this._id, status: 'Watching'}).count()
			};
		}
	},

	completed: function() {
		if (this) {
			return {
				entries: LibraryEntries.find({userId: this._id, status: 'Completed'}, {sort: {createdAt: -1}, limit: 6}),
				count: LibraryEntries.find({userId: this._id, status: 'Completed'}).count()
			};
		}	
	},

	planToWatch: function() {
		if (this) {
			return {
				entries: LibraryEntries.find({userId: this._id, status: 'Plan to watch'}, {sort: {createdAt: -1}, limit: 6}),
				count: LibraryEntries.find({userId: this._id, status: 'Plan to watch'}).count()
			};
		}
	},

	onHold: function() {
		if (this) {
			return {
				entries: LibraryEntries.find({userId: this._id, status: 'On hold'}, {sort: {createdAt: -1}, limit: 6}),
				count: LibraryEntries.find({userId: this._id, status: 'On hold'}).count()
			};
		}	
	},

	dropped: function() {
		if (this) {
			return {
				entries: LibraryEntries.find({userId: this._id, status: 'Dropped'}, {sort: {createdAt: -1}, limit: 6}),
				count: LibraryEntries.find({userId: this._id, status: 'Dropped'}).count()
			};
		}
	}
});