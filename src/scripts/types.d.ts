declare type DataRetriever = {
  [serviceName: string]: (...arg: any[]) => any;
};

declare type Renderer = {
  [init: string]: () => void;
};
