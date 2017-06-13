angular.module('MailBox.services',[])
	.factory('mailBoxService', function($resource, $rootScope) {
	    var service = $resource('https://seminario-mail-backend.mybluemix.net/email/:id', {id:'@_id'}, {
	        get: {
	        	method: 'GET'
	        },
	        listEmails: {
	        	method: 'GET',
	        	url: 'https://seminario-mail-backend.mybluemix.net/emails',
	        	isArray: true
	        },
	        getAllMailsSpam: {
	        	method: 'GET',
	        	url: 'https://seminario-mail-backend.mybluemix.net/emailspam',
	        	isArray: true
	        },
	        getAllMailsNoSpam: {
	        	method: 'GET',
	        	url: 'https://seminario-mail-backend.mybluemix.net/emailnospam',
	        	isArray: true
	        },
	        sendNewEmail: {
	        	method: 'POST',
	        	url: 'https://seminario-mail-backend.mybluemix.net/new/email'
	        }
	    });

	    return service;
	});
