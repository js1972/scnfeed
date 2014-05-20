scnfeed
=======

SCN feed reader (using OpenUI5)

A basic OpenUI5 / SAPUI5 application using an IconTabBar as the main container, which shows a list of SCN feeds.
To capture the feed data and return it to the app as JSON I have used Yahoo's YQL.
With YQL we can build up an SQL-like query to read the required feed data, such as:

```select * from rss where url = 'http://scn.sap.com/community/feeds/blogs?community=2420&numItems=20&full=false'
or url = 'http://scn.sap.com/community/feeds/blogs?community=2421&numItems=20&full=false'
| sort(field="date", descending="true")```

This example query will read the SCN Jive feed for the 'SAP HANA Cloud Platform' and the 'SAPUI5' spaces; combine them and sort by posting dates descending. Returning is all as JSON so that we can simply access it with a UI5 JSONModel.

Currently the app reads the following SCN feeds:
 - HCP (HANA Cloud Platform)
 - UI5
 - ABAP
 - FPM (WebDynpro - Floorplan Manager)
 
The most recent 20 blog posts are read for each feed.

Possible enhancements:
 1. A settings dialog to control the amount of posts retrieved in each feed
 2. Pull-to-refresh capability for mobile
 3. Ability to read comments on blogs (the SCN rss feed does not seem to allow us to directly pull the comments for a specific blog - only all the comments for a space)
 4. A possible capability to allow "starring" blogs to read. Could be just a call out to Instapaper for example or send to Evernote
 5. The ultimate - create a backend service that will continually read the rss feeds and from their - interact with devices (frontend) via web sockets. Having a backend will enable full control and the ability to save state (starring), etc.
