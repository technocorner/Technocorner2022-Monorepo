export default {
  limit: {
    image: [1024, 2097152],
    pdf: [1024, 10485760],
    linktree: [1024, Infinity],
  },
  type: {
    image: ["image/jpg", "image/jpeg"],
    pdf: ["application/pdf"],
    linktree: ["image/*"],
  },
};
