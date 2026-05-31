import express from "express";
import u from "@/utils";
import { success } from "@/lib/responseFormat";
import { localizeModelList, localizeVendor, resolveRequestLocale } from "@/utils/resolveVendorLocale";
const router = express.Router();

export default router.post("/", async (req, res) => {
  const locale = resolveRequestLocale(req);
  const dataList = await u.db("o_vendorConfig").select("id").where("enable", 1);
  if (!dataList || dataList.length === 0) {
    return res.status(404).send({ error: "模型未找到" });
  }
  const data = await Promise.all(
    dataList.map(async (item) => {
      const vendor = u.vendor.getVendor(item.id!);
      const localizedVendor = localizeVendor(vendor, locale);
      const promptList = await u.db("o_modelPrompt").andWhere("vendorId", vendor.id).select("*");
      const promptMap = new Map(promptList.map((p) => [p.model, { fileName: p.fileName, path: p.path }]));
      const models = await localizeModelList(item.id!, locale, u.vendor.getVendor, u.vendor.getModelList);
      const filteredModels = models
        .filter((m: any) => m.type === "video")
        .map((m: any) => ({
          name: m.name,
          type: m.type as "image" | "video",
          model: m.modelName,
          ...(promptMap.get(m.modelName) ? { ...promptMap.get(m.modelName) } : {}),
        }));
      return {
        id: item.id,
        name: localizedVendor.name,
        promptList: filteredModels,
      };
    }),
  );
  res.status(200).send(success(data));
});
