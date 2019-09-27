export interface IAppConfig{
    env:{
        name: string;
    },
    SocketIoConfig: {
        url: string,
        options: Object
    },
    weblogin:{
        url:string,
        service:string
    }
}