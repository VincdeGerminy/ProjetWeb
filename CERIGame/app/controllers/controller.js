
function quizzControlleur($scope, auth, localStorage,session,historiqueUser,fileUpload,quizzLibrary/*,socket*/,$interval) {
	/** 
	* lance l'écoute des websocket par io.sockets
	* chargement du bandeau de notification à chaque message reçu 
	**/
    /*socket.on('notification', function (data) {
        alert('controleur - socket.on => ' + data);
        $scope.bandeauDisplay('Message du serveur ' + data);
    });*/
/*$scope.getMyHistorique = [{ id: 6, id_users: 1, date: "2018-07-11T22:00:00.000Z"},
{ id: 7, id_users: 1, date: "2018-07-11T22:00:00.000Z"},
 { id: 8, id_users: 1, date: "2018-07-11T22:00:00.000Z"},
  { id: 9, id_users: 1, date: "2018-07-11T22:00:00.000Z"}];

*/
    $scope.username = null;
    $scope.password = null;

    

    $scope.getMyHistorique = {}
    //resetVar();

    $scope.login = function () { // appel au service d'authentification
        auth.logIn($scope.username, $scope.password).then(function (data) {
            //$scope.$apply();
            console.log("go Data:");
            console.log(data);

            if (data != "") {
                localStorage.setItem("LastConnection", new Date());
                console.log($scope.nom);
                $scope.displayConnect(true);
                $scope.inSelectDifficultyQuizz = true;
                $scope.inQuizz = true;
            } else {
                
                $scope.displayConnect(false);
            }
        });

    }


    
    $scope.isLogged = function () {
        
        return auth.isLoggedIn();
    }

    $scope.goQuizz = function () {
        $scope.inSelectDifficultyQuizz = true;
        $scope.inQuizz = true;
    }

    function resetVar(){
        console.log("reset of all Var")
        $scope.inProfil = false;
        $scope.inResolveQuizz = false;
        $scope.inSelectDifficultyQuizz = false;
        $scope.inQuizz = false;
    }


    $scope.getLastName = function () {
        return session.getUser().nom;
    }
    $scope.getFirstName = function () {
        return session.getUser().prenom;
    }
    $scope.getAvatar = function () {
        if (session.getUser().avatar == null){
            return "../image/defaultProfile.png";
        }
        return session.getUser().avatar;
    }
    $scope.getBirthday = function () {
        return session.getUser().date_de_naissance;
    }
    $scope.getStatut = function () {
        if (session.getUser().statut == null )return "Aucun Statut"
        return session.getUser().statut;
    }

    $scope.getBackgroundAvatar = function(){
        var tmp = "url('"+$scope.getAvatar()+"')"
        return {'background-image': tmp}
    }

    $scope.date = new Date();
    function updateDate() {
        $scope.date = new Date();

    };
    $interval(updateDate, 1000);


    $scope.textLoginResult = "";
    $scope.displayConnect = function (logged) {
        if (logged) {
            $scope.textLoginResult = "Vous etes Connecté";
            $("#loginResult").css({ "opacity": "0", "visibility": "visible" });
            $("#loginResult").animate({ "opacity": "1" }, 1000, function () {
                setTimeout(function () {
                    $("#loginResult").animate({ "opacity": "0" }, 1000, function () {
                        $("#loginResult").css({ "visibility": "hidden" });
                    });
                },4000);
            });
        } else {
            $scope.textLoginResult = "Echec de la connection";
            $("#loginResult").css({ "opacity": "0", "visibility": "visible" });
            $("#loginResult").animate({ "opacity": "1" }, 1000, function () {
                setTimeout(function () {
                    $("#loginResult").animate({ "opacity": "0" }, 1000, function () {
                        $("#loginResult").css({ "visibility": "hidden" });
                    });
                },4000);
            });
        }

        
    }

    $scope.lastLogging = function () {
        return new Date(localStorage.getItem("LastConnection"));
    }
    
    $scope.logout = function () {
        resetVar();
        auth.logOut();
	}
    

    $scope.myHistorique = {};
    //console.log("avant");
    //console.log($scope.getMyHistorique);

    



    $scope.goProfil = function () {
        historiqueUser.getMyHistorique().then(function (data) {
            console.log("yes")
            console.log(data);
            $scope.myHistorique = data;
            resetVar();
            $scope.inProfil = true;
            console.log("out of goProfil");
        });

    };

   

    $scope.isProfil = function () {
        return $scope.inProfil;
    };

    $scope.questionNow = {};
    $scope.allQuestion = [];
    $scope.countGoodRep = 0;
    var indQuestion = 0;
    $scope.startQuizz = function (nbRep) {
        console.log("Quizz Start with " + nbRep + "responses.");
        quizzLibrary.giveOneQuizz(nbRep).then(function (oneQuizz) {
            console.log(oneQuizz);
            $scope.allQuestion = oneQuizz;
            $scope.countGoodRep = 0;

            $scope.questionNow = $scope.allQuestion.quizz.shift();
            $scope.inSelectDifficultyQuizz = false;
            $scope.inResolveQuizz = true;
        });
    };

    $scope.nextQuestion = function(selectRep){
        console.log("hey");
        if(selectRep == $scope.questionNow.propositions.indexOf($scope.questionNow.reponse)) $scope.countGoodRep+=1;
        $scope.questionNow =$scope.allQuestion.quizz.shift();
    }
    
    $scope.changeAvatar = function (ele) {
        console.log(ele.files[0]);
        console.log(ele);

        var uploadUrl = "http://pedago02a.univ-avignon.fr:3004/changeImageProfil";

        // file: File = null;
        //file = <File>ele.files[0];
        fileUpload.uploadFileToUrl(ele.files[0], uploadUrl);
    };
}
