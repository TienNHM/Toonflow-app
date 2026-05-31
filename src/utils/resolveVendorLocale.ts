type VendorInput = {
  key: string;
  label: string;
  type: "text" | "password" | "url";
  required: boolean;
  placeholder?: string;
  disabled?: boolean;
};

type VendorModel = {
  name: string;
  modelName: string;
  associationSkills?: string;
  [key: string]: unknown;
};

type VendorI18nEntry = {
  name?: string;
  description?: string;
  inputs?: Record<string, { label?: string; placeholder?: string }>;
  models?: Record<string, { name?: string; associationSkills?: string }>;
};

export type VendorWithI18n = {
  name: string;
  description?: string;
  inputs: VendorInput[];
  models?: VendorModel[];
  i18n?: Record<string, VendorI18nEntry>;
};

export function resolveRequestLocale(req: { body?: { locale?: string }; headers?: Record<string, string | string[] | undefined> }): string {
  const bodyLocale = typeof req.body?.locale === "string" ? req.body.locale.trim() : "";
  if (bodyLocale) return bodyLocale;

  const headerLocale = req.headers?.["x-locale"] ?? req.headers?.["accept-language"];
  if (typeof headerLocale === "string") {
    const first = headerLocale.split(",")[0]?.trim();
    if (first) return first;
  }

  return "zh-CN";
}

export function localizeVendor<T extends VendorWithI18n>(vendor: T, locale: string): T {
  const localized = JSON.parse(JSON.stringify(vendor)) as T;
  const i18n = vendor.i18n?.[locale];
  if (!i18n) return localized;

  if (i18n.name) localized.name = i18n.name;
  if (i18n.description) localized.description = i18n.description;

  if (i18n.inputs && localized.inputs) {
    localized.inputs = localized.inputs.map((input) => {
      const translated = i18n.inputs?.[input.key];
      if (!translated) return input;
      return {
        ...input,
        ...(translated.label ? { label: translated.label } : {}),
        ...(translated.placeholder ? { placeholder: translated.placeholder } : {}),
      };
    });
  }

  if (i18n.models && localized.models) {
    localized.models = localized.models.map((model) => {
      const translated = i18n.models?.[model.modelName];
      if (!translated) return model;
      return {
        ...model,
        ...(translated.name ? { name: translated.name } : {}),
        ...(translated.associationSkills ? { associationSkills: translated.associationSkills } : {}),
      };
    });
  }

  delete (localized as { i18n?: unknown }).i18n;
  return localized;
}

export async function localizeModelList(
  id: string,
  locale: string,
  getVendor: (id: string) => VendorWithI18n,
  getModelList: (id: string) => Promise<VendorModel[]>,
): Promise<VendorModel[]> {
  const vendor = getVendor(id);
  const models = await getModelList(id);
  const i18n = vendor.i18n?.[locale];
  if (!i18n?.models) return models;

  return models.map((model) => {
    const translated = i18n.models?.[model.modelName];
    if (!translated) return model;
    return {
      ...model,
      ...(translated.name ? { name: translated.name } : {}),
      ...(translated.associationSkills ? { associationSkills: translated.associationSkills } : {}),
    };
  });
}
