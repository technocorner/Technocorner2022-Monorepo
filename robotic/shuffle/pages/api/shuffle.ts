import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  error?: NodeJS.ErrnoException | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = JSON.parse(req.body);
  const { branch, data } = body;

  fs.writeFile(
    `${__dirname}/../../../../savedShuffle/shuffle-${branch}-${Date.now()}`,
    JSON.stringify(data),
    (err) => {
      if (err) {
        console.log(err);
        res.status(200).json({ success: false, error: err });
      } else {
        res.status(200).json({ success: true });
      }
    }
  );
}
