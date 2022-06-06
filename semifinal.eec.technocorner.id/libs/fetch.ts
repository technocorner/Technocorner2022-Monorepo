import apiServer from "../data/apiServer";

export async function deleteData(path: string, data: object, headers?: object) {
  let res = new Response();
  let json: any;
  let err: any;
  try {
    res = await fetch(`${apiServer}${path}`, {
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
    console.log("Error: ", error);
  }

  if (err) {
    return {
      status: res.status,
      json: null,
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

  let res = new Response();
  let json: any;
  let err: any;
  try {
    res = await fetch(`${apiServer}${path}${params}`, {
      method: "GET",
      credentials: "include",
      headers,
    });
    json = await res.json();
  } catch (error) {
    console.log("Error: ", error);
  }

  if (err) {
    return {
      status: res.status,
      json: null,
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function postData(path: string, data: object, headers?: object) {
  let res = new Response();
  let json: any;
  let err: any;
  try {
    res = await fetch(`${apiServer}${path}`, {
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
    console.log("Error: ", error);
  }

  if (err) {
    return {
      status: res.status,
      json: null,
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function putData(path: string, data: object, headers?: object) {
  let res = new Response();
  let json: any;
  let err: any;
  try {
    res = await fetch(`${apiServer}${path}`, {
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
    console.log("Error: ", error);
  }

  if (err) {
    return {
      status: res.status,
      json: null,
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function postFormData(path: string, formData: FormData) {
  let res = new Response();
  let json: any;
  let err: any;
  try {
    res = await fetch(`${apiServer}${path}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    json = await res.json();
  } catch (error) {
    console.log("Error: ", error);
  }

  if (err) {
    return {
      status: res.status,
      json: null,
    };
  }

  return {
    status: res.status,
    json,
  };
}

export async function putFormData(path: string, formData: FormData) {
  let res = new Response();
  let json: any;
  let err: any;
  try {
    res = await fetch(`${apiServer}${path}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
    json = await res.json();
  } catch (error) {
    console.log("Error: ", error);
  }

  if (err) {
    return {
      status: res.status,
      json: null,
    };
  }

  return {
    status: res.status,
    json,
  };
}
