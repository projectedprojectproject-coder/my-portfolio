import { supabase, MEDIA_BUCKET } from "./supabaseClient";

export function mediaPublicUrl(path) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v|ogv)$/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|ogg|flac|aac)$/i;

const FILE_EXT = /\.(jpe?g|png|gif|webp|svg|avif|mp4|mov|webm|m4v|ogv|mp3|wav|m4a|ogg|flac|aac|pdf|zip|txt)$/i;

// 업로드하면 제목이 원본 파일명(예: "clip.mp4")으로 자동 채워진다. 방문자
// 화면에는 그런 파일명 제목을 보여주지 않고, 관리자가 직접 지어 준 제목만 보여준다.
export function looksLikeFileName(text) {
  return FILE_EXT.test((text || "").trim());
}

// 방문자 화면(미디어 탭)은 Storage 목록 API를 못 쓰므로(익명 list 권한 없음)
// 확장자로 종류를 추정한다. 관리자 화면은 실제 mimetype을 쓴다.
export function guessMediaKind(path) {
  if (IMAGE_EXT.test(path)) return "image";
  if (VIDEO_EXT.test(path)) return "video";
  if (AUDIO_EXT.test(path)) return "audio";
  return "file";
}
