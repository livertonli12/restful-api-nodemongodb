var mongoose                  = require("mongoose");
//Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/demoDb');
//Criando a instância do Schema
var mongoSchema = mongoose.Schema;
//Criando o Schema
var userSchema = {
	"userEmail": String,
	"userPassword": String
};
//Cria a model se não existir
module.exports = mongoose.model('userLogin', userSchema);