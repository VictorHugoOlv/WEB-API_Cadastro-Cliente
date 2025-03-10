export interface ISidebarMenuItem {
    heading?: string;
    name?: string;
    icon?: string;
    translate?: string;
    path?: string;
    label?: {
        value: string | number;
        color: string;
    };
    submenu?: ISidebarMenu;
}

export interface ISidebarMenu extends Array<ISidebarMenuItem> {}

const Menu: ISidebarMenu = [
    {
        heading: 'Cadastro de Clientes',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Welcome',
        path: 'welcome',
        icon: 'icon-grid',
        translate: 'sidebar.nav.WELCOME'
    },
    {
        name: 'Components',
        icon: 'icon-speedometer',
        translate: 'sidebar.nav.COMPONENTS',
        label: { value: 8, color: 'info' },
        submenu: [
            {
                name: 'Buttons',
                path: 'buttons'
            },
            {
                name: 'Forms',
                path: 'form-standard'
            },
            {
                name: 'Tables',
                path: 'table-standard'
            },
            {
                name: 'Cards',
                path: 'cards'
            },
            {
                name: 'Cliente',
                path: 'cliente'
            },
            {
                name: 'Novo Cliente',
                path: 'new'
            },
            {
                name: 'Buscar',
                path: 'buscar'
            },
            {
                name: 'Editar',
                path: 'update'
            }
        ]
    }
];

export default Menu;
