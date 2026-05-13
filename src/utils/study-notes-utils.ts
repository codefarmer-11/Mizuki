import fs from "node:fs";
import path from "node:path";

const STUDY_NOTES_POSTS_DIR = path.join(
	process.cwd(),
	"src/content/posts/studyNotes",
);

/**
 * 列出 `src/content/posts/studyNotes/` 下的一级子文件夹名（即分类 slug）
 */
export function getStudyNotesCategorySlugs(): string[] {
	if (!fs.existsSync(STUDY_NOTES_POSTS_DIR)) {
		return [];
	}
	return fs
		.readdirSync(STUDY_NOTES_POSTS_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.filter((d) => !d.name.startsWith("."))
		.map((d) => d.name)
		.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}
