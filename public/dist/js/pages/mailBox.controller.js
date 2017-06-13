angular.module('MailBox.controllers', []).controller('MailBoxController', function ($scope, $timeout, mailBoxService) {
	$scope.showModal = function() {
		waitingDialog.show('', {
	        dialogSize : 'sm',
	        progressType : 'ghostwhite'
	    });
	};
	
	$scope.showModal();

    $scope.showIconRefresh = false;
	$scope.titlePage = "Caixa de entrada";
	$scope.countAllMails = 0;
	$scope.mails = [];
	$scope.classImputBox = "active";
	$scope.classSpamPage = null;
	$scope.numberEmailsNoSpam = 0;
	$scope.numberEmailsSpam = 0;
	$scope.whereAmI = "Caixa de entrada";
	
	$scope.newMessage = {};
	$scope.newMessage.mailFrom = "";
	$scope.newMessage.subject = "";
	$scope.newMessage.message = "";
	
	
	
	mailBoxService.getAllMailsSpam(function(response) {
		$scope.numberEmailsSpam = response.length;
		mailBoxService.getAllMailsNoSpam(function(response) {
			$scope.numberEmailsNoSpam = response.length;
			$scope.recalculationNumberTotalMails();
		    waitingDialog.hide();
		});
	});
	
	$scope.refreshList = function() {
		if($scope.whereAmI === "Caixa de entrada") {
			$scope.loadInputBoxPage();
		} else if ($scope.whereAmI === "Caixa de entrada > Spam"){
			$scope.loadSpamPage();
		}
		cancelRefresh = $timeout($scope.refreshList, 2000);
	}
	
	$scope.whereAmIDifferent = function(actual) {
		if($scope.whereAmI === actual) {
			return false;
		} else {
			return true;
		}
	}
	
	$scope.showModalSendMessage = function() {
		$('#sendMessageModal').modal({
        	backdrop: 'static',
            keyboard: true,
            show: true
        });
	}
	
	$scope.sendNewMessage = function() {
		console.log($scope.newMessage);
		if($scope.newMessage.mailFrom !== "" && $scope.newMessage.subject !== "" && $scope.newMessage.message !== "") {
			mailBoxService.sendNewEmail({message: $scope.newMessage}, function() {
				$('#sendMessageModal').modal("hide");
				$scope.newMessage.mailFrom = "";
				$scope.newMessage.subject = "";
				$scope.newMessage.message = "";
			});
		} else {
			 alert("Preencha todos os campos para enviar o e-mail.");
		}

	}
	
	$scope.loadInputBoxPage = function() {
		if($scope.whereAmIDifferent("Caixa de entrada")) {
			$scope.mails = "";
		    $scope.showIconRefresh = true;
		}
		$scope.whereAmI = "Caixa de entrada";
		$scope.titlePage = "Caixa de entrada";
		$scope.classSpamPage = null;
		$scope.classImputBox = "active";
		mailBoxService.getAllMailsNoSpam(function(response) {
			$scope.mails = response;
			$scope.numberEmailsNoSpam = response.length;
			$scope.recalculationNumberOfSpams();
		});
	}
	
	$scope.loadSpamPage = function() {
		if($scope.whereAmIDifferent("Caixa de entrada > Spam")) {
			$scope.mails = "";
		    $scope.showIconRefresh = true;
		}
		$scope.whereAmI = "Caixa de entrada > Spam";
		$scope.titlePage = "Spam";
		$scope.classImputBox = null;
		$scope.classSpamPage = "active";
		mailBoxService.getAllMailsSpam(function(response) {
			$scope.mails = response;
			$scope.numberEmailsSpam = response.length;
			$scope.recalculationNumberOfNoSpams();
		});
	}
	
	$scope.recalculationNumberTotalMails = function() {
		mailBoxService.listEmails(function(response) {
			$scope.countAllMails = response.length;
            $scope.showIconRefresh = false;
		});
	}
	
	$scope.recalculationNumberOfSpams = function() {
		mailBoxService.getAllMailsSpam(function(response) {
			$scope.numberEmailsSpam = response.length;
			$scope.recalculationNumberTotalMails();
		});
	}
	
	$scope.recalculationNumberOfNoSpams = function() {
		mailBoxService.getAllMailsNoSpam(function(response) {
			$scope.numberEmailsNoSpam = response.length;
			$scope.recalculationNumberTotalMails();
		});
	}
	
	$scope.refreshList();
});