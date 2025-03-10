import ContentWrapper from '../../../../components/Layout/ContentWrapper';
import React, { Component, } from 'react';
import { Row, Col, Card, CardBody, Input, Button, } from 'reactstrap';
import InputMask from 'react-input-mask';

interface Cliente {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    cep: string;
}

class NewForm extends Component<{match: any, history: any}, { cliente: Cliente }> {

    constructor(props: any) {
        super(props);
        this.state = {
            cliente: { nome: '', email: '', telefone: '', cep: '' }
        };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            cliente: { ...prevState.cliente, [name]: value }
        }));
    };

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/clientes/criar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.cliente)
            });
            if (response.ok) {
                this.setState({ cliente: { nome: '', email: '', telefone: '', cep: '' } });
                this.props.history.replace("/cliente");
            } else {
                alert('Erro ao cadastrar cliente.');
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    render() {
        const { cliente } = this.state;

        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Tela de criação de clientes
                        <small>É aberta após clicar em Novo Cliente</small>
                    </div>
                </div>
                <Row>
                    <Col lg={11}>
                        <Card>
                            <CardBody>
                                <form onSubmit={this.handleSubmit}>
                                    <Row>
                                        <div className="col-md-12">
                                            <label>Nome</label>
                                            <Input
                                                type="text"
                                                name='nome'
                                                placeholder="Nome do cliente"
                                                value={cliente.nome}
                                                onChange={this.handleChange} required />
                                        </div>
                                        <div className='col-md-5'>
                                            <label>Email</label>
                                            <Input
                                                type="email"
                                                name='email'
                                                placeholder="rodriguinho76parceria@gmail.com"
                                                value={cliente.email}
                                                onChange={this.handleChange} required />
                                        </div>
                                        <div className='col-md-2'>
                                            <label>Telefone</label>
                                            <InputMask
                                                mask="+55 (99) 99999-9999"
                                                name="telefone"
                                                value={cliente.telefone}
                                                onChange={this.handleChange}
                                                maskChar={null}
                                            >
                                                {(inputProps: any) => (
                                                    <Input
                                                        {...inputProps}
                                                        type="tel"
                                                        placeholder="+55 (99) 99999-9999"
                                                        required
                                                    />
                                                )}
                                            </InputMask>
                                        </div>
                                        <div className='col-md-2'>
                                            <label>CEP</label>
                                            <InputMask
                                                mask="99999-999"
                                                name="cep"
                                                value={cliente.cep}
                                                onChange={this.handleChange}
                                                maskChar={null}
                                            >
                                                {(inputProps: any) => (
                                                    <Input
                                                        {...inputProps}
                                                        type="text"
                                                        placeholder="00000-000"
                                                        required
                                                    />
                                                )}
                                            </InputMask>
                                        </div>
                                    </Row>
                                    <label ></label>
                                    <div>
                                        <Row>

                                            <Button outline className="mb-1" color="primary" size='xs' type="submit" style={{ marginLeft: '1130px' }}>OK</Button>

                                            <Button outline className="mb-1" color="danger" size='xs' style={{ marginLeft: '10px' }}  onClick={() => this.props.history.goBack()}>Cancel</Button>
                                        </Row>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ContentWrapper>
        );
    }
}

export default NewForm;