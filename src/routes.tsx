import WorkloadListPage from './pages/WorkloadList/WorkloadListPage';
import ServiceListPage from './pages/ServiceList/ServiceListPage';
import IstioConfigPage from './pages/IstioConfigList/IstioConfigListPage';
import ServiceJaegerPage from './pages/ServiceJaeger/ServiceJaegerPage';
import IstioConfigDetailsPage from './pages/IstioConfigDetails/IstioConfigDetailsPage';
import WorkloadDetailsPage from './pages/WorkloadDetails/WorkloadDetailsPage';
import AppListPage from './pages/AppList/AppListPage';
import AppDetailsPage from './pages/AppDetails/AppDetailsPage';
import OverviewPage from './pages/Overview/OverviewPage';
import GraphRouteHandler from './pages/Graph/GraphRouteHandler';
import { MenuItem, Path } from './types/Routes';

import ServiceDetailsPageContainer from './containers/ServiceDetailsPageContainer';

/**
 * Return array of objects that describe vertical menu
 * @return {array}
 */
const navItems: MenuItem[] = [
  {
    iconClass: 'fa fa-tachometer',
    title: 'Overview',
    to: '/overview',
    pathsActive: [/^\/overview\/(.*)/]
  },
  {
    iconClass: 'fa pficon-topology',
    title: 'Graph',
    to: '/graph/namespaces?keepState=true',
    pathsActive: [/^\/graph\/(.*)/]
  },
  {
    iconClass: 'fa pficon-applications',
    title: 'Applications',
    to: '/applications',
    pathsActive: [/^\/namespaces\/(.*)\/applications\/(.*)/]
  },
  {
    iconClass: 'fa pficon-bundle',
    title: 'Workloads',
    to: '/workloads',
    pathsActive: [/^\/namespaces\/(.*)\/workloads\/(.*)/]
  },
  {
    iconClass: 'fa pficon-service',
    title: 'Services',
    to: '/services',
    pathsActive: [/^\/namespaces\/(.*)\/services\/(.*)/]
  },
  {
    iconClass: 'fa pficon-template',
    title: 'Istio Config',
    to: '/istio',
    pathsActive: [/^\/namespaces\/(.*)\/istio\/(.*)/]
  },
  {
    iconClass: 'fa fa-paw',
    title: 'Distributed Tracing',
    to: '/jaeger'
  }
];

const defaultRoute = '/overview';

const pathRoutes: Path[] = [
  {
    path: '/overview',
    component: OverviewPage
  },
  {
    path: '/graph/node/namespaces/:namespace/applications/:app/versions/:version',
    component: GraphRouteHandler
  },
  {
    path: '/graph/node/namespaces/:namespace/applications/:app',
    component: GraphRouteHandler
  },
  {
    path: '/graph/node/namespaces/:namespace/services/:service',
    component: GraphRouteHandler
  },
  {
    path: '/graph/node/namespaces/:namespace/workloads/:workload',
    component: GraphRouteHandler
  },
  {
    path: '/graph/namespaces',
    component: GraphRouteHandler
  },
  {
    path: '/namespaces/:namespace/services/:service',
    component: ServiceDetailsPageContainer
  },
  // NOTE that order on routes is important
  {
    path: '/namespaces/:namespace/istio/:objectType/:objectSubtype/:object',
    component: IstioConfigDetailsPage
  },
  {
    path: '/namespaces/:namespace/istio/:objectType/:object',
    component: IstioConfigDetailsPage
  },
  {
    path: '/services',
    component: ServiceListPage
  },
  {
    path: '/applications',
    component: AppListPage
  },
  {
    path: '/namespaces/:namespace/applications/:app',
    component: AppDetailsPage
  },
  {
    path: '/workloads',
    component: WorkloadListPage
  },
  {
    path: '/namespaces/:namespace/workloads/:workload',
    component: WorkloadDetailsPage
  },
  {
    path: '/istio',
    component: IstioConfigPage
  },
  {
    path: '/jaeger',
    component: ServiceJaegerPage
  }
];

export { defaultRoute, navItems, pathRoutes };
