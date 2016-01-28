# dptool

Dataporten Command Line Tool


Install dependencies

	npm install

Prepare

	mv /usr/local/bin/dptool $PWD/index.js
	chmod a+x /usr/local/bin/dptool

Usage 

	 dptool auth               Authenticate user.
	 dptool me                 About me (userinfo).
	 dptool groups me          List my groups.
	 dptool clients all        List all clients.
	 dptool clients mine       List my clients.
	 dptool apis all           List all APIs.
	 dptool apis mine          List my APIS.
	 dptool orgs list          List organizations.
	 dptool orgs get [orgid]   Show organization

	 options: 
	    --json    Print all info instead of simple listings..

Example:

	[andreas@dmandsol14:dptool]$ dptool  groups me
	id                                             displayName                            
	---------------------------------------------  ---------------------------------------
	fc:orgadmin:uninett.no                         Administratorer for UNINETT            
	fc:adhoc:fea9fe3a-8d97-4805-9c0b-e54f5e282206  Connect Prosjektgruppe                 
	fc:adhoc:81d852b5-3cb5-49ce-9a37-6e39a4020a66  Connect referansegruppe                
	fc:adhoc:090fe2d3-47ed-4158-bfc9-cfe4db321d3c  Tester å lage en ny gruppe             
	fc:org:uninett.no                              UNINETT AS                             
	fc:org:uninett.no:unit:AVD-U20                 Avdeling for System og Mellomvare      
	fc:platformadmin:admins                        Plattformadministratorer for Dataporten


