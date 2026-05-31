import { serializeError } from "serialize-error";

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Unhandled Promise rejection]");
  if (reason instanceof Error) {
    console.error("name:", reason.name);
    console.error("message:", reason.message);
    console.error("stack:", reason.stack);
    console.error("serialized:", JSON.stringify(serializeError(reason), null, 2));
  } else {
    console.error("reason:", reason);
    console.error("type:", typeof reason);
    try {
      console.error("JSON:", JSON.stringify(reason, null, 2));
    } catch {
      console.error("(not serializable)");
    }
  }
  console.error("promise:", promise);
});

process.on("uncaughtException", (error) => {
  console.error("[Uncaught exception]");
  console.error("name:", error.name);
  console.error("message:", error.message);
  console.error("stack:", error.stack);
  console.error("serialized:", JSON.stringify(serializeError(error), null, 2));
});
