import ContentWrapper from '../../../../components/Layout/ContentWrapper';
import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Pagination, PaginationLink, PaginationItem, Input, Modal, ModalBody, ModalFooter, Alert } from 'reactstrap';

interface Cliente {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    cep: string;
}

interface State {
    clientes: Cliente[];
    query: string;
    showDeleteModal: boolean;
    clienteToDelete: Cliente | null;
    notificDelete: boolean;
    notificMsg: string;
}

class ClienteForm extends Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            clientes: [],
            query: '',
            showDeleteModal: false,
            clienteToDelete: null,
            notificDelete: false,
            notificMsg: ''
        };
    }

    openDeleteModal = (cliente: Cliente) => {
        this.setState({ showDeleteModal: true, clienteToDelete: cliente });
    };

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false, clienteToDelete: null });
    };

    handleDelete = async () => {
        try {
            const { clienteToDelete } = this.state;
            if (clienteToDelete === null) return;
            const response = await fetch(`http://localhost:5000/clientes/${clienteToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Falha ao deletar cliente');
            }
            this.setState(prevState => ({
                clientes: prevState.clientes.filter(cliente => cliente.id !== clienteToDelete.id),
                showDeleteModal: false,
                clienteToDelete: null,
                notificDelete: true,
                notificMsg: `Cliente: ${clienteToDelete.nome}, deletado com sucesso!`
            }));
            setTimeout(() => {
                this.setState({ notificDelete: false });
            }, 3000);
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

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        this.setState({ query });
        if (query.length > 2) {
            this.fetchClienteNome(query);
        } else if (query.length <= 2) {
            this.fetchClientes();
        }
    };

    fetchClientes = async () => {
        try {
            const response = await fetch('http://localhost:5000/clientes');
            const data = await response.json();
            this.setState({ clientes: data });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    componentDidMount() {
        this.fetchClientes();
    }

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Form submitted..');
        e.preventDefault();
    }

    render() {
        const { clientes, query, showDeleteModal, clienteToDelete, notificDelete, notificMsg } = this.state;

        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Tela de consulta de clientes
                        <small>A tela pricipal do projeto</small>
                    </div>
                </div>
                <Card>
                    <CardBody>
                        <form onSubmit={this.onSubmit}>
                            <label>Buscar por nome:</label>
                            <Input value={query} onChange={this.handleChange} />
                            <Card className="card-default">
                                <CardBody>
                                    <Table bordered responsive>
                                        <thead>
                                            <th>Id</th>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th>CEP</th>
                                        </thead>
                                        <tbody>
                                            {clientes.map((cliente) => (
                                                <tr key={cliente.id}>
                                                    <td>{cliente.id}</td>
                                                    <td>{cliente.nome}</td>
                                                    <td>{cliente.email}</td>
                                                    <td>{cliente.telefone}</td>
                                                    <td>{cliente.cep}</td>
                                                    <td>
                                                        <Button
                                                            outline className="mb-1"
                                                            color="danger"
                                                            onClick={() => this.setState({
                                                                showDeleteModal: true,
                                                                clienteToDelete: cliente
                                                            })}
                                                            style={{ marginLeft: '10px' }}
                                                        >
                                                            Deletar
                                                        </Button>
                                                        <Button
                                                            outline className="mb-1"
                                                            color="primary"
                                                            tag="a"
                                                            href={`/update/${cliente.id}`}
                                                            style={{ marginLeft: '10px' }}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </form>
                        <Row>
                            <Col lg={10}>
                                <Pagination size="s">
                                    <PaginationItem>
                                        <PaginationLink previous href="#" /></PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="#" />
                                    </PaginationItem>
                                </Pagination>
                            </Col>
                            <Col>
                                <Button outline className="mb-2" color='green' size='lg' href="http://localhost:3000/new">Novo Cliente</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                <Modal
                    isOpen={showDeleteModal}
                    toggle={this.closeDeleteModal}
                    centered
                    className="sweet-alert-modal"
                >
                    <ModalBody style={{ padding: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <i
                                className="fa fa-exclamation-triangle"
                                style={{ fontSize: '80px', color: '#f8bb86', marginBottom: '20px' }}
                            ></i>
                            <h4 className="swal2-title" style={{ marginBottom: '1rem' }}>
                                Confirmar Exclusão
                            </h4>
                            <p>Tem certeza que deseja excluir o cliente: {clienteToDelete?.nome}?</p>
                        </div>
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: 'center', borderTop: 'none' }}>
                        <Button color="danger" onClick={this.handleDelete}>
                            Sim, deletar
                        </Button>
                        <Button color="secondary" onClick={this.closeDeleteModal}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                {notificDelete && (
                    <Alert
                        color="success"
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            zIndex: 9999,
                            minWidth: '300px'
                        }}
                    >
                        {notificMsg}
                    </Alert>
                )}

            </ContentWrapper>
        );
    }
}

export default ClienteForm;