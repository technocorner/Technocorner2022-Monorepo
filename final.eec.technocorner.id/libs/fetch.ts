import server from "../data/apiServer";
import statusCode from "./statusCode";

export async function deleteData(path: string, data: object, headers?: object) {
  let res: Response;
  let json: any;
  let err: any;
  try {
    res = await fetch(`${server}${path}`, {
      method: "DELETE",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    json = await res.json();
  } catch (error) {
    err = error;
  }

  if (err) {
    return {
      status: statusCode.InternalServerError,
      json: { error: err },
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function getData(path: string, data?: object, headers?: Headers) {
  let params = "";
  if (data) {
    params += "?";
    const dataLength = Object.keys(data).length;
    let counter = 0;
    for (const [key, value] of Object.entries(data)) {
      params += `${key}=${value}`;
      ++counter < dataLength && (params += "&");
    }
  }

  let res: Response;
  let json: any;
  let err: any;
  try {
    res = await fetch(`${server}${path}${params}`, {
      method: "GET",
      credentials: "include",
      headers,
    });
    json = await res.json();
  } catch (error) {
    err = error;
  }

  if (err) {
    return {
      status: statusCode.InternalServerError,
      json: { error: err },
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function postData(path: string, data: object, headers?: object) {
  let res: Response;
  let json: any;
  let err: any;
  try {
    res = await fetch(`${server}${path}`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    json = await res.json();
  } catch (error) {
    err = error;
  }

  if (err) {
    return {
      status: statusCode.InternalServerError,
      json: { error: err },
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function putData(path: string, data: object, headers?: object) {
  let res: Response;
  let json: any;
  let err: any;
  try {
    res = await fetch(`${server}${path}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    json = await res.json();
  } catch (error) {
    err = error;
  }

  if (err) {
    return {
      status: statusCode.InternalServerError,
      json: { error: err },
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function postFormData(path: string, formData: FormData) {
  let res: Response;
  let json: any;
  let err: any;
  try {
    res = await fetch(`${server}${path}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    json = await res.json();
  } catch (error) {
    err = error;
  }

  if (err) {
    return {
      status: statusCode.InternalServerError,
      json: { error: err },
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function putFormData(path: string, formData: FormData) {
  let res: Response;
  let json: any;
  let err: any;
  try {
    res = await fetch(`${server}${path}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
    json = await res.json();
  } catch (error) {
    err = error;
  }

  if (err) {
    return {
      status: statusCode.InternalServerError,
      json: { error: err },
    };
  }

  return {
    status: res.status,
    json,
  };
}
