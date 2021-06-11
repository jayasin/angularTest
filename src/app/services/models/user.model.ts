export interface userCredentials {
  email: string;
  password: string;
}

export interface ILoginSuccessReponse {
  token: string;
}

export interface ILoginFailureReponse {
  error: {
    error: string;
  };
}

export interface IRegisterSucessResponse {
  id: string;
  token: string;
}

export interface IRegisterFailureResponse {
    error: {
      error: string;
    };
  }


  export interface IGetUserListSuccessRespose  {
    page: number,
    per_page: number,
    total: number,
    total_pages: number,
    data: IUsers[],
    support: {
      url: string,
      text: string
    }
  }

  export interface IUsers {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
  }

  export interface IEditUserResponse {
    edited: boolean, 
    data: IEditUserData
  }

  export interface IEditUserData {
    name: string,
    job: string
  }

  export interface IEditUserSuccessResponse {
    name: string,
    job: string,
    updatedAt: Date
  }