import Namespace from './Namespace';
import { DestinationRule, DestinationRules, VirtualService, VirtualServices } from './ServiceInfo';
import { ObjectValidation } from './IstioObjects';
import { ResourcePermissions } from './Permissions';

export interface IstioConfigItem {
  namespace: string;
  type: string;
  name: string;
  gateway?: Gateway;
  virtualService?: VirtualService;
  destinationRule?: DestinationRule;
  serviceEntry?: ServiceEntry;
  rule?: IstioRule;
  adapter?: IstioAdapter;
  template?: IstioTemplate;
  quotaSpec?: QuotaSpec;
  quotaSpecBinding?: QuotaSpecBinding;
  validation?: ObjectValidation;
}

export interface IstioConfigList {
  namespace: Namespace;
  gateways: Gateway[];
  virtualServices: VirtualServices;
  destinationRules: DestinationRules;
  serviceEntries: ServiceEntry[];
  rules: IstioRule[];
  adapters: IstioAdapter[];
  templates: IstioTemplate[];
  quotaSpecs: QuotaSpec[];
  quotaSpecBindings: QuotaSpecBinding[];
  permissions: { [key: string]: ResourcePermissions };
}

export interface Gateway {
  name: string;
  createdAt: string;
  resourceVersion: string;
  servers?: Server[];
  selector?: { [key: string]: string };
}
export interface Server {
  port: Port;
  hosts: string[];
  tls: TLSOptions;
}

export interface Port {
  number: number;
  protocol: string;
  name: string;
}

export interface TLSOptions {
  httpsRedirect: boolean;
  mode: string;
  serverCertificate: string;
  privateKey: string;
  caCertificates: string;
  subjectAltNames: string[];
}

export interface ServiceEntry {
  name: string;
  createdAt: string;
  resourceVersion: string;
  hosts?: string[];
  addresses?: string[];
  ports?: Port[];
  location?: string;
  resolution?: string;
  endpoints?: Endpoint[];
}

export interface Endpoint {
  address: string;
  ports: { [key: string]: number };
  labels: { [key: string]: string };
}

export interface IstioRule {
  name: string;
  createdAt: string;
  resourceVersion: string;
  match: string;
  actions: IstioRuleActionItem[];
}

export interface IstioRuleActionItem {
  handler: string;
  instances: string[];
}

export interface IstioAdapter {
  name: string;
  createdAt: string;
  resourceVersion: string;
  adapter: string;
  adapters: string;
  spec: any;
}

export interface IstioTemplate {
  name: string;
  createdAt: string;
  resourceVersion: string;
  template: string;
  templates: string;
  spec: any;
}

export interface QuotaSpec {
  name: string;
  createdAt: string;
  resourceVersion: string;
  rules?: MatchQuota[];
}

export interface MatchQuota {
  match?: Match;
  quotas?: Quota;
}

export interface Match {
  clause: { [attributeName: string]: { [matchType: string]: string } };
}

export interface Quota {
  quota: string;
  charge: number;
}

export interface QuotaSpecBinding {
  name: string;
  createdAt: string;
  resourceVersion: string;
  quotaSpecs?: QuotaSpecRef[];
  services?: IstioService[];
}

export interface QuotaSpecRef {
  name: string;
  namespace?: string;
}

export interface IstioService {
  name: string;
  namespace?: string;
  domain?: string;
  service?: string;
  labels?: { [key: string]: string };
}

export const dicIstioType = {
  Gateway: 'gateways',
  VirtualService: 'virtualservices',
  DestinationRule: 'destinationrules',
  ServiceEntry: 'serviceentries',
  Rule: 'rules',
  Adapter: 'adapters',
  Template: 'templates',
  QuotaSpec: 'quotaspecs',
  QuotaSpecBinding: 'quotaspecbindings',
  gateways: 'Gateway',
  virtualservices: 'VirtualService',
  destinationrules: 'DestinationRule',
  serviceentries: 'ServiceEntry',
  rules: 'Rule',
  adapters: 'Adapter',
  templates: 'Template',
  quotaspecs: 'QuotaSpec',
  quotaspecbindings: 'QuotaSpecBinding',
  instance: 'Instance',
  handler: 'Handler'
};

const includeName = (name: string, names: string[]) => {
  for (let i = 0; i < names.length; i++) {
    if (name.includes(names[i])) {
      return true;
    }
  }
  return false;
};

export const filterByName = (unfiltered: IstioConfigList, names: string[]): IstioConfigList => {
  if (names && names.length === 0) {
    return unfiltered;
  }
  return {
    namespace: unfiltered.namespace,
    gateways: unfiltered.gateways.filter(gw => includeName(gw.name, names)),
    virtualServices: {
      permissions: unfiltered.virtualServices.permissions,
      items: unfiltered.virtualServices.items.filter(vs => includeName(vs.name, names))
    },
    destinationRules: {
      permissions: unfiltered.destinationRules.permissions,
      items: unfiltered.destinationRules.items.filter(dr => includeName(dr.name, names))
    },
    serviceEntries: unfiltered.serviceEntries.filter(se => includeName(se.name, names)),
    rules: unfiltered.rules.filter(r => includeName(r.name, names)),
    adapters: unfiltered.adapters.filter(r => includeName(r.name, names)),
    templates: unfiltered.templates.filter(r => includeName(r.name, names)),
    quotaSpecs: unfiltered.quotaSpecs.filter(qs => includeName(qs.name, names)),
    quotaSpecBindings: unfiltered.quotaSpecBindings.filter(qsb => includeName(qsb.name, names)),
    permissions: unfiltered.permissions
  };
};

export const filterByConfigValidation = (unfiltered: IstioConfigItem[], configFilters: string[]): IstioConfigItem[] => {
  if (configFilters && configFilters.length === 0) {
    return unfiltered;
  }
  let filtered: IstioConfigItem[] = [];

  let filterByValid = configFilters.indexOf('Valid') > -1;
  let filterByNotValid = configFilters.indexOf('Not Valid') > -1;
  let filterByNotValidated = configFilters.indexOf('Not Validated') > -1;
  let filterByWarning = configFilters.indexOf('Warning') > -1;
  if (filterByValid && filterByNotValid && filterByNotValidated && filterByWarning) {
    return unfiltered;
  }

  unfiltered.forEach(item => {
    if (filterByValid && item.validation && item.validation.valid) {
      filtered.push(item);
    }
    if (filterByNotValid && item.validation && !item.validation.valid) {
      filtered.push(item);
    }
    if (filterByNotValidated && !item.validation) {
      filtered.push(item);
    }
    if (filterByWarning && item.validation && item.validation.checks.filter(i => i.severity === 'warning').length > 0) {
      filtered.push(item);
    }
  });
  return filtered;
};

export const toIstioItems = (istioConfigList: IstioConfigList): IstioConfigItem[] => {
  let istioItems: IstioConfigItem[] = [];
  istioConfigList.gateways.forEach(gw =>
    istioItems.push({ namespace: istioConfigList.namespace.name, type: 'gateway', name: gw.name, gateway: gw })
  );
  istioConfigList.virtualServices.items.forEach(vs =>
    istioItems.push({
      namespace: istioConfigList.namespace.name,
      type: 'virtualservice',
      name: vs.name,
      virtualService: vs
    })
  );
  istioConfigList.destinationRules.items.forEach(dr =>
    istioItems.push({
      namespace: istioConfigList.namespace.name,
      type: 'destinationrule',
      name: dr.name,
      destinationRule: dr
    })
  );
  istioConfigList.serviceEntries.forEach(se =>
    istioItems.push({
      namespace: istioConfigList.namespace.name,
      type: 'serviceentry',
      name: se.name,
      serviceEntry: se
    })
  );
  istioConfigList.rules.forEach(r =>
    istioItems.push({ namespace: istioConfigList.namespace.name, type: 'rule', name: r.name, rule: r })
  );
  istioConfigList.adapters.forEach(a =>
    istioItems.push({ namespace: istioConfigList.namespace.name, type: 'adapter', name: a.name, adapter: a })
  );
  istioConfigList.templates.forEach(t =>
    istioItems.push({ namespace: istioConfigList.namespace.name, type: 'template', name: t.name, template: t })
  );
  istioConfigList.quotaSpecs.forEach(qs =>
    istioItems.push({ namespace: istioConfigList.namespace.name, type: 'quotaspec', name: qs.name, quotaSpec: qs })
  );
  istioConfigList.quotaSpecBindings.forEach(qsb =>
    istioItems.push({
      namespace: istioConfigList.namespace.name,
      type: 'quotaspecbinding',
      name: qsb.name,
      quotaSpecBinding: qsb
    })
  );
  return istioItems;
};
