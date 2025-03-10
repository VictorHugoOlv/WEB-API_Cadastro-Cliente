import ContentWrapper from '../../../../components/Layout/ContentWrapper';
import React, { Component, } from 'react';
import { Col, Card, CardBody, Input, Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import InputMask from 'react-input-mask';

interface Cliente {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    cep: string;
}

interface State {
    originalCliente: Cliente;
    editedCliente: Cliente;
    showModal: boolean;
}

class UpdateClient extends Component<{ match: any, history: any }, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            originalCliente: { nome: '', email: '', telefone: '', cep: '' },
            editedCliente: { nome: '', email: '', telefone: '', cep: '' },
            showModal: false,
        };
    }

    openModal = () => {
        this.setState({ showModal: true })
    }

    closeModal = () => {
        this.setState({ showModal: false })
    };

    fetchCliente = async () => {
        const { id } = this.props.match.params;
        try {
            const response = await fetch(`http://localhost:5000/clientes/${id}`);
            if (!response.ok) throw new Error('Cliente não encontrado');
            const data = await response.json();
            this.setState({
                originalCliente: data,
                editedCliente: data
            });
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);

        }
    }

    componentDidMount() {
        this.fetchCliente();
    }

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const { originalCliente, editedCliente } = this.state;

        const clienteAtualizado: Cliente = {
            ...originalCliente,
            nome: editedCliente.nome || originalCliente.nome,
            email: editedCliente.email || originalCliente.email,
            telefone: editedCliente.telefone || originalCliente.telefone,
            cep: editedCliente.cep || originalCliente.cep
        };

        try {
            const response = await fetch(`http://localhost:5000/clientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteAtualizado)
            });
            if (!response.ok) throw new Error('Falha na atualização');
            this.props.history.replace("/cliente");
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            editedCliente: {
                ...prevState.editedCliente,
                [name]: value
            }
        }));
    }

    render() {

        const { editedCliente, originalCliente, showModal, } = this.state;



        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Editar Cliente
                        <small>Editando: {originalCliente.nome}</small>
                    </div>
                </div>
                <Col lg={11}>
                    <Card>
                        <CardBody>
                            <form onSubmit={this.handleSubmit}>
                                <Input
                                    name="nome"
                                    value={editedCliente.nome}
                                    onChange={this.handleChange}
                                    placeholder={originalCliente.nome}
                                    className="mb-3"
                                    required
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    value={editedCliente.email}
                                    onChange={this.handleChange}
                                    placeholder={originalCliente.email}
                                    className="mb-3"
                                    required
                                />
                                <InputMask
                                    mask="+55 (99) 99999-9999"
                                    name="telefone"
                                    value={editedCliente.telefone}
                                    onChange={this.handleChange}
                                >
                                    {(inputProps: any) => <Input {...inputProps} type="tel" placeholder={originalCliente.telefone} className="mb-3" required />}
                                </InputMask>
                                <InputMask
                                    mask="99999-999"
                                    name="cep"
                                    value={editedCliente.cep}
                                    onChange={this.handleChange}
                                >
                                    {(inputProps: any) => <Input {...inputProps} placeholder={originalCliente.cep} className="mb-3" required />}
                                </InputMask>

                                <div className="mt-4">
                                    <Button color="primary" className="mr-2"
                                        onClick={() => this.openModal()}
                                    >
                                        Salvar Alterações
                                    </Button>
                                    <Button type="button" color="secondary" onClick={() => this.props.history.goBack()}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
                <Modal
                    isOpen={showModal}
                    toggle={this.closeModal}
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
                                Confirmar Alterações
                            </h4>
                            <p>Tem certeza que são essas as alterações?</p>
                            <p>{editedCliente.nome}|--|{editedCliente.email}|--|{editedCliente.telefone}|--|{editedCliente.cep}</p>
                        </div>
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: 'center', borderTop: 'none' }}>
                        <Button color="danger" onClick={this.handleSubmit}>
                            Sim, alterar
                        </Button>
                        <Button color="secondary" onClick={this.closeModal}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </ContentWrapper>
        );
    }
}

export default UpdateClient;