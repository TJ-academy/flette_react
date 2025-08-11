// rename-images.js
const fs = require("fs");
const path = require("path");
const { transliterate } = require("transliteration");

// ✅ 절대 경로로 지정 (본인 프로젝트 위치에 맞게 수정)
const baseDir = "C:/react/flette_react/public/img/flower";

// 카테고리 폴더들
const folders = ["main", "sub", "foliage"];

// 매핑 테이블 저장할 객체
const mapping = {};

console.log("📂 변환 대상 경로:", baseDir);

folders.forEach((folder) => {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ 폴더 없음: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);

    // 한글 → 로마자 변환
    let romanized = transliterate(name)
      .replace(/\s+/g, "") // 공백 제거
      .toLowerCase();

    // 중복 방지
    let finalName = romanized + ext.toLowerCase();
    let counter = 1;
    while (fs.existsSync(path.join(dir, finalName))) {
      finalName = `${romanized}_${counter}${ext.toLowerCase()}`;
      counter++;
    }

    try {
      fs.renameSync(
        path.join(dir, file),
        path.join(dir, finalName)
      );
      mapping[file] = finalName;
      console.log(`✅ ${file} → ${finalName}`);
    } catch (err) {
      console.error(`❌ ${file} 변경 실패:`, err.message);
    }
  });
});

// 매핑 테이블 저장
const mappingPath = path.join(__dirname, "image-name-map.json");
fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), "utf-8");

console.log(`\n🎉 변환 완료! 매핑 테이블 저장됨 → ${mappingPath}`);
