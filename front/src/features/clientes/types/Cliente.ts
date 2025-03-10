export enum EstadoCivil {
    Solteiro = 'Solteiro',
    Casado = 'Casado',
    UniaoEstavel = 'União Estável'
}

export enum UF {
    AC = 'Acre',
    AL = 'Alagoas',
    AP = 'Amapá',
    AM = 'Amazonas',
    BA = 'Bahia',
    CE = 'Ceará',
    DF = 'Distrito Federal',
    ES = 'Espírito Santo',
    GO = 'Goiás',
    MA = 'Maranhão',
    MT = 'Mato Grosso',
    MS = 'Mato Grosso do Sul',
    MG = 'Minas Gerais',
    PA = 'Pará',
    PB = 'Paraíba',
    PR = 'Paraná',
    PE = 'Pernambuco',
    PI = 'Piauí',
    RJ = 'Rio de Janeiro',
    RN = 'Rio Grande do Norte',
    RS = 'Rio Grande do Sul',
    RO = 'Rondônia',
    RR = 'Roraima',
    SC = 'Santa Catarina',
    SP = 'São Paulo',
    SE = 'Sergipe',
    TO = 'Tocantins'
}

export interface Customer {
    id: string;
    nome: string;
    dataNasc: Date;
    nacionalidade: string;
    localNasc: string;
    cpf: string;
    rg: number;
    localRG: string;
    estadoCivil: EstadoCivil;
    
    nomeMae: string;
    nomePai?: string;
    
    email: string;
    celular?: string;
    
    endereco: string;
    numeroEnder: string;
    complemento: string;
    cep: string;
    uf: UF;

    cidade: string;

    createdAt: Date;
    updatedAt: Date;
  }
  
  export type CustomerFormData = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;

  export type CPF = `${number}${number}${number}.${number}${number}${number}.${number}${number}${number}-${number}${number}`;

  export type CEP = `${number}${number}.${number}${number}${number}-${number}${number}${number}`;

  export type Celular = `+55 ${number}${number} ${number} ${number}${number}${number}${number}-${number}${number}${number}${number}`;

  export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;