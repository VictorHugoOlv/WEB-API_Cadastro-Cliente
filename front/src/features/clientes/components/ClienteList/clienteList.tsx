// import React from 'react';
// import { CardWithHeader } from '../../../components/Elements/Buttons';
// import { Table } from '../../../components/Tables/TableStandart';
// import { Customer } from '../types/customer';
import React, { Component, useEffect, useState } from 'react';

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: number;
    cep: number;
  }

const [clientes, setCliente] = useState<Cliente[]>([]);
const [error, setError] = useState<string>('');

useEffect(() => {
    fetch('http://localhost:5000/clientes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da API');
        }
        return response.json();
      })
      .then((data: Cliente[]) => setCliente(data))
      .catch((err: Error) => setError(err.message));
  }, []);


export{}