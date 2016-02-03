# dptool

Dataporten Command Line Tool


Install dependencies

	npm install

Configure

	cp etc/config.template.json etc/config.json

> Then add the application secret into the config.


Prepare

	mv /usr/local/bin/dptool $PWD/index.js
	chmod a+x /usr/local/bin/dptool

Usage 

	 dptool auth                             Authenticate user.

	 dptool me                               About me (userinfo).
	 dptool groups me                        List my groups.

	 dptool clients all                      List all clients.
	 dptool clients mine                     List my clients.
	 dptool clients get [id]                 Get specific client
	 dptool clients delete [id]              Delete specific client
	 dptool clients create -f [filename]     Register new client
	 dptool clients update -f [filename]     Update existing client

	 dptool apis all                         List all APIs.
	 dptool apis mine                        List my APIS.
	 dptool apis get [id]                    Get specific API
	 dptool apis delete [id]                 Delete specific API
	 dptool apis create -f [filename]        Register new API
	 dptool apis update -f [filename]        Update existing API

	 dptool orgs list                        List organizations.
	 dptool orgs get [orgid]                 Show organization
	 dptool orgs update -f [filename]        Update organization
	 dptool orgs service add [orgid] [srv]   Add service for an org
	 dptool orgs service remove [orgid] [srv] Remove service for an org
	        [srv] may be one of auth, pilot, avtale 

	 options: 
	    --json     Print all info instead of simple listings..
	    --pretty   Pretty print JSON with colours..
	    --o [file] Output JSON to file
	    --sort [field]    Sort by specific field
	    --reverse         Reverse sort
	    --limit [num]     Limit rows

	 experimental: 
	    --summary         List numbers of clients per user (only for clients all)

Example:

	$ dptool  groups me
	id                                             displayName                            
	---------------------------------------------  ---------------------------------------
	fc:orgadmin:uninett.no                         Administratorer for UNINETT            
	fc:adhoc:fea9fe3a-8d97-4805-9c0b-e54f5e282206  Connect Prosjektgruppe                 
	fc:adhoc:81d852b5-3cb5-49ce-9a37-6e39a4020a66  Connect referansegruppe                
	fc:adhoc:090fe2d3-47ed-4158-bfc9-cfe4db321d3c  Tester å lage en ny gruppe             
	fc:org:uninett.no                              UNINETT AS                             
	fc:org:uninett.no:unit:AVD-U20                 Avdeling for System og Mellomvare      
	fc:platformadmin:admins                        Plattformadministratorer for Dataporten


