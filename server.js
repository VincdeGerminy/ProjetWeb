/******** Chargement des Middleware ********/
const bodyParser = require('body-parser'); 
const express = require('express');
const app = express(); 
const path = require("path");
const pg = require("pg");
const sha1=require("sha1");
const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session); 
const multer = require('multer');
const upload = multer({ dest: 'imageProfile/' });
const fs = require('fs');
/*const client = new pg.Client({
    host: 'localhost',
    database : "etd",
    user: 'uapv1602077',
    password: '50EXqC',
});
*/


/******** Declaration des variables *******/


/******** Configuration du serveur NodeJS - Port : 3004 ********/
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

var server = app.listen(3004,function() {  

    console.log('listening on 3004'); 


}); 

app.use(session({// charge le middleware express-session dans la pile 
	secret: 'ma phrase secrete',
	saveUninitialized: false, // Session créée uniquement à la première sauvegarde de données
	resave: false, // pas de session sauvegardée si pas de modif
	store :new MongoDBStore({ // instance de connect-mongodb-session
		uri: "mongodb://localhost:27017/db", 
		collection: 'mySessions3004', 
		touchAfter: 24 * 3600 // 1 sauvegarde toutes les 24h hormis si données MAJ 
	}), 
	cookie : {maxAge : 24 * 3600 * 1000} // millisecond valeur par défaut  { path: '/', httpOnly: true, secure: false, maxAge: null } 
})); 

/******** Gestion des URI *******/




app.use(express.static(__dirname + '/CERIGame'));



app.post('/login', function (req, res) {
	console.log(req.body)
    var usernameText = req.body.username;
    var mdp = req.body.pwd;
    console.log("Connection utilisateur : " + usernameText + ", mot de passe : " + mdp);


    var client = new pg.Client({
        host: 'localhost',
        database: "etd",
        user: 'uapv1602077',
        password: '50EXqC',
    });
    client.connect();
    client.query("SELECT * from fredouil.users where identifiant='" + usernameText+"' and motpasse='"+sha1(mdp)+"'", (err, resu) => {
        //if (err) throw err;
       
        client.end();

        
       
        if (resu.rowCount == 1){
        	req.session.userID = resu.rows[0].id;
        	delete resu.rows[0].motpasse;
        }
        
        res.send(resu.rows[0]);
        
    })
	
});




app.get('/historique', function (req, res) {

    var client = new pg.Client({
        host: 'localhost',
        database: "etd",
        user: 'uapv1602077',
        password: '50EXqC',
    });
    client.connect();
    client.query("SELECT * from fredouil.historique where id_users=" + "1" + " ORDER BY date", (err, resu) => {
        //if (err) throw err;

        client.end();

        //console.log(jsonObj);
        //console.log(resu.rows);
        res.send(resu.rows);

    });
});


app.post('/changeImageProfil', upload.single('ProfilImage'), function (req, res) {
    console.log("On demande un changement d'image");
    var file = req.file;
    console.log(file);

    var newName = "imageProfile/" + (new Date).valueOf() + "-" + file.originalname;

    fs.rename(file.path, newName, function (err) {

    });

    var newPathSql = "https://pedago.univ-avignon.fr/~uapv1602077/projet/imageProfile/" + newName;
    var client = new pg.Client({
        host: 'localhost',
        database: "etd",
        user: 'uapv1602077',
        password: '50EXqC',
    });
    client.connect();
    var resq = "UPDATE fredouil.users set avatar = '" + newPathSql + "' where id = " + req.body.id;
    console.log(resq);
    client.query(resq, (err, resu) => {
        //if (err) throw err;

        client.end();
    });
    console.log(req.body.id);
    res.send("Done");
});






app.all('/', function (req, res) { 
    //res.send("test");
	res.sendFile(path.join(__dirname+'/CERIGame/index.html'));
});


