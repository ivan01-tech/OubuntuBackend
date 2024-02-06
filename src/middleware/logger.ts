import { format } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { existsSync } from "node:fs";
import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { v4 as uuid } from "uuid";

export const logEvent = async (message: string, fileName: string) => {
  const date = format(new Date(), "yyyy;MM;dd;hh;mm;ss");
  console.log(date);
  const finalMesg = `${date}\t${uuid()}\t${message}\n`;
  try {
    if (!existsSync(join(process.cwd(), "src", "logs"))) {
      await mkdir(join(process.cwd(), "src", "logs"));
    }

    await appendFile(join(process.cwd(), "src", "logs", fileName), finalMesg);
  } catch (err) {
    console.log(err);
  }
};

export const logger = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  await logEvent(
    `${req.method}\t${req.url}\t${req.headers.origin}`,
    "reqLog.log"
  );
  console.log(req.method + " " + req.url);
  next();
};
