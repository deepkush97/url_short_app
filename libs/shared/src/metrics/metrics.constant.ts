export enum MetricName {
  REDIRECT_TOTAL = 'url_redirect_total',
}

export enum MetricLabel {
  STATUS = 'status',
  SOURCE = 'source',
}

export enum MetricStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum MetricDataSource {
  CACHE = 'cache',
  DATABASE = 'database',
}
