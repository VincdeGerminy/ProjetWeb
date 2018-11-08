angular.module("quizzGame", [])
.controller("QuizzControlleur", quizzControlleur)
.service("auth", AuthService)
//.factory("socket", treatSocket)
.factory("localStorage", localStorageServiceFactory)
.service("accessDataService", accessDataService) 
.service("session", sessionService)
.service("historiqueUser", accessHistoriqueUser)
    .service('fileUpload', fileUploadService)
    .service('quizzLibrary',quizzLibraryService)



