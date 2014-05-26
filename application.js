var serviceUrlProxy = "/yql?q=select%20*%20from%20rss%20where%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2420%26numItems%3D20%26full%3Dfalse'%20or%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2421%26numItems%3D20%26full%3Dfalse'%20or%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2015%26numItems%3D20%26full%3Dfalse'%20or%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2184%26numItems%3D20%26full%3Dfalse'%20%7C%20sort(field%3D%22date%22%2C%20descending%3D%22true%22)&format=json&callback=",
	serviceUrlAllContent = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fallcontent%3fnumItems%3D20%26full%3Dfalse'%20%7C%20sort(field%3D%22date%22%2C%20descending%3D%22true%22)&format=json&callback=",
	serviceUrlSelectedFeeds = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2420%26numItems%3D20%26full%3Dfalse'%20or%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2421%26numItems%3D20%26full%3Dfalse'%20or%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2015%26numItems%3D20%26full%3Dfalse'%20or%20url%20%3D%20'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2184%26numItems%3D20%26full%3Dfalse'%20%7C%20sort(field%3D%22date%22%2C%20descending%3D%22true%22)&format=json&callback=";


function handleRefresh(oEvent) {
	var model = oEvent.getSource().getModel();
	model.loadData(serviceUrlSelectedFeeds);
	model.refresh();
}

function handlePopupClose(oEvent) {
	var popover = sap.ui.getCore().byId('responsivePopover');
	popover.close();
	popover.destroy();
}

function handleListItemPress(oEvent) {
	var bindingContext = oEvent.getSource().getBindingContext();
	
	var p = new sap.m.ResponsivePopover('responsivePopover', {
		showHeader: false,
		contentWidth: '80%',
		horizontalScrolling: false,
		modal: true,
		placement: sap.m.PlacementType.Auto,
		showCloseButton: true,
		content: [
			new sap.ui.layout.VerticalLayout({
				width: '100%',
				content: [
					new sap.m.Label({
						text: bindingContext.getProperty('title')
					}).addStyleClass('labelPadding'),
					new sap.m.Label({
						text: bindingContext.getProperty('creator')
					}).addStyleClass('labelPadding'),
					new sap.m.Label({
						text: bindingContext.getProperty('pubDate')
					}).addStyleClass('labelPadding'),
					new sap.m.Link({
						text: 'Open blog in new browser window...',
						href: bindingContext.getProperty('link'),
						target: '_blank'
					}).addStyleClass('labelPaddingL'),
					new sap.m.Text({
						text: bindingContext.getProperty('description')
					}).addStyleClass('labelPaddingL')
				]
			})
		],
		endButton: new sap.m.Button({
			width: '100%',
			text: 'Close',
			press: handlePopupClose
		})
	}).addStyleClass('sapUiPopupWithPadding');
	
	p.openBy(oEvent.getSource());
}

//
// Create Application
//
// On SAPHCP we need to use the Destination service for external calls. These just act as a proxy on /yql.
// However, elewhere there is no destination service so we speciofy the full url to the Yahoo YQL service. No CORS issues here.
//
if (window.location.href.indexOf('hanatrial') > -1) {
	var model = new sap.ui.model.json.JSONModel(serviceUrlProxy);
} else {
	var model = new sap.ui.model.json.JSONModel(serviceUrlSelectedFeeds);
	//var model = new sap.ui.model.json.JSONModel(serviceUrlAllContent);
}

new sap.m.App({pages: new sap.m.Page({
	title:"SCN Feeds",
	headerContent: new sap.m.Button({
		icon: "sap-icon://refresh",
		press: handleRefresh
	}),
	content: new sap.m.IconTabBar({
		items: [
			new sap.m.IconTabFilter({
				text: 'All',
				icon: 'sap-icon://database',
				key: 'ALL',
				iconColor: sap.ui.core.IconColor.Critical,
				content: new sap.m.List({
					items: {
						path: '/query/results/item',
						template: new sap.m.DisplayListItem({
							label: '{title}',
							type: sap.m.ListType.Active,
							press: handleListItemPress
						})
					}
				})
			}),
			new sap.m.IconTabFilter({
				text: 'HCP',
				icon: 'sap-icon://puzzle',
				key: 'HCP',
				content: new sap.m.List({
					items: {
						path: '/query/results/item',
						template: new sap.m.DisplayListItem({
							label: '{title}',
							type: sap.m.ListType.Active,
							press: handleListItemPress
						})
					}
				})
			}),
			new sap.m.IconTabFilter({
				text: 'UI5',
				icon:'sap-icon://ipad-2',
				key: 'UI5',
				content: new sap.m.List({
					items: {
						path: '/query/results/item',
						template: new sap.m.DisplayListItem({
							label: '{title}',
							type: sap.m.ListType.Active,
							press: handleListItemPress
						})
					}
				})
			}),
			new sap.m.IconTabFilter({
				text: 'ABAP',
				icon:'sap-icon://product',
				key: 'ABAP',
				content: new sap.m.List({
					items: {
						path: '/query/results/item',
						template: new sap.m.DisplayListItem({
							label: '{title}',
							type: sap.m.ListType.Active,
							press: handleListItemPress
						})
					}
				})
			}),
			new sap.m.IconTabFilter({
				text: 'FPM',
				icon:'sap-icon://widgets',
				key: 'FPM',
				content: new sap.m.List({
					items: {
						path: '/query/results/item',
						template: new sap.m.DisplayListItem({
							label: '{title}',
							type: sap.m.ListType.Active,
							press: handleListItemPress
						})
					}
				})
			})
		],
		select: function(oEvent) {
			var key = oEvent.getParameter("selectedKey"),
					filter,
					oBinding;
			
			//
			// The call to getItems() on the event source returns the array of
			// IconTabFilter's. We must index this by the position in the array
			// to get the correct items to filter.
			// Also note that we have to supply the two trailing parameters on
			// the Filter creation as dummies - they are required but not used
			// since we are overriding fnTest().
			//
			
			if (key === 'HCP') {
				filter = new sap.ui.model.Filter('category', 'EQ', null);
				filter.fnTest = function(value) {
					var tag;
					
					if (Array.isArray(value)) {
						tag = value[0];
					} else {
						tag = value;
					}
					
					if (tag) {
						return tag.domain === '/community/developer-center/cloud-platform/tags';
					} else {
						return false;
					}
				};
				
				oBinding = oEvent.getSource().getItems()[1].getContent()[0].getBinding("items");
				oBinding.filter([filter]);
				
			} else if (key === 'UI5') {
				filter = new sap.ui.model.Filter('category', 'EQ', null);
				filter.fnTest = function(value) {
					var tag;
					
					if (Array.isArray(value)) {
						tag = value[0];
					} else {
						tag = value;
					}
					
					if (tag) {
						return tag.domain === '/community/developer-center/front-end/tags';
					} else {
						return false;
					}
				};
				
				oBinding = oEvent.getSource().getItems()[2].getContent()[0].getBinding("items");
				oBinding.filter([filter]);
				
			} else if (key === 'ABAP') {
				filter = new sap.ui.model.Filter('category', 'EQ', null);
				filter.fnTest = function(value) {
					var tag;
					
					if (Array.isArray(value)) {
						tag = value[0];
					} else {
						tag = value;
					}
					
					if (tag) {
						return tag.domain === '/community/abap/tags';
					} else {
						return false;
					}
				};
				
				oBinding = oEvent.getSource().getItems()[3].getContent()[0].getBinding("items");
				oBinding.filter([filter]);
				
			} else if (key === 'FPM') {
				filter = new sap.ui.model.Filter('category', 'EQ', null);
				filter.fnTest = function(value) {
					var tag;
					
					if (Array.isArray(value)) {
						tag = value[0];
					} else {
						tag = value;
					}
					
					if (tag) {
						return tag.domain === '/community/web-dynpro-abap/floorplan-manager/tags';
					} else {
						return false;
					}
				};
				
				oBinding = oEvent.getSource().getItems()[4].getContent()[0].getBinding("items");
				oBinding.filter([filter]);
				
			} else {
				// key === 'ALL'
				oBinding = oEvent.getSource().getItems()[0].getContent()[0].getBinding("items");
				oBinding.filter([]);
			}
			
		}
	})
})})
.setModel(model)
.placeAt('content');


// Close dialogs when clicking outside
$(function() {
  $('body').on('click', '#sap-ui-blocklayer-popup', function() {
    var popover = sap.ui.getCore().byId('responsivePopover');
    popover.close();
    popover.destroy();
  });
});

//
// See here for the Yahoo YQL console for this query:
// https://developer.yahoo.com/yql/console/#h=select+*+from+rss+where+url+%3D+'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2420%26numItems%3D20%26full%3Dfalse'+or+url+%3D+'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2421%26numItems%3D20%26full%3Dfalse'+or+url+%3D+'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2015%26numItems%3D20%26full%3Dfalse'+or+url+%3D+'http%3A%2F%2Fscn.sap.com%2Fcommunity%2Ffeeds%2Fblogs%3Fcommunity%3D2184%26numItems%3D20%26full%3Dfalse'
//