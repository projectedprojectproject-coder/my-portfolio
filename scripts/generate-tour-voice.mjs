// 내 목소리(ElevenLabs 복제 음성)로 투어 음성 파일(mp3)을 만든다. 내 컴퓨터에서 한 번만 돌리면 된다.
//
// 준비 (키는 대화창이나 코드에 적지 말고, 아래처럼 터미널 환경 변수로만 넣는다)
//   PowerShell:  $env:ELEVENLABS_API_KEY = "여기에_내_API_키"
//                $env:ELEVENLABS_VOICE_ID = "내_복제_음성의_Voice_ID"
//   실행:        npm run tour:voice
// 결과: public/audio/tour/01-hero.mp3 … 10-contact.mp3  (이미 있는 파일은 건너뜀, 다시 만들려면 -- --force)
// ※ API 주소·모델 이름은 ElevenLabs 문서 기준으로 확인해서, 달라졌으면 아래 값을 고친다.
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { tourSteps } from "../src/tour/tourScript.js";

const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_VOICE_ID;
const force = process.argv.includes("--force");
if (!key || !voice) {
  console.error("ELEVENLABS_API_KEY 와 ELEVENLABS_VOICE_ID 환경 변수를 먼저 설정하세요. (파일 맨 위 설명 참고)");
  process.exit(1);
}
const outDir = path.resolve("public/audio/tour");
await mkdir(outDir, { recursive: true });

for (const s of tourSteps) {
  const file = path.join(outDir, path.basename(s.audio));
  if (!force) {
    try {
      await access(file);
      console.log("건너뜀(이미 있음):", path.basename(file));
      continue;
    } catch {
      /* 없으면 만든다 */
    }
  }
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: s.text, model_id: "eleven_multilingual_v2" }),
  });
  if (!res.ok) {
    console.error("실패:", s.id, res.status, (await res.text()).slice(0, 200));
    process.exit(1);
  }
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log("만듦:", path.basename(file));
}
console.log("끝. public/audio/tour/ 의 파일을 들어 보고 어색하면 대본을 고친 뒤 --force 로 다시 만드세요.");
