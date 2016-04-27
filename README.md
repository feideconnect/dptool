# dptool

Dataporten Command Line Tool


Install

	npm install -g dptool

Configure (se internal documentation)

	dptool configure xxxx-xxxx-xxx xxxx-xxxx-xxxx


Usage 

	 dptool configure [id] [secret]          Configure your CLI client.
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
	 dptool orgs create -f [filename]        Create organization
	 dptool orgs update -f [filename]        Update organization
	 dptool orgs service add [orgid] [srv]   Add service for an org
	 dptool orgs service remove [orgid] [srv] Remove service for an org
	 dptool orgs logo get [orgid] -o [file]  Get logo and store to disk
	 dptool orgs logo set [orgid] -f [file]  Upload logo from disk
	        [srv] may be one of auth, pilot, avtale 
	 dptool orgs setrole [orgid] [feideid] [roles]  Set roles for a user
	        roles may be admin, mercantile, technical
	 dptool orgs removerole [orgid] [feideid]       Remove roles for a user
	 dptool orgs ldap_status [feideid]       Check ldap status for the org by looking up the specified feideid
	 dptool orgs peoplesearch [realm] [searchterm] [--sameorg]  Test people search for an organization. Use --sameorg to pretent to be in the same organization

	 dptool token [id] [secret]              Custom request to just get a token for a specific client_id and secret.
	                           Make sure to configure redirect_uri for this client: http://127.0.0.1:12012/callback
	 dptool gk [id] [token] [path]           Perform a GET request to a gatekeeper endpoint
	                           Example: dptool gk testapi 12345 /foo

	 dptool version                          Get details about the deployed versions of Dataporten

	 options: 
	    --json     Print all info instead of simple listings..
	    --pretty   Pretty print JSON with colours..
	    --o [file] Output JSON to file
	    --configset [set] Read from .dptool-config-[set].json 
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


