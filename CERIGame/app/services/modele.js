
function accessDataService($http){ 
    /** 
    * getInfo : la fonction getInfo retourne une promesse provenant du servicE http  
    * @param url 
    * @returns {*|Promise} 
    */
	this.postInfo = function(url){
		// Appel Ajax  
		return $http
		.post(url, {'username': username, 'pwd': pwd})	// renvoie d’une promesse 
		.then(function(response) { //First function hand les success
			return(response.data); 
		}, function(response) {//Second function handles error
			return("Something went wrong"); 
		}); 
    } 
} 


function localStorageServiceFactory($window) { 
	 /**
	 * factory pour creer une variable local storage et qui vérifie si le navigateur supporte cette fonction
	 * @param windows
	 * @returns window.localstorage
	 */
    if ($window.localStorage) {
        return $window.localStorage;
    }
    throw new Error('Local storage support is needed');
}




/* service/factory permettant la gestion des websocket par iosocket*/ 
function treatSocket($rootScope) { 
    var socket = io.connect('http://pedago02a.univ-avignon.fr:3004/'); 
    
	return { 
		on: function(eventName, callback){ 
			socket.on(eventName, callback); 
		}, emit: function(eventName, data) { 
			socket.emit(eventName, data); 
		} 
	};
}



/*service permettant la gestion de variable de session locales contenant les informations de derniere connexion de l'utilisateur  
*issu de  * https://www.jvandemo.com/learn-how-to-make-
* -in-your-angular-applications-simpler-and-more-consistent/  */ 
function sessionService($log, localStorage){ 
// Instantiate data when service isloaded
    this._user = JSON.parse(localStorage.getItem('session.user'));
	this.getUser = function(){ 
		return this._user; 
	}; 
	this.setUser = function(user){ 
		this._user = user; 
		localStorage.setItem('session.user', JSON.stringify(user)); 
		return this; 
    }; 
    /**
     * Destroy session
     */
    this.destroy = function destroy() {
        this.setUser(null);
        
    };
    
}


/* service permettant la mise en place d'une phase d'authentification  
* issu de https://www.jvandemo.com/learn-how-to-make-authentication-  
* in-your-angular-applications-simpler-and-more-consistent/  */ 
function AuthService($http,session){ 
	/** 
	*  Vérifie si l'utilisateur est connecté
	* @returnsboolean 
	*/ 
	this.isLoggedIn = function isLoggedIn(){ 
		return session.getUser() !== null; 
    }
    
    /** 
    * service appelé lors d'une tentative de connexion 
    * @ param credentials
    * returns |Promise} 
    */
    this.logIn = function (username, pwd) {
    	
        console.log(username);
        return $http
            .post('http://pedago02a.univ-avignon.fr:3004/login', { 'username': username, 'pwd': pwd })
            //.get('http://pedago02a.univ-avignon.fr:3004/login?username='+username+'&mdp='+pwd)
            .then(function (response,err) {
                
                
                console.log(response);
                console.log(response.data == "");
                if (response.data != ""){
                    
                    session.setUser(response.data);
                }
                return (response.data);
            });
    };



    /** 
   * service de déconnexion
   * @   returns {*|Promise} 
   */
    this.logOut = function () {
        /*return $http.get('http://pedago02a.univ-avignon.fr:3004/logout')
            .then(function (response) {
                // Destroy session in the browser 
                session.destroy();
                return (response.data);
            });*/
            session.destroy();
    }; 
    
}




function accessHistoriqueUser($http,session){ 
   
    this.getMyHistorique = function(){
         var retour = {} 
         return $http.get('http://pedago02a.univ-avignon.fr:3004/historique?id='+session.getUser().id)
        .then(function (reponse,err) {
            console.log(reponse.data);
            return reponse.data;
        });
        
    }
} 
 

function fileUploadService($http,session){
	this.uploadFileToUrl = function(file, uploadUrl){
        const fd = new FormData();
      
        fd.append('ProfilImage', file, file.name);
        fd.append('id', session.getUser().id);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function(res){

            console.log(res);
        });        
    };
    
}



function quizzLibraryService($http) {
    this.giveOneQuizz = function (nbReponse) {
        return $http.get("http://pedago02a.univ-avignon.fr:3004/quizz").then(function (rep, err) {
            oneQuizz = {};
            oneQuizz.theme = rep.data.thème;
            oneQuizz.redacteur = rep.data.rédacteur;
            oneQuizz.quizz = [];
            for (var i = 0 ; i < rep.data.quizz.length; i++){
                oneQuestion = {};
                oneQuestion.question = rep.data.quizz[i].question;
                oneQuestion.reponse = rep.data.quizz[i].réponse;
                oneQuestion.propositions = [];
                var tab = rep.data.quizz[i].propositions;
                oneQuestion.propositions.push(tab.splice(tab.indexOf(oneQuestion.reponse),1)[0]);
                for (var nb=0; nb<nbReponse-1;nb++){
                    oneQuestion.propositions.push(tab.splice(tab.indexOf(Math.floor(Math.random() * Math.floor(tab.length))),1)[0]);
                }
                oneQuestion.propositions.sort(function(a, b){return 0.5-Math.random()});
                oneQuizz.quizz.push(oneQuestion);
            }
            console.log(oneQuizz);
            return oneQuizz;
        });
    }
}


// Inject dependencies
localStorageServiceFactory.$inject = ['$window'];
AuthService.$inject = ['$http', 'session'];
sessionService.$inject = ['$log', 'localStorage'];
accessHistoriqueUser.$inject = ['$http','session'];
fileUploadService.$inject = ['$http','session'];
quizzLibraryService.$inject = ['$http'];
