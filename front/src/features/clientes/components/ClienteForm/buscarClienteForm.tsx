import ContentWrapper from '../../../../components/Layout/ContentWrapper';
import React, { Component, } from 'react';
import { Col, Card, CardBody, Input, Button, } from 'reactstrap';

interface Cliente {
    id?: number;
    nome: string;
    email: string;
    telefone: number;
    cep: number;
}

class BuscarForm extends Component<{}, { clientes: Cliente[], query: string }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            clientes: [],
            query: ''
        };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        this.setState({ query });
        if (query.length > 0) {
            this.fetchClienteNome(query);
        }
    };

    handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/clientes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Falha ao deletar cliente');
            }
            this.setState(prevState => ({
                clientes: prevState.clientes.filter(cliente => cliente.id !== id)
            }));
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
        }
    }

    fetchClienteNome = async (nome: string) => {
        try {
            const response = await fetch(`http://localhost:5000/clientes/nome?query=${encodeURIComponent(nome)}`);
            if (response.status === 404) {
                this.setState({ clientes: [] });
                return;
            }
            if (!response.ok) {
                throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
            }
            const data = await response.json();
            this.setState({ clientes: data });
        } catch (error) {
            console.error('Erro ao buscar cliente por nome:', error);
        }
    }

    render() {
        const { clientes, query } = this.state;

        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Tela de busca de clientes
                        <small>É aberta após clicar em Buscar Cliente</small>
                    </div>
                </div>
                <Col lg={11}>
                    <Card>
                        <CardBody>
                            <form >
                                <label>Digite o Id ou Nome do cliente</label>
                                <Input value={query} onChange={this.handleChange} />
                                <ul>
                                    {clientes.length > 3 ? (
                                        clientes.map((cliente) => (
                                            <li key={cliente.id}><strong>{cliente.nome}</strong> - {cliente.email} - {cliente.telefone} - {cliente.cep}
                                                <Button
                                                    onClick={() => this.handleDelete(cliente.id!)}
                                                    style={{ marginLeft: '10px', color: 'red' }}
                                                >
                                                    Deletar
                                                </Button>
                                                <Button
                                                    tag="a"
                                                    href={`/update/${cliente.id}`}
                                                    style={{ marginLeft: '10px', color: 'blue' }}
                                                >
                                                    Editar
                                                </Button>
                                            </li>
                                        ))
                                    ) : (
                                        query.length > 0 && <li>Nenhum cliente encontrado</li>
                                    )}
                                </ul>
                            </form>
                            <Button outline className="mb-2" color="primary" size='lg' href="http://localhost:3000/cliente">OK</Button>
                        </CardBody>
                    </Card>
                </Col>
            </ContentWrapper>
        );
    }
}

export default BuscarForm;