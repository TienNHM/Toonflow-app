import { isViLocale } from "@/utils/runtimeLocale";

export function skillStrings(locale: string) {
  if (isViLocale(locale)) {
    return {
      missingFrontmatter: "File skill thiếu frontmatter hợp lệ (--- với name và description).",
      missingNameOrDesc: "File skill thiếu trường name hoặc description trong frontmatter.",
      mainSkillMissing: (path: string) => `Không tìm thấy file skill chính: ${path}`,
      invalidSkillPath: (path: string) => `Tên skill không hợp lệ (path traversal): ${path}`,
      skillAlreadyActive: (name: string) => `Skill "${name}" đã kích hoạt, không cần tải lại`,
      skillNotFound: (name: string) => `Không tìm thấy skill "${name}"`,
      emptySkillBody: "File skill không có nội dung.",
      emptyResource: "File tài nguyên trống.",
      filePathRequired: "filePath không được để trống",
      pathDenied: "Access denied: path is outside skill directory",
      fileNotFound: (filePath: string) => `File not found: ${filePath}`,
      activateSkillDesc: (names: string) =>
        `Kích hoạt skill, tải hướng dẫn đầy đủ. Skill khả dụng: ${names}`,
      readSkillFileDesc:
        "Đọc file tài nguyên trong thư mục skill đã kích hoạt (đường dẫn từ skill_resources).",
      skillPromptIntro: `## Skills
Các skill sau cung cấp hướng dẫn cho tác vụ chuyên biệt.
Khi tác vụ khớp mô tả skill, gọi activate_skill với tên skill để tải hướng dẫn đầy đủ.
Sau khi tải, làm theo skill; dùng read_skill_file khi cần đọc tài nguyên.

`,
      useReadSkillFile: "Dùng read_skill_file để đọc file tài nguyên.\n",
    };
  }

  return {
    missingFrontmatter: "技能文件缺少有效的 frontmatter，确保以 --- 包裹并包含 name 和 description 字段。",
    missingNameOrDesc: "技能文件缺少必要字段: name 或 description，确保 frontmatter 包含这两个字段。",
    mainSkillMissing: (path: string) => `主技能文件不存在: ${path}`,
    invalidSkillPath: (path: string) => `技能名称无效：检测到路径穿越。${path}`,
    skillAlreadyActive: (name: string) => `技能 "${name}" 已激活，无需重复加载`,
    skillNotFound: (name: string) => `未找到技能 "${name}"`,
    emptySkillBody: "该技能文件无正文内容。",
    emptyResource: "该资源文件为空。",
    filePathRequired: "filePath 不能为空",
    pathDenied: "Access denied: path is outside skill directory",
    fileNotFound: (filePath: string) => `File not found: ${filePath}`,
    activateSkillDesc: (names: string) => `激活一个技能，加载其完整指令和捆绑资源列表到上下文。可用技能：${names}`,
    readSkillFileDesc: "读取已激活技能目录下的资源文件。传入 activate_skill 返回的 skill_resources 中的文件路径。",
    skillPromptIntro: `## Skills
以下技能提供了专业任务的专用指令。
当任务与某个技能的描述匹配时，调用 activate_skill 工具并传入技能名称来加载完整指令。
加载后遵循技能指令执行任务，需要时调用 read_skill_file 读取资源文件内容。

`,
    useReadSkillFile: "使用 read_skill_file 工具读取资源文件。\n",
  };
}
