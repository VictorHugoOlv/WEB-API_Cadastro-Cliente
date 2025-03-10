import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
//import BaseHorizontal from './components/Layout/BaseHorizontal';

/* Used to render a lazy component with react-router */
const waitFor = (Tag: React.LazyExoticComponent<any>) => (props: any) => <Tag {...props}/>;

const Welcome = lazy(() => import('./components/Welcome/Welcome'));
const Buttons = lazy(() => import('./components/Elements/Buttons'));
const Cards = lazy(() => import('./components/Elements/Cards'));
const TableStandard = lazy(() => import('./components/Tables/TableStandard'));
const FormStandard = lazy(() => import('./components/Forms/FormStandard'));
const FormCliente = lazy(() => import('./features/clientes/components/ClienteForm/clienteForm'));
const FormNovo = lazy(() => import('./features/clientes/components/ClienteForm/novoClienteForm'));
const FormEditar = lazy(() => import('./features/clientes/components/ClienteForm/editClienteForm'));

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages: Array<string> = [
    /* See full project for reference */
];

const Routes = ({ location }: RouteProps ) => {
    const currentKey = location!.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'

    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location!.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Suspense fallback={<PageLoader/>}>
                    <Switch location={location}>
                        {/* See full project for reference */}
                    </Switch>
                </Suspense>
            </BasePage>
        )
    }
    else {
        return (
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Suspense fallback={<PageLoader/>}>
                            <Switch location={location}>

                                <Route path="/welcome" component={waitFor(Welcome)}/>
                                <Route path="/buttons" component={waitFor(Buttons)}/>
					            <Route path="/cards" component={waitFor(Cards)}/>
                                <Route path="/table-standard" component={waitFor(TableStandard)}/>
				                <Route path="/form-standard" component={waitFor(FormStandard)}/>
                                <Route path="/cliente" component={waitFor(FormCliente)}/>
                                <Route path="/new" component={waitFor(FormNovo)}/>
                                <Route path="/update/:id" component={waitFor(FormEditar)}/>

                                <Redirect to="/welcome"/>
                            </Switch>
                        </Suspense>
                    </div>
                </CSSTransition>
              </TransitionGroup>
            </Base>
        )
    }
}

export default withRouter(Routes);
