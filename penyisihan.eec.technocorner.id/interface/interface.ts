export type SessionType = {
  teamId: string;
  teamName: string;
  userId: string;
  userName: string;
};

export enum SubjectEnum {
  Math,
  Phys,
  Comp,
}

export const SubjectString = ["Matematika", "Fisika", "Komputer"];

export enum NumbersEnum {
  First = 1,
  Last = 40,
}

export type AnsWithoutValType = {
  by: string;
  isDoubt: boolean;
  value?: string;
};

export type CompleteAnsType = {
  by: string;
  isDoubt: boolean;
  value: string;
};

export type AnsweredType = {
  [SubjectEnum.Math]: {
    [key: number]: CompleteAnsType;
  };
  [SubjectEnum.Phys]: {
    [key: number]: CompleteAnsType;
  };
  [SubjectEnum.Comp]: {
    [key: number]: CompleteAnsType;
  };
};

export type TrackAnsweredType = {
  time: number;
  data: AnsweredType;
};

export type PositionType = {
  subject: number;
  number: number;
};

export enum PositionEnum {
  position = "position",
  userName = "userName",
}

export type PositionsType = {
  [key: string]: PositionType;
};

export type TimerType = string;

export enum TimerEnum {
  default = "--:--:--",
}

export enum ImgLoadStateEnum {
  Loading,
  Loaded,
  Error,
}

export enum WebSocketSyncDataRequestEnum {
  position,
  answer,
}

export type WebSocketSyncDataResponseType = {
  type: WebSocketSyncDataResponseEnum;
  payload: any;
};

export enum WebSocketSyncDataResponseEnum {
  error,
  timer,
  position,
  data,
  ping,
}

export enum WsConnStatusEnum {
  nonactive,
  active,
}
