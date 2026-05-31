import express from "express";
import { success } from "@/lib/responseFormat";
import u from "@/utils";
import { localizeModelList, localizeVendor, resolveRequestLocale } from "@/utils/resolveVendorLocale";
const router = express.Router();

export default router.post("/", async (req, res) => {
  const locale = resolveRequestLocale(req);
  const data = await u.db("o_vendorConfig").select("*");

  const list = (
    await Promise.all(
      data.map(async (item) => {
        const vendor = u.vendor.getVendor(item.id!);
        if (!vendor) {
          await u.db("o_vendorConfig").where("id", item.id).delete();
          return null
        };
        const localizedVendor = localizeVendor(vendor, locale);
        return {
          ...item,
          inputValues: JSON.parse(item.inputValues ?? "{}"),
          models: await localizeModelList(item.id!, locale, u.vendor.getVendor, u.vendor.getModelList),
          code: u.vendor.getCode(item.id!),
          description: localizedVendor.description ?? "",
          inputs: localizedVendor.inputs,
          author: vendor.author,
          name: localizedVendor.name,
          version: vendor.version ?? "1.0",
        };
      }),
    )
  ).filter((i) => Boolean(i));

  list.sort((a, b) => (a!.id === "toonflow" ? -1 : b!.id === "toonflow" ? 1 : 0));
  res.status(200).send(success(list));
});
