import { Elysia } from "elysia";
import { authGuardPlugin } from "@backend/middlewares/auth.ts";
import { MinioService } from "@backend/services/minio.service.ts";

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
  });
