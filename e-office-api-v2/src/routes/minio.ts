import { Elysia } from "elysia";
import { authGuardPlugin } from "@backend/middlewares/auth";
import { MinioService } from "@backend/services/minio.service";

export default new Elysia()
  .use(authGuardPlugin)
  .post("/upload-file", async ({ request, status }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    const jenisFile = formData.get("jenis_file");

    if (!(file instanceof File)) {
      return status(400, { error: "FILE_REQUIRED" });
    }

    const category =
      jenisFile === "lampiran"
        ? "lampiran/"
        : jenisFile === "signature"
        ? "signature/"
        : "";

    const result = await MinioService.uploadFile(file, category, file.type);

    return {
      url: result.url,
      objectName: result.nameReplace,
    };
  })
  .get("/file/*", async ({ params, set }) => {
    try {
      const objectName = params["*"];
      const { stat, stream } = await MinioService.getFileStream(objectName);
      
      set.headers["Content-Type"] = stat.metaData["content-type"] || "application/octet-stream";
      set.headers["Content-Length"] = stat.size.toString();
      
      return stream;
    } catch (e) {
      set.status = 404;
      return { error: "File not found" };
    }
  });
