from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy 
import os
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/clientes/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "PUT"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost:5432/flaskdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

migrate = Migrate(app, db)

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    telefone = db.Column(db.String(19), nullable=True)
    cep = db.Column(db.String(10), nullable=False)
   
    def __repr__(self):
        return f'<Cliente {self.nome}>'

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone,
            "cep": self.cep
        }

with app.app_context():
    if not os.path.exists('app.db'):
        db.create_all()


@app.route('/')
def home():
    return "Teste"


@app.route('/clientes', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.all()
    response = jsonify([cliente.to_dict() for cliente in clientes])
    response.headers.add('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.add('Pragma', 'no-cache')
    response.headers.add('Expires', '0')
    return response, 200

@app.route('/clientes/<int:id>', methods=['GET'])
def get_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    return jsonify(cliente.to_dict()), 200

@app.route('/clientes/nome', methods=['GET'])
def get_client():
    query = request.args.get('query','').strip()
    if not query:
        return jsonify([])
    clientes = Cliente.query.filter(Cliente.nome.ilike(f"%{query}%")).all()
    if not clientes:
        return jsonify({'message': 'Item not found'}), 404
    return jsonify([cliente.to_dict() for cliente in clientes]), 200


@app.route('/clientes/criar', methods=['POST'])
def create_clientes():
    data = request.get_json()
    if not data or 'nome' not in data or 'email' not in data or 'telefone' not in data or 'cep' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    new_cliente = Cliente(nome=data['nome'], email=data['email'], telefone=data['telefone'], cep=data['cep'])
    db.session.add(new_cliente)
    db.session.commit()
    return jsonify(new_cliente.to_dict()), 201


@app.route('/clientes/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({'message': 'Cliente deletado com sucesso'}), 200


@app.route('/clientes/<int:id>', methods=['PUT'])
def update_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados inválidos'}), 400
        
    cliente.nome = data.get('nome', cliente.nome)
    cliente.email = data.get('email', cliente.email)
    cliente.telefone = data.get('telefone', cliente.telefone)
    cliente.cep = data.get('cep', cliente.cep)
    
    db.session.commit()
    return jsonify(cliente.to_dict()), 200

if __name__ == '__main__':
    app.run(debug=True)