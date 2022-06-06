import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiServer from "../data/apiServer";
import { ModalType } from "../interfaces";
import { deleteData, getData } from "../libs/fetch";
import statusCode from "../libs/statusCode";
import {
  toastError,
  toastLoading,
  toastLoadingProgress,
  toastSuccess,
} from "../libs/toast";

type fileList = {
  name: string;
  link: string;
};

export default function Uploader({
  modal,
  setModal,
}: {
  modal: ModalType;
  setModal: React.Dispatch<React.SetStateAction<ModalType>>;
}) {
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<fileList[]>([]);
  const [willUploadFiles, setWillUploadFiles] = useState<File[]>([]);
  const [willRemoveFiles, setWillRemoveFiles] = useState<string[]>([]);
  const [showFiles, setShowFiles] = useState<fileList[]>([]);
  const [onDragOver, setOnDragOver] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await getData(`/files?lab=${String(modal)}`);

      if (res.status === statusCode.OK && res.json) {
        const files: fileList[] = [];
        (res.json as string[]).forEach((fName) => {
          files.push({
            name: fName,
            link: `${apiServer[0]}/file?lab=${String(modal)}&name=${fName}`,
          });
        });
        setUploadedFiles(files);
        setShowFiles(files);
      }
      setLoading(false);
    })();
  }, []);

  // useEffect(() => {
  //   console.log("uploadedFiles", uploadedFiles);
  // }, [uploadedFiles]);

  // useEffect(() => {
  //   console.log("willUploadFiles", willUploadFiles);
  // }, [willUploadFiles]);

  // useEffect(() => {
  //   console.log("willRemoveFiles", willRemoveFiles);
  // }, [willRemoveFiles]);

  // useEffect(() => {
  //   console.log("showFiles", showFiles);
  // }, [showFiles]);

  const disableModal = () => {
    setModal(ModalType.Disable);
  };

  const dropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files) {
      appendWillUploadFiles(Array.from(event.dataTransfer.files));
    }

    setOnDragOver(0);
  };

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const dragEnterHandler = () => {
    setOnDragOver((prev) => ++prev);
  };

  const dragEndHandler = () => {
    setOnDragOver((prev) => {
      if (prev > 0) {
        return --prev;
      }
      return prev;
    });
  };

  const changeInputFileHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      appendWillUploadFiles(Array.from(event.target.files));
    }
    event.target.value = "";
  };

  const appendWillUploadFiles = (files: File[]) => {
    const newShowFiles: fileList[] = [...showFiles];
    const addShowFiles: File[] = [];
    const newWillUploadFiles: File[] = [...willUploadFiles];
    const addWillRemoveFiles: string[] = [];
    let willUploadFilesSize = willUploadFiles.reduce(
      (prevSize, currFile) => prevSize + currFile.size,
      0
    );

    let isContainNotSupported = false;

    for (const file of files) {
      if (file.type.match(/^((?!\/png|\/jpg|\/jpeg|\/pdf|\/plain).)*$/i)) {
        isContainNotSupported = true;
        break;
      }

      const nsfindex = newShowFiles.findIndex(
        (nsfile) => nsfile.name === file.name
      );
      if (nsfindex >= 0) {
        newShowFiles.splice(nsfindex, 1);
      }
      addShowFiles.push(file);

      willUploadFilesSize += file.size;
      if (willUploadFilesSize >= 2e7) {
        break;
      }

      const wufileindex = newWillUploadFiles.findIndex(
        (nwufile) => nwufile.name === file.name
      );
      if (wufileindex >= 0) {
        newWillUploadFiles.splice(wufileindex, 1);
      }
      newWillUploadFiles.push(file);

      if (willRemoveFiles.indexOf(file.name) === -1) {
        addWillRemoveFiles.push(file.name);
      }
    }

    if (isContainNotSupported) {
      toastError("Terdapat berkas dengan format yang tidak didukung");
      return;
    }

    // Max per upload is 20 Mb
    if (willUploadFilesSize >= 2e7) {
      toastError(
        `Maksimal per unggahan adalah 20 Mb${
          willUploadFiles.length > 0
            ? ". Kamu dapat melakukan unggah berkas lain setelah melakukan unggah berkas saat ini."
            : ""
        }`
      );
      return;
    }

    const addShowFileList: fileList[] = [];
    addShowFiles.forEach((file) => {
      addShowFileList.push({
        name: file.name,
        link: URL.createObjectURL(file),
      });
    });
    setShowFiles([...newShowFiles, ...addShowFileList]);

    setWillUploadFiles(newWillUploadFiles);

    if (addWillRemoveFiles.length > 0) {
      setWillRemoveFiles((prev) => [...prev, ...addWillRemoveFiles]);
    }
  };

  const removeFile = async (fileName: string) => {
    setShowFiles((files) => files.filter((file) => file.name !== fileName));

    const newWillRemoveFiles: string[] = [];

    if (
      uploadedFiles.findIndex((ufile) => ufile.name === fileName) >= 0 &&
      willRemoveFiles.indexOf(fileName) === -1
    ) {
      newWillRemoveFiles.push(fileName);
    }

    if (newWillRemoveFiles.length > 0) {
      setWillRemoveFiles((prev) => [...prev, ...newWillRemoveFiles]);
    }

    const removeWillUploadFiles: string[] = [];

    if (willUploadFiles.findIndex((wufile) => wufile.name === fileName) >= 0) {
      removeWillUploadFiles.push(fileName);
    }

    if (removeWillUploadFiles.length > 0) {
      let newWillUploadFiles = [...willUploadFiles];
      removeWillUploadFiles.forEach((rwufname) => {
        const nwufileindex = newWillUploadFiles.findIndex(
          (nwufile) => nwufile.name === rwufname
        );
        if (nwufileindex >= 0) {
          newWillUploadFiles.splice(nwufileindex, 1);
        }
      });
      setWillUploadFiles(newWillUploadFiles);
    }
  };

  const kumpulJawaban = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (willUploadFiles.length === 0 && willRemoveFiles.length === 0) {
      toastSuccess("Berkas berhasil disimpan");
      setModal(ModalType.Disable);
      return;
    }

    let loadingToast = toastLoadingProgress(0);

    try {
      await Promise.all(
        willRemoveFiles.map(async (fileName) => {
          const res = await deleteData("/file", {
            lab: String(modal),
            name: fileName,
          });

          if (res.status !== statusCode.OK || !res.json || !res.json.success) {
            return Promise.reject(
              res.json && res.json.error ? res.json.error : "Terjadi galat"
            );
          }
        })
      );
    } catch (error) {
      toastError(String(error));
      return;
    }

    const formData = new FormData();

    formData.append("lab", String(modal));

    willUploadFiles.forEach((file) => {
      formData.append("files", file);
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", `${apiServer[0]}/file`);

    xhr.upload.addEventListener("progress", (data) => {
      if (data.lengthComputable) {
        const percentage = Math.floor((data.loaded / data.total) * 100);
        loadingToast = toastLoadingProgress(percentage);
        if (percentage === 100) {
          toast.dismiss(loadingToast);
          loadingToast = toastLoading();
        }
      }
    });

    xhr.send(formData);

    xhr.addEventListener("error", () => {
      toastError("Gagal mengunggah file");
    });

    xhr.addEventListener("load", () => {
      const res = JSON.parse(xhr.responseText);

      toast.dismiss(loadingToast);
      if (res.success) {
        toastSuccess("Berkas berhasil disimpan");
        setModal(ModalType.Disable);
      } else {
        toastError(res && res.error ? res.error : "Terjadi galat");
      }
    });
  };

  const FileTemplate = ({ file }: { file: fileList }) => {
    return (
      <li className="block p-1 w-full h-16">
        <article
          tabIndex={0}
          className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 shadow-sm"
        >
          <section className="flex gap-x-2 items-center rounded-md text-xs break-words w-full h-full top-0 py-2 px-3">
            <span>
              <svg
                className="fill-current w-6 h-6 ml-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
              </svg>
            </span>
            <h1 className="flex-1">
              <a
                href={file.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                {file.name}
              </a>
            </h1>
            <button
              type="button"
              onClick={() => removeFile(file.name)}
              className="w-8 h-8 focus:outline-none hover:bg-gray-300 rounded-md text-gray-800"
            >
              <span className="hover:bg-red-500">
                <svg
                  className="pointer-events-none w-4 h-4 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    className="pointer-events-none"
                    d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                  />
                </svg>
              </span>
            </button>
          </section>
        </article>
      </li>
    );
  };

  return (
    <div
      onClick={disableModal}
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragEndHandler}
      className="fixed z-10 w-screen h-full p-20 md:inset-0 md:h-full backdrop-blur-sm bg-black-light/20"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full m-auto max-w-2xl h-full p-4 bg-white rounded-lg shadow bg-white-default"
      >
        <form onSubmit={kumpulJawaban} className="h-full flex flex-col">
          <div className="flex justify-between items-center p-5 rounded-t border-b border-gray-600">
            <h3 className="text-base font-semibold md:text-lg dark:text-white">
              Format file: .jpg, .png, .pdf, .txt
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={disableModal}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <section className="flex-1 overflow-y-auto p-8 w-full flex flex-col">
            <header
              className={`border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center ${
                onDragOver ? "bg-gray-200" : ""
              }`}
            >
              <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                Tarik dan taruh jawaban Anda di mana pun atau
              </p>
              <input
                id="hidden-input"
                name="answers"
                type="file"
                accept=".png, .jpg, .jpeg, .pdf, .txt"
                onChange={changeInputFileHandler}
                multiple
                className="hidden"
              />
              <button
                onClick={() => document.getElementById("hidden-input")!.click()}
                id="button"
                type="button"
                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:outline-none focus:ring-green-dark/50"
              >
                Unggah jawaban
              </button>
            </header>
            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
              Yang akan dikumpul
            </h1>

            <div id="gallery" className="flex flex-1 flex-wrap -m-1">
              <div className="h-full w-full flex flex-col items-center">
                {showFiles.length === 0 && (
                  <>
                    <img
                      className="mx-auto w-32"
                      src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                      alt="no data"
                    />
                    <span className="text-gray-500 text-center">
                      {loading
                        ? "Memuat jawaban terunggah..."
                        : "Tidak ada jawaban yang diunggah"}
                    </span>
                  </>
                )}
                <ul className="w-full">
                  {showFiles.map((file, index) => (
                    <FileTemplate key={index} file={file} />
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <footer className="block mt-auto flex px-8 py-5 w-full items-center justify-end gap-4">
            <button
              type="submit"
              className="duration-200 hover:bg-green-default/75  focus:ring-2 focus:outline-none focus:ring-green-light w-fit px-3 py-1 justify-center text-center bg-cstmgreen text-white-default text-lg rounded-lg"
            >
              Kumpul jawaban
            </button>
            <button
              onClick={disableModal}
              type="button"
              className="duration-200 hover:text-black-default text-lg text-black-default/75"
            >
              Batalkan
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
