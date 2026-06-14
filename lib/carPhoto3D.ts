/** Side-profile photo shells for 3D simulators (fallback when no top-down asset). */
export const CAR_PHOTO_3D: Record<string, string> = {};

export function hasPhoto3DShell(modelId?: string) {
  return !!modelId && modelId in CAR_PHOTO_3D;
}
