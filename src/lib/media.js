import { supabase, MEDIA_BUCKET } from "./supabaseClient";

export function mediaPublicUrl(path) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v|ogv)$/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|ogg|flac|aac)$/i;

// 방문자 화면(미디어 탭)은 Storage 목록 API를 못 쓰므로(익명 list 권한 없음)
// 확장자로 종류를 추정한다. 관리자 화면은 실제 mimetype을 쓴다.
export function guessMediaKind(path) {
  if (IMAGE_EXT.test(path)) return "image";
  if (VIDEO_EXT.test(path)) return "video";
  if (AUDIO_EXT.test(path)) return "audio";
  return "file";
}
