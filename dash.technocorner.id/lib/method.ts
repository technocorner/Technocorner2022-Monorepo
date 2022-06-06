import server from "../data/server";

export async function deleteData(path: string, data: object, headers?: object) {
  let error;
  for (let api of server) {
    try {
      const res = await (
        await fetch(`${api}${path}`, {
          method: "DELETE",
          body: JSON.stringify(data),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        })
      ).json();
      return res;
    } catch (e) {
      error = e;
    }
  }
  throw error;
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

  let error;
  for (let api of server) {
    try {
      const res = await (
        await fetch(`${api}${path}${params}`, {
          method: "GET",
          credentials: "include",
          headers,
        })
      ).json();
      return res;
    } catch (e) {
      error = e;
    }
  }
  throw error;
}

export async function postData(path: string, data: object, headers?: object) {
  let error;
  for (let api of server) {
    try {
      const res = await (
        await fetch(`${api}${path}`, {
          method: "POST",
          body: JSON.stringify(data),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        })
      ).json();
      return res;
    } catch (e) {
      error = e;
    }
  }
  throw error;
}

export async function putData(path: string, data: object, headers?: object) {
  let error;
  for (let api of server) {
    try {
      const res = await (
        await fetch(`${api}${path}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        })
      ).json();
      return res;
    } catch (e) {
      error = e;
    }
  }
  throw error;
}

export async function postFormData(path: string, formData: FormData) {
  let error;
  for (let api of server) {
    try {
      const res = await (
        await fetch(`${api}${path}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
      ).json();
      return res;
    } catch (e) {
      error = e;
    }
  }
  throw error;
}

export async function putFormData(path: string, formData: FormData) {
  let error;
  for (let api of server) {
    try {
      const res = await (
        await fetch(`${api}${path}`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        })
      ).json();
      return res;
    } catch (e) {
      error = e;
    }
  }
  throw error;
}
